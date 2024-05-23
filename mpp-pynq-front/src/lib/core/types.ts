

export enum Registers {
  'PC_REG_OFFSET' = 0,
  'DATA_BUS_REG_OFFSET' = 1,
  'DIR_BUS_REG_OFFSET' = 2,
  'ACUM_REG_OFFSET' = 3,
  'OP2_REG_OFFSET' = 4,
  'SP_REG_OFFSET' = 5,
  'H_REG_OFFSET' = 6,
  'L_REG_OFFSET' = 7,
  'RI_REG_OFFSET' = 8,
  'STATE_REG_OFFSET' = 9,
  'NEXT_STATE_REG_OFFSET' = 10,
  'MEM_VALUE_READED_REG_OFFSET' = 11,
  'MXDIR_OUT_REG_OFFSET' = 12,
  'RB_REG_OFFSET' = 13,
  'RC_REG_OFFSET' = 14,
  'RD_REG_OFFSET' = 15,
  'RE_REG_OFFSET' = 16,
  'ALU_OUT_REG_OFFSET' = 17,
  'FZ_REG_OFFSET' = 18,
  'FC_REG_OFFSET' = 19
}

export enum SocketEvents {
  GET_CLIENT_COUNT = 'get_client_count',
  RESET_PL = 'reset_pl',
  DOWNLOAD_BITSTREAM = 'download_bitstream',
  RESET = 'reset',
  WRITE_REG = 'write_reg',
  READ_REG = 'read_reg',
  GET_CONTROL_BUS = 'get_control_bus',
  WRITE_TO_MEM = 'write_to_mem',
  READ_MEM = 'read_mem',
  READ_MEM_BLK = 'read_mem_blk',
  LOAD_PROGRAM = 'load_program',
  RUN_CYCLE = 'run_cycle',
  SET_PC = 'set_pc',
  SKIP_CYCLES = 'skip_cycles',
  EXECUTE_PROGRAM = 'execute_program',
  EXECUTE_INSTRUCTION = 'execute_instruction',
  ABORT_RUNNING = 'abort_running'
}

// the data depends on the event
export interface SocketData {
  [SocketEvents.GET_CLIENT_COUNT]: {};
  [SocketEvents.RESET_PL]: {};
  [SocketEvents.DOWNLOAD_BITSTREAM]: {};
  [SocketEvents.RESET]: { with_control: boolean };
  [SocketEvents.WRITE_REG]: { reg_num: Registers, value: number };
  [SocketEvents.READ_REG]: { reg_num: Registers };
  [SocketEvents.GET_CONTROL_BUS]: {  };
  [SocketEvents.WRITE_TO_MEM]: { offset: number; value: number };
  [SocketEvents.READ_MEM]: { offset: number };
  [SocketEvents.READ_MEM_BLK]: { range: [number, number] };
  [SocketEvents.LOAD_PROGRAM]: { program: number[]; offset_to_write: number };
  [SocketEvents.RUN_CYCLE]: {};
  [SocketEvents.SET_PC]: { value: number };
  [SocketEvents.SKIP_CYCLES]: { until_state: number };
  [SocketEvents.EXECUTE_PROGRAM]: { updateUI: boolean, cycle_sleep_time: number };
  [SocketEvents.EXECUTE_INSTRUCTION]: { updateUI: boolean, cycle_sleep_time: number };
  [SocketEvents.ABORT_RUNNING]: {};
  id: string;
}

export interface SocketResponse {
  [SocketEvents.GET_CLIENT_COUNT]: { count: number };
  [SocketEvents.RESET_PL]: { status: string };
  [SocketEvents.DOWNLOAD_BITSTREAM]: { status: string };
  [SocketEvents.RESET]: { status: string };
  [SocketEvents.WRITE_REG]: { status: string };
  [SocketEvents.READ_REG]: { reg_num: Registers, value: number };
  [SocketEvents.GET_CONTROL_BUS]: { control_bus: bigint; };
  [SocketEvents.WRITE_TO_MEM]: { status: string };
  [SocketEvents.READ_MEM]: { offset: number, value: number };
  [SocketEvents.READ_MEM_BLK]: { range: [number, number]; values: number[] };
  [SocketEvents.LOAD_PROGRAM]: { status: string };
  [SocketEvents.RUN_CYCLE]: { elapsed_time: number };
  [SocketEvents.SET_PC]: { status: string };
  [SocketEvents.SKIP_CYCLES]: { status: string };
  [SocketEvents.EXECUTE_PROGRAM]: { elapsed_time: number };
  [SocketEvents.EXECUTE_INSTRUCTION]: { elapsed_time: number };
  [SocketEvents.ABORT_RUNNING]: { status: string };
  id: string;
}

export interface MppCore {
  get_client_count(): Promise<number>;
  reset_pl(): Promise<void>;
  download_bitstream(): Promise<void>;
  reset(with_control: boolean): Promise<void>;

  shutdown(): Promise<void>;

  get_memory_size(): number;
  get_memory_value_size_bits(): number;
  get_memory_value(offset: number): Promise<number>;
  get_memory_value_blk(range: [number, number]): Promise<number[]>;
  get_memory_dir_bus(): Promise<number>;

  get_alu_out(): Promise<number>;

  get_register_acum(): Promise<number>;
  get_register_fc(): Promise<number>;
  get_register_fz(): Promise<number>;
  get_register_b(): Promise<number>;
  get_register_c(): Promise<number>;
  get_register_d(): Promise<number>;
  get_register_e(): Promise<number>;
  get_register_h(): Promise<number>;
  get_register_l(): Promise<number>;
  get_register_2op(): Promise<number>;
  get_register_pch(): Promise<number>;
  get_register_pcl(): Promise<number>;
  get_register_pc(): Promise<number>;
  get_register_sp(): Promise<number>;
  get_register_ri(): Promise<number>;

  get_data_bus(): Promise<number>;
  get_dir_bus(): Promise<number>;

  get_control_bus_pccar(): Promise<number>;
  get_control_bus_accar(): Promise<number>;
  get_control_bus_acbus(): Promise<number>;
  get_control_bus_spcar(): Promise<number>;
  get_control_bus_2opcar(): Promise<number>;
  get_control_bus_hcar(): Promise<number>;
  get_control_bus_lcar(): Promise<number>;
  get_control_bus_ricar(): Promise<number>;
  get_control_bus_membus(): Promise<number>;
  get_control_bus_le(): Promise<number>;
  get_control_bus_regcar(): Promise<number>;
  get_control_bus_regbus(): Promise<number>;
  get_control_bus_selalu(): Promise<number>;

  run_clock_cycle(updateUI: boolean): Promise<number>;
  get_state(): Promise<number>;
  get_next_state(): Promise<number>;
  skip_cycles(until_state: number): Promise<void>;

  set_memory_value(offset: number, value: number): Promise<void>;
  set_register_pc(value: number): Promise<void>;

  set_program(program: number[], offset_to_write: number): Promise<void>;

  run_program(cycle_sleep_time: number, updateUI: boolean): Promise<number>;
  run_instruction(cycle_sleep_time: number, updateUI: boolean): Promise<number>;
  abort_running(): Promise<void>;
}

export type UIUpdateCallbackFn = (controlBus: bigint) => void;

function throwUninitializedError(fnName: keyof (MppCore)): never {
  throw new Error(
    `Cannot call function ${fnName} because core is not initialized`
  );
}
export function emptyMppCore(): MppCore {
  return {
    get_client_count: async () => {
      throwUninitializedError("get_client_count");
    },

    reset_pl: async () => {
      throwUninitializedError("reset_pl");
    },

    download_bitstream: async () => {
      throwUninitializedError("download_bitstream");
    },

    reset: async () => {
      throwUninitializedError("reset");
    },

    shutdown: () => {
      throwUninitializedError("shutdown");
    },

    get_memory_size: () => {
      throwUninitializedError("get_memory_size");
    },

    get_memory_value_size_bits: () => {
      throwUninitializedError("get_memory_value_size_bits");
    },

    get_memory_value: (offset: number) => {
      throwUninitializedError("get_memory_value");
    },

    get_memory_value_blk(range: [number, number]) {
      throwUninitializedError("get_memory_value_blk");
    },

    get_memory_dir_bus: () => {
      throwUninitializedError("get_memory_dir_bus");
    },

    get_alu_out: () => {
      throwUninitializedError("get_alu_out");
    },

    get_register_acum: () => {
      throwUninitializedError("get_register_acum");
    },

    get_register_fc: () => {
      throwUninitializedError("get_register_fc");
    },

    get_register_fz: () => {
      throwUninitializedError("get_register_fz");
    },

    get_register_b: () => {
      throwUninitializedError("get_register_b");
    },

    get_register_c: () => {
      throwUninitializedError("get_register_c");
    },

    get_register_d: () => {
      throwUninitializedError("get_register_d");
    },

    get_register_e: () => {
      throwUninitializedError("get_register_e");
    },

    get_register_h: () => {
      throwUninitializedError("get_register_h");
    },

    get_register_l: () => {
      throwUninitializedError("get_register_l");
    },

    get_register_2op: () => {
      throwUninitializedError("get_register_2op");
    },

    get_register_pch: () => {
      throwUninitializedError("get_register_pch");
    },

    get_register_pcl: () => {
      throwUninitializedError("get_register_pcl");
    },

    get_register_pc: () => {
      throwUninitializedError("get_register_pc");
    },

    get_register_sp: () => {
      throwUninitializedError("get_register_sp");
    },

    get_register_ri: () => {
      throwUninitializedError("get_register_ri");
    },

    get_data_bus: () => {
      throwUninitializedError("get_data_bus");
    },

    get_dir_bus: () => {
      throwUninitializedError("get_dir_bus");
    },

    get_control_bus_ricar: () => {
      throwUninitializedError("get_control_bus_ricar");
    },

    get_control_bus_pccar: () => {
      throwUninitializedError("get_control_bus_pccar");
    },

    get_control_bus_accar: () => {
      throwUninitializedError("get_control_bus_accar");
    },

    get_control_bus_acbus: () => {
      throwUninitializedError("get_control_bus_acbus");
    },

    get_control_bus_spcar: () => {
      throwUninitializedError("get_control_bus_spcar");
    },

    get_control_bus_2opcar: () => {
      throwUninitializedError("get_control_bus_2opcar");
    },

    get_control_bus_hcar: () => {
      throwUninitializedError("get_control_bus_hcar");
    },

    get_control_bus_lcar: () => {
      throwUninitializedError("get_control_bus_lcar");
    },

    get_control_bus_regcar: () => {
      throwUninitializedError("get_control_bus_regcar");
    },

    get_control_bus_regbus: () => {
      throwUninitializedError("get_control_bus_regbus");
    },

    get_control_bus_membus: () => {
      throwUninitializedError("get_control_bus_membus");
    },

    get_control_bus_le: () => {
      throwUninitializedError("get_control_bus_le");
    },

    get_control_bus_selalu: () => {
      throwUninitializedError("get_control_bus_selalu");
    },

    run_clock_cycle: () => {
      throwUninitializedError("run_clock_cycle");
    },

    get_state: () => {
      throwUninitializedError("get_state");
    },

    get_next_state: () => {
      throwUninitializedError("get_next_state");
    },

    set_memory_value: (offset: number, value: number) => {
      throwUninitializedError("set_memory_value");
    },

    set_register_pc: (value: number) => {
      throwUninitializedError("set_register_pc");
    },

    skip_cycles(until_state: number) {
      throwUninitializedError("skip_cycles");
    },

    set_program(program: number[]) {
      throwUninitializedError("set_program");
    },

    run_program() {
      throwUninitializedError("run_program");
    },

    run_instruction() {
      throwUninitializedError("run_instruction");
    },

    abort_running() {
      throwUninitializedError("abort_running");
    }
  };
}
