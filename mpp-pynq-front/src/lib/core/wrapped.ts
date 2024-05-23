import { Socket } from "socket.io-client";
import { MppCore, Registers, SocketEvents, emptyMppCore } from "./types";
import { emitWithReturn } from "../socketio";

export function getMppCoreWrapped(socket: Socket): MppCore {
    return {
        ...emptyMppCore(),

        get_client_count: async () => {
            return (await emitWithReturn(socket, SocketEvents.GET_CLIENT_COUNT, {})).count;
        },

        reset_pl: async () => {
            await emitWithReturn(socket, SocketEvents.RESET_PL, {});
        },

        download_bitstream: async () => {
            await emitWithReturn(socket, SocketEvents.DOWNLOAD_BITSTREAM, {});
        },

        reset: async () => {
            await emitWithReturn(socket, SocketEvents.RESET, { with_control: false });
        },

        shutdown: async () => {
            await emitWithReturn(socket, SocketEvents.RESET, { with_control: true });
        },

        get_memory_size: () => {
            return Math.pow(2, 16);
        },

        get_memory_value_size_bits: () => {
            return 8;
        },

        get_memory_value: async (offset: number) => {
            return (await emitWithReturn(socket, SocketEvents.READ_MEM, { offset })).value;
        },

        get_memory_value_blk: async (range: [number, number]) => {
            return (await emitWithReturn(socket, SocketEvents.READ_MEM_BLK, { range })).values;
        },

        get_memory_dir_bus: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.MXDIR_OUT_REG_OFFSET })).value;
        },

        get_dir_bus: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.DIR_BUS_REG_OFFSET })).value;
        },

        get_alu_out: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.ALU_OUT_REG_OFFSET })).value;
        },

        get_register_acum: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.ACUM_REG_OFFSET })).value;
        },

        get_register_fc: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.FC_REG_OFFSET })).value;
        },

        get_register_fz: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.FZ_REG_OFFSET })).value;
        },

        get_register_b: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.RB_REG_OFFSET })).value;
        },

        get_register_c: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.RC_REG_OFFSET })).value;
        },

        get_register_d: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.RD_REG_OFFSET })).value;
        },

        get_register_e: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.RE_REG_OFFSET })).value;
        },

        get_register_h: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.H_REG_OFFSET })).value;
        },

        get_register_l: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.L_REG_OFFSET })).value;
        },

        get_register_2op: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.OP2_REG_OFFSET })).value;
        },

        get_register_pch: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.PC_REG_OFFSET })).value >> 8;
        },

        get_register_pcl: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.PC_REG_OFFSET })).value & 0xFF;
        },

        get_register_pc: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.PC_REG_OFFSET })).value;
        },

        get_register_sp: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.SP_REG_OFFSET })).value;
        },

        get_register_ri: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.RI_REG_OFFSET })).value;
        },

        get_data_bus: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.DATA_BUS_REG_OFFSET })).value;
        },

        get_control_bus_ricar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(34)) & BigInt(1));
        },

        get_control_bus_pccar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(16)) & BigInt(1));
        },

        get_control_bus_accar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(2)) & BigInt(1));
        },

        get_control_bus_acbus: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(1)) & BigInt(1));
        },

        get_control_bus_spcar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(29)) & BigInt(1));
        },

        get_control_bus_2opcar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(15)) & BigInt(1));
        },

        get_control_bus_hcar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(6)) & BigInt(1));
        },

        get_control_bus_lcar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(10)) & BigInt(1));
        },

        get_control_bus_regcar: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(22)) & BigInt(1));
        },

        get_control_bus_regbus: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(21)) & BigInt(1));
        },

        get_control_bus_membus: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(12)) & BigInt(1));
        },

        get_control_bus_le: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(11)) & BigInt(1));
        },

        get_control_bus_selalu: async () => {
            const { control_bus } = (await emitWithReturn(socket, SocketEvents.GET_CONTROL_BUS, {}));
            return Number((BigInt(control_bus) >> BigInt(23)) & BigInt(0b111));
        },

        run_clock_cycle: async (updateUI: boolean) => {
            const r = await emitWithReturn(socket, SocketEvents.RUN_CYCLE, { updateUI });
            return r.elapsed_time;
        },

        get_state: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.STATE_REG_OFFSET })).value;
        },

        get_next_state: async () => {
            return (await emitWithReturn(socket, SocketEvents.READ_REG, { reg_num: Registers.NEXT_STATE_REG_OFFSET })).value;
        },

        set_memory_value: async (offset: number, value: number) => {
            await emitWithReturn(socket, SocketEvents.WRITE_TO_MEM, { offset, value });
        },

        set_register_pc: async (value: number) => {
            await emitWithReturn(socket, SocketEvents.SET_PC, { value });
        },

        skip_cycles: async (until_state: number) => {
            await emitWithReturn(socket, SocketEvents.SKIP_CYCLES, { until_state });
        },

        set_program: async (program: number[], offset_to_write: number) => {
            await emitWithReturn(socket, SocketEvents.LOAD_PROGRAM, { program, offset_to_write });
        },

        abort_running: async () => {
            await emitWithReturn(socket, SocketEvents.ABORT_RUNNING, {});
        },

        run_instruction: async (cycle_sleep_time: number, updateUI: boolean) => {
            return (await emitWithReturn(socket, SocketEvents.EXECUTE_INSTRUCTION, { cycle_sleep_time, updateUI })).elapsed_time;
        },

        run_program: async (cycle_sleep_time: number, updateUI: boolean) => {
            return (await emitWithReturn(socket, SocketEvents.EXECUTE_PROGRAM, { cycle_sleep_time, updateUI })).elapsed_time;
        }
    };
}

