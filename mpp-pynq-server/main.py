from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from pynq import Overlay, PL
import time
from threading import Lock

app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")
connected_clients = set()

ABORTED_RUNNING_PROGRAM = False
ABORTED_RUNNING_INSTRUCTION = False

PL.reset()

name = "archived/mpp.bit"
base = Overlay(name, download=True) # must be here to initiate it from the main thread

PC_REG_OFFSET = 0
DATA_BUS_REG_OFFSET = 1
DIR_BUS_REG_OFFSET = 2
ACUM_REG_OFFSET = 3
OP2_REG_OFFSET = 4
SP_REG_OFFSET = 5
H_REG_OFFSET = 6
L_REG_OFFSET = 7
RI_REG_OFFSET = 8
STATE_REG_OFFSET = 9
NEXT_STATE_REG_OFFSET = 10
MEM_VALUE_READED_REG_OFFSET = 11
MXDIR_OUT_REG_OFFSET = 12
RB_REG_OFFSET = 13
RC_REG_OFFSET = 14
RD_REG_OFFSET = 15
RE_REG_OFFSET = 16
ALU_OUT_REG_OFFSET = 17
FZ_REG_OFFSET = 18
FC_REG_OFFSET = 19
CONTROL_BUS_P1_REG_OFFSET = 20
CONTROL_BUS_P2_REG_OFFSET = 21

available_registers = {
    "PC_REG_OFFSET": 0,
    "DATA_BUS_REG_OFFSET": 1,
    "DIR_BUS_REG_OFFSET": 2,
    "ACUM_REG_OFFSET": 3,
    "OP2_REG_OFFSET": 4,
    "SP_REG_OFFSET": 5,
    "H_REG_OFFSET": 6,
    "L_REG_OFFSET": 7,
    "RI_REG_OFFSET": 8,
    "STATE_REG_OFFSET": 9,
    "NEXT_STATE_REG_OFFSET": 10,
    "MEM_VALUE_READED_REG_OFFSET": 11,
    "MXDIR_OUT_REG_OFFSET": 12,
    "RB_REG_OFFSET": 13,
    "RC_REG_OFFSET": 14,
    "RD_REG_OFFSET": 15,
    "RE_REG_OFFSET": 16,
    "ALU_OUT_REG_OFFSET": 17,
    "FZ_REG_OFFSET": 18,
    "FC_REG_OFFSET": 19,
}

@socketio.on('connect')
def handle_connect():
    connected_clients.add(request.sid)
    socketio.emit('client_count', {'count': len(connected_clients)})

@socketio.on('disconnect')
def handle_disconnect():
    connected_clients.remove(request.sid)
    socketio.emit('client_count', {'count': len(connected_clients)})

def emit_update_ui(requestID):
    socketio.emit("update_ui", {"id": requestID})
    
def answer_event(event_name, data):
    socketio.emit(event_name + "_done", data)

def answer_event_error(event_name, data):
    socketio.emit(event_name + "_error", data)

def build_register(signal_defaults, default_values=None, **kwargs):
    if default_values is None:
        default_values = {}

    for arg in kwargs:
        if arg not in signal_defaults:
            raise ValueError(f"Invalid signal name: {arg}")

    register = 0

    for signal, (low_bit, high_bit) in signal_defaults.items():
        value = kwargs.get(signal, default_values.get(signal, 0))
        mask = (1 << (high_bit - low_bit + 1)) - 1
        value = (value & mask) << low_bit
        register |= value

    return register


def get_reg0(**kwargs):
    signal_defaults = {
        "flbus": (0, 0),
        "pchbus": (1, 1),
        "pclbus": (2, 2),
        "acbus": (3, 3),
        "accar": (4, 4),
        "albus": (5, 5),
        "selalu": (6, 8),
        "hcar": (9, 9),
        "lcar": (10, 10),
        "op2car": (11, 11),
        "spcar": (12, 12),
        "pccar": (13, 13),
        "pchcar": (14, 14),
        "pclcar": (15, 15),
        "seldir": (16, 17),
        "id_": (18, 19),
        "membus": (20, 20),
        "le": (21, 21),
        "mxreg": (22, 23),
        "regcar": (24, 24),
        "regbus": (25, 25),
        "selfl": (26, 26),
        "flcar": (27, 27),
        "cop10": (28, 29),
        "cop32": (30, 31),
    }
    default_values = {"le": 1}
    return build_register(signal_defaults, default_values, **kwargs)


def get_reg1(**kwargs):
    signal_defaults = {"drive_control": (0, 0)}
    return build_register(signal_defaults, **kwargs)


def get_reg2(**kwargs):
    signal_defaults = {"mclk": (0, 0)}
    return build_register(signal_defaults, **kwargs)


def get_reg3(**kwargs):
    signal_defaults = {
        "lload": (0, 0),
        "data_bus_lload": (1, 8),
        "readmemclk": (9, 9),
        "readmem_offset": (10, 25),
    }
    return build_register(signal_defaults, **kwargs)


def write_reg(reg_num, data) -> None:
    base.get_mclk_0.mmio.write(reg_num * 4, data)


def read_reg(reg_num: int, *other_reg_num: list[int]) -> int:
    arr: list[int] = []
    arr.append(base.linker_0.mmio.read(reg_num * 4))
    for reg in other_reg_num:
        arr.append(base.linker_0.mmio.read(reg * 4))

    byte = 0
    for i in range(len(arr)):
        byte |= arr[i] << (i * (4 * 8))
    return byte
    

def reset_reg(reg_num):
    reg = 0
    # get the default values!!
    if reg_num == 0:
        reg = get_reg0()
    elif reg_num == 1:
        reg = get_reg1()
    elif reg_num == 2:
        reg = get_reg2()
    elif reg_num == 3:
        reg = get_reg3()

    write_reg(reg_num, reg)


def reset(with_control=True) -> None:
    reset_reg(0)
    reset_reg(1)
    reset_reg(2)
    reset_reg(3)
    write_reg(1, get_reg1(drive_control=(1 if with_control else 0)))


def write_to_mem(offset, value) -> bool:
    l = offset & 0xFF  # Mask all but the last 8 bits
    h = (offset >> 8) & 0xFF

    write_reg(3, get_reg3(lload=1, data_bus_lload=l))
    write_reg(0, get_reg0(lcar=1))
    write_reg(2, get_reg2(mclk=1))

    reset_reg(2)
    reset_reg(0)
    reset_reg(3)

    write_reg(3, get_reg3(lload=1, data_bus_lload=h))
    write_reg(0, get_reg0(hcar=1))
    write_reg(2, get_reg2(mclk=1))

    assert h == read_reg(H_REG_OFFSET)
    assert l == read_reg(L_REG_OFFSET)

    reset_reg(2)
    reset_reg(0)
    reset_reg(3)

    write_reg(3, get_reg3(lload=1, data_bus_lload=value))
    assert read_reg(DATA_BUS_REG_OFFSET) == value
    write_reg(0, get_reg0(le=0, seldir=0b10))
    assert read_reg(DIR_BUS_REG_OFFSET) == offset
    write_reg(2, get_reg2(mclk=1))

    reset_reg(2)
    reset_reg(0)
    reset_reg(3)

    return True


def read_mem(offset: int) -> int:
    write_reg(
        3, get_reg3(readmem_offset=offset)
    )  # the readmem_offset must be BEFORE clk
    write_reg(
        3, get_reg3(readmem_offset=offset, readmemclk=1)
    )  # the readmem_offset could be not present here?
    reset_reg(3)

    write_reg(3, get_reg3(readmem_offset=offset))
    write_reg(3, get_reg3(readmem_offset=offset, readmemclk=1))
    value = read_reg(MEM_VALUE_READED_REG_OFFSET)

    reset_reg(3)
    return value


def read_mem_blk(offsetStart: int, offsetEnd: int) -> list[int]:
    return [read_mem(offset) for offset in range(offsetStart, offsetEnd + 1)]

def set_pc(pc_value: int) -> None:
    reset(with_control=True)

    pcl = pc_value & 0xFF  # Mask all but the last 8 bits
    pch = (pc_value >> 8) & 0xFF

    write_reg(3, get_reg3(lload=1, data_bus_lload=pcl))
    write_reg(0, get_reg0(pclcar=1))
    write_reg(2, get_reg2(mclk=1))

    reset_reg(2)
    reset_reg(0)
    reset_reg(3)

    write_reg(3, get_reg3(lload=1, data_bus_lload=pch))
    write_reg(0, get_reg0(pchcar=1))
    write_reg(2, get_reg2(mclk=1))

    reset_reg(2)
    reset_reg(0)
    reset_reg(3)

    reset(with_control=False)


def run_cycle() -> float:
    time_start = time.time()
    write_reg(2, get_reg2(mclk=1))
    reset_reg(2)
    return time.time() - time_start


def skip_cycles(
    until_state=0, skip_first=False, cycle_sleep_time=0, updateUI=False, requestID=""
) -> int:
    global ABORTED_RUNNING_INSTRUCTION

    limit = 10
    skip_count = 0

    while True:
        if read_reg(STATE_REG_OFFSET) == until_state and (
            not skip_first or skip_count > 0
        ):
            break

        run_cycle()

        if updateUI:
            emit_update_ui(requestID)

        if cycle_sleep_time > 0:
            time.sleep(cycle_sleep_time / 1000)

        if ABORTED_RUNNING_INSTRUCTION == True:
            print(f"Aborted running instruction")
            ABORTED_RUNNING_INSTRUCTION = False
            return -1

        skip_count += 1
        if skip_count == limit:
            print(f"Skipped {skip_count} times but not found state {until_state}")
            break

    return skip_count


def load_program(program_bytes, offset_to_write=0x0000, pc_start=0) -> None:
    reset(with_control=True)

    for i in range(len(program_bytes)):
        write_to_mem(offset_to_write + i, program_bytes[i])

    set_pc(pc_start)

    reset(with_control=False)

    skip_cycles(until_state=0)


def execute_instruction(cycle_sleep_time=0, updateUI=False, requestID="") -> float:
    time_start = time.time()
    skip_cycles(
        until_state=0,
        skip_first=True,
        cycle_sleep_time=cycle_sleep_time,
        updateUI=updateUI,
        requestID=requestID,
    )
    return time.time() - time_start


def execute_program(cycle_sleep_time=0, updateUI=False, requestID="") -> float:
    global ABORTED_RUNNING_PROGRAM
    limit = 100
    fin_instruction_code = 0xFF

    elapsed_time = 0

    executed_instructions = 0
    time_start = time.time()
    while True:
        if read_reg(RI_REG_OFFSET) == fin_instruction_code:
            break

        execute_instruction(
            cycle_sleep_time=cycle_sleep_time, updateUI=False, requestID=requestID
        )

        # we don't refresh the UI for each state inside the instruction, just after
        if updateUI:
            emit_update_ui(requestID)

        if ABORTED_RUNNING_PROGRAM == True:
            print(f"Aborted running program")
            ABORTED_RUNNING_PROGRAM = False
            break

        executed_instructions += 1
        if executed_instructions == limit:
            print(
                f"Executed {executed_instructions} instructions reaching the limit. Are you sure your program had 0xFF for finalizing the execution"
            )
            break

    elapsed_time = time.time() - time_start

    return elapsed_time

@socketio.on("get_client_count")
def handle_get_client_count(data):
    answer_event("get_client_count", {"id": data["id"], "count": len(connected_clients)})

@socketio.on("reset_pl")
def handle_reset_pl(data):
    global ABORTED_RUNNING_INSTRUCTION, ABORTED_RUNNING_PROGRAM

    PL.reset()

    ABORTED_RUNNING_PROGRAM = False
    ABORTED_RUNNING_INSTRUCTION = False

    emit_update_ui(data["id"])
    answer_event("reset_pl", {"id": data["id"], "status": "PL reset done"})


@socketio.on("download_bitstream")
def handle_download_bitstream(data):

    global base, ABORTED_RUNNING_INSTRUCTION, ABORTED_RUNNING_PROGRAM
    base = Overlay(name, download=True)

    ABORTED_RUNNING_PROGRAM = False
    ABORTED_RUNNING_INSTRUCTION = False

    emit_update_ui(data["id"])
    answer_event("download_bitstream", {"id": data["id"], "status": "bitstream downloaded"})


@socketio.on("reset")
def handle_reset(data):
    with_control = data.get("with_control", True)
    reset(with_control)

    emit_update_ui(data["id"])
    answer_event("reset", {"id": data["id"], "status": "reset done"})


@socketio.on("write_reg")
def handle_write_reg(data):
    
    reg_num = data["reg_num"]
    value = data["value"]
    write_reg(reg_num, value)
    answer_event("write_reg", {"id": data["id"], "status": "write done"})


@socketio.on("read_reg")
def handle_read_reg(data):

    reg_num = data["reg_num"]
    if reg_num not in available_registers.values():
        answer_event_error("read_reg", {"id": data["id"], "error": f"Register {reg_num} not exist"})
        return

    value = read_reg(reg_num)
    answer_event("read_reg", {"id": data["id"], "reg_num": reg_num, "value": value})

@socketio.on("get_control_bus")
def handle_get_control_bus(data):
    control_bus = read_reg(CONTROL_BUS_P1_REG_OFFSET, CONTROL_BUS_P2_REG_OFFSET)
    answer_event("get_control_bus", {"id": data["id"], "control_bus": control_bus})

@socketio.on("write_to_mem")
def handle_write_to_mem(data):

    offset = data["offset"]
    value = data["value"]
    write_to_mem(offset, value)

    emit_update_ui(data["id"])
    answer_event("write_to_mem", {"id": data["id"], "status": "write done"})


@socketio.on("read_mem")
def handle_read_mem(data):
    offset = data["offset"]
    value = read_mem(offset)

    answer_event("read_mem", {"id": data["id"], "offset": offset, "value": value})


@socketio.on("read_mem_blk")
def handle_read_mem_blk(data):
    range = data.get("range", [0, 0])
    offsetStart, offsetEnd = range

    values = read_mem_blk(offsetStart, offsetEnd)

    answer_event("read_mem_blk", {"id": data["id"], "range": range, "values": values})


@socketio.on("load_program")
def handle_load_program(data):

    program = data["program"]
    load_program(
        program,
        offset_to_write=data.get("offset_to_write", 0x0000),
        pc_start=data.get("pc_start", 0),
    )

    emit_update_ui(data["id"])
    answer_event("load_program", {"id": data["id"], "status": "program loaded"})


@socketio.on("execute_instruction")
def handle_execute_instruction(data):
    elapsed_time = execute_instruction(
        cycle_sleep_time=data.get("cycle_sleep_time", 0),
        updateUI=data.get("updateUI", False),
        requestID=data.get("id", ""),
    )

    emit_update_ui(data["id"])
    answer_event("execute_instruction", {"id": data["id"], "elapsed_time": elapsed_time})


@socketio.on("execute_program")
def handle_execute_program(data):
    elapsed_time = execute_program(
        cycle_sleep_time=data.get("cycle_sleep_time", 0),
        updateUI=data.get("updateUI", False),
        requestID=data.get("id", ""),
    )

    emit_update_ui(data["id"])
    answer_event("execute_program", {"id": data["id"], "elapsed_time": elapsed_time})


@socketio.on("abort_running")
def handle_abort_running(data):
    global ABORTED_RUNNING_PROGRAM
    global ABORTED_RUNNING_INSTRUCTION
    ABORTED_RUNNING_PROGRAM = True
    ABORTED_RUNNING_INSTRUCTION = True

    emit_update_ui(data["id"])
    answer_event("abort_running", {"id": data["id"]})


@socketio.on("run_cycle")
def handle_run_cycle(data):
    elapsed_time = run_cycle()
    if data["updateUI"] == True:
        emit_update_ui(data["id"])

    answer_event("run_cycle", {"id": data["id"], "elapsed_time": elapsed_time})


@socketio.on("set_pc")
def handle_set_pc(data):
    set_pc(data["value"])
    emit_update_ui(data["id"])
    answer_event("set_pc", {"id": data["id"], "status": "PC set"})


@socketio.on("skip_cycles")
def handle_skip_cycles(data):
    skipped = skip_cycles(until_state=data["until_state"])
    answer_event("skip_cycles", {"id": data["id"], "status": f"skiped {skipped} states"})


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=3000)
