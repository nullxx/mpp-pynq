/*
 * File: /src/lib/components/cu.c
 * Project: mpp-cpu
 * File Created: Saturday, 2nd April 2022 1:22:58 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Saturday, 2nd April 2022 1:23:13 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#include "cu.h"

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include "../../constants.h"
#include "../../electronic/bus.h"
#include "../../error.h"
#include "../../logger.h"
#include "../../pubsub.h"
#include "../../utils.h"
#include "../../watcher.h"
#include "../acumm.h"
#include "../addsub.h"
#include "../alu.h"
#include "../components.h"
#include "../controllers/flagsinta.h"
#include "../controllers/mxfldx.h"
#include "../fffc.h"
#include "../flags.h"
#include "../greg.h"
#include "../hl.h"
#include "../mem.h"
#include "../mxdir.h"
#include "../mxreg.h"
#include "../op2.h"
#include "../pc.h"
#include "../sp.h"
#include "dxflipflop.h"
#include "rom.h"
#include "seq.h"
#include "seq_fgs_jnr.h"

Register RI_reg = {.bit_length = RI_REG_SIZE_BIT};

RegisterWatcher RI_reg_watcher = {.name = "RI", .reg = &RI_reg};

static Bus_t *last_bus_data = NULL;
static Bus_t *last_bus_flags_out = NULL;
static Bus_t *control_bus = NULL;
static PubSubSubscription *data_bus_topic_subscription = NULL;
static PubSubSubscription *flags_out_bus_topic_subscription = NULL;
static PubSubSubscription *control_bus_topic_subscription = NULL;

void dispatch_clock_start(void) {
    // 1hz = 1 cyle per second
    // 1GHz = 1.000.000.000 cycles per second
    log_info("Starting clock...");

    log_info("Initial state");
    log_watchers();

    pause_execution("Press any key to start");

    while (1) {
        clock_t start = clock();
        run_cu();
        clock_t end = clock();

        double seconds_spent = (double)(end - start) / CLOCKS_PER_SEC;
        log_info("Cycle time: %fs => %f KHz", seconds_spent, (1 / seconds_spent) / 1000);

        log_watchers();
        pause_execution("Press [ENTER] to continue...");
    }
}

static OpStateTrace *create_state_trace(const OpState *state) {
    OpStateTrace *trace = (OpStateTrace *)malloc(sizeof(OpStateTrace));
    if (trace == NULL) {
        Error err = {.show_errno = false, .type = FATAL_ERROR, .message = "Failed to allocate memory for state trace"};
        throw_error(err);
        return NULL;
    }
    if (state != NULL) trace->state = *state;
    trace->next = NULL;
    return trace;
}

static OpStateTrace *add_next_state_trace_from(OpStateTrace *trace, OpState state) {
    if (trace == NULL) return NULL;

    trace->next = create_state_trace(&state);
    if (trace->next == NULL) return NULL;
    trace->next->state = state;

    return trace->next;
}

static OpStateTrace *state_trace;

typedef struct {
    int fc;
    int fz;
} FlagsState;

FlagsState get_flags(void) {
    FlagsState flags;
    flags.fc = last_bus_flags_out->current_value.bits[1] == 1;
    flags.fz = last_bus_flags_out->current_value.bits[0] == 1;
    return flags;
}

void init_cu(void) {
    initialize_word(&RI_reg.value, 0);

    last_bus_data = create_bus_data();
    last_bus_flags_out = create_bus_data();
    control_bus = create_bus_data();
    data_bus_topic_subscription = subscribe_to(DATA_BUS_TOPIC, last_bus_data);
    flags_out_bus_topic_subscription = subscribe_to(FLAGS_OUTPUT_BUS_TOPIC, last_bus_flags_out);
    control_bus_topic_subscription = subscribe_to(CONTROL_BUS_TOPIC, control_bus);

    register_watcher(&RI_reg_watcher);

    // state_trace = (OpStateTrace *)create_state_trace(&s0);
    init_cu_seq_b_jnr();
    init_cu_seq();
    init_cu_dxflipflop();
    init_cu_rom();

    dispatch_clock_start();
}

void shutdown_cu(void) {
    free(state_trace);
    unregister_watcher(&RI_reg_watcher);

    unsubscribe_for(data_bus_topic_subscription);
    unsubscribe_for(flags_out_bus_topic_subscription);
    unsubscribe_for(control_bus_topic_subscription);
    destroy_bus_data(last_bus_data);
    destroy_bus_data(last_bus_flags_out);
    destroy_bus_data(control_bus);
}

void run_asyncronus_components(void) {
    run_addsub();
    run_mxdir();

    for (size_t i = 0; i < ALU_MEM_RELATION; i++) {
        run_mem();
        run_alu();
    }
}

void run_sync_comp(void (*run_comp_fn)(void)) {
    run_comp_fn();
    run_asyncronus_components();
}

void run_cu(void) {  // 1 opstate per run
    // log_debug("Running S%d", state_trace->state.id);
    // process_state_loadbits(state_trace->state);

    run_cu_seq_b_jnr();
    run_cu_seq();
    run_cu_dxflipflop();
    run_cu_rom();

    run_asyncronus_components();

    update_bus_data(last_bus_data);
    update_bus_data(last_bus_flags_out);
    update_bus_data(control_bus);

    if (control_bus->current_value.bits[CONTROL_BUS_RICAR_BIT_POSITION] == 1) {
        // load
        if (get_used_bits(word_to_int(last_bus_data->current_value)) > RI_reg.bit_length) {
            Error err = {.show_errno = false, .type = NOTICE_ERROR, .message = "Overflow attemping to load to RI register"};
            throw_error(err);
        }

        RI_reg.value = last_bus_data->current_value;
    }

    publish_message_to(CU_RI_OUTPUT_BUS_TOPIC, RI_reg.value);

    // run_mem(); // <<==  is asyncroneous

    // run_fffc();
    run_sync_comp(run_fffc);

    // run_mxdir(); // <<==  is asyncroneous
    // run_addsub(); // <<== is asyncroneous

    // run_acumm();
    run_sync_comp(run_acumm);

    // run_op2();
    run_sync_comp(run_op2);

    // run_greg();
    run_sync_comp(run_greg);

    // run_alu(); // <<== is asyncroneous

    // run_hl();
    run_sync_comp(run_hl);

    // run_sp();
    run_sync_comp(run_sp);

    // cll_run_mxfldx();
    run_sync_comp(cll_run_mxfldx);

    // run_flags();
    run_sync_comp(run_flags);

    // cll_run_flagsinta();
    run_sync_comp(cll_run_flagsinta);

    // run_pc();
    run_sync_comp(run_pc);

    // OpStateTrace *tmp_next_state_trace = state_trace->next;
    // free(state_trace);
    // if end of trace is reached, go to s0
    // state_trace = tmp_next_state_trace == NULL ? create_state_trace(&s0) : tmp_next_state_trace;
}