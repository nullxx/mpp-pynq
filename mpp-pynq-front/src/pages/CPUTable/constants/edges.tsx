import { Edge, MarkerType } from "../../../lib/ReactFlow";

const initialEdges: Edge[] = [
  // {
  //   id: "ri-databus",
  //   source: "ri",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   zIndex: 1,
  //   markerEnd: {
  //     width: 50,
  //     height: 50,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-bottom-target-20",
  // },
  {
    id: "databus-ri",
    source: "databus",
    target: "ri",
    animated: false,
    type: "smoothstep",
    zIndex: 1,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-top-source-8",
    targetHandle: "ri-bottom-target-60",
  },
  {
    id: "databus-registersbank",
    source: "databus",
    target: "registers-bank",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-top-source-44",
    targetHandle: "registers-bank-bottom-target-30",
  },
  {
    id: "registersbank-databus",
    source: "registers-bank",
    target: "databus",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    targetHandle: "databus-top-target-55",
    sourceHandle: "registers-bank-bottom-source-70",
  },
  {
    id: "databus-memory",
    source: "databus",
    target: "memory",
    animated: true, // always animated because is always passing data to memory
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-80",
    targetHandle: "memory-top-target-30",
  },
  {
    id: "memory-databus",
    source: "memory",
    target: "databus",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 80,
      type: MarkerType.Arrow,
    },
    targetHandle: "databus-bottom-target-90",
    sourceHandle: "memory-top-source-73",
  },


  {
    id: "databus-pc",
    source: "databus",
    target: "pc",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-5",
  },
  // {
  //   id: "pc-databus",
  //   source: "pc",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   markerEnd: {
  //     width: 50,
  //     height: 80,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-top-target-10",
  // },

  {
    id: "databus-acum",
    source: "databus",
    target: "acum",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-top-source-75",
    targetHandle: 'acum-bottom-target-30'
  },
  {
    id: "acum-databus",
    source: "acum",
    target: "databus",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 80,
      type: MarkerType.Arrow,
    },
    targetHandle: "databus-top-target-79",
    sourceHandle: 'acum-bottom-source-70'
  },

  {
    id: "databus-sp",
    source: "databus",
    target: "sp",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-21.3",
  },
  // {
  //   id: "sp-databus",
  //   source: "sp",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   markerEnd: {
  //     width: 50,
  //     height: 80,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-top-target-45",
  // },

  {
    id: "databus-2op",
    source: "databus",
    target: "2op",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-top-source-90",
    targetHandle: '2op-bottom-target-50'
  },
  // {
  //   id: "2op-databus",
  //   source: "2op",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   markerEnd: {
  //     width: 50,
  //     height: 80,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-top-target-60",
  // },

  {
    id: "databus-h",
    source: "databus",
    target: "h",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-37.3",
  },
  // {
  //   id: "h-databus",
  //   source: "h",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   markerEnd: {
  //     width: 50,
  //     height: 80,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-top-target-77",
  // },

  {
    id: "databus-7",
    source: "databus",
    target: "l",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    sourceHandle: "databus-bottom-source-47.3",
  },
  {
    id: "acum-alu",
    source: "acum",
    target: "alu",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "A",
    sourceHandle: "acum-top-source-50",
    targetHandle: 'alu-input-A'
  },
  {
    id: "2op-alu",
    source: "2op",
    target: "alu",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "B",
    sourceHandle: "2op-top-source-50",
    targetHandle: 'alu-input-B'
  },
  {
    id: "alu-flagsfz",
    source: "alu",
    target: "flags",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "FZ",
    sourceHandle: "alu-output-FZ",
    targetHandle: 'flags-input-FZ'
  },
  {
    id: "alu-flagsfc",
    source: "alu",
    target: "flags",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "FC",
    sourceHandle: "alu-output-FC",
    targetHandle: 'flags-input-FC'
  },
  // {
  //   id: "7-databus",
  //   source: "l",
  //   target: "databus",
  //   animated: false,
  //   type: "smoothstep",
  //   markerEnd: {
  //     width: 50,
  //     height: 80,
  //     type: MarkerType.Arrow,
  //   },
  //   targetHandle: "databus-top-target-95",
  // },
  {
    id: "pc-mx-00",
    source: "pc",
    target: "mx",
    animated: false,
    type: "smoothstep",
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    zIndex: 1,
    label: "PC",
    sourceHandle: "pc-bottom-source-50",
    targetHandle: 'mx-00'
  },
  {
    id: "sp-mx-01",
    source: "sp",
    target: "mx",
    animated: false,
    type: "smoothstep",
    zIndex: 1,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "SP",
    // sourceHandle: "sp-bottom-source-10",
    targetHandle: 'mx-01'
  },
  // {
  //   id: "ri-mx-10",
  //   source: "ri",
  //   target: "mx",
  //   animated: false,
  //   type: "smoothstep",
  //   zIndex: 1,
  //   markerEnd: {
  //     width: 50,
  //     height: 50,
  //     type: MarkerType.Arrow,
  //   },
  //   label: "COP-32",
  //   sourceHandle: "ri-bottom-source-20",
  //   targetHandle: 'mx-11'
  // },
  {
    id: "h-mx-10",
    source: "h",
    target: "mx",
    animated: false,
    type: "smoothstep",
    zIndex: 1,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "HL",
    sourceHandle: "h-bottom-source-100",
    targetHandle: 'mx-10'
  },
  {
    id: "mx-memory",
    source: "mx",
    target: "memory",
    animated: false,
    type: "smoothstep",
    zIndex: 1,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "DIR",
    sourceHandle: "mx-out",
    targetHandle: 'memory-left-target-50'
  },
  {
    id: "mx-inc",
    source: "mx",
    target: "inc",
    animated: false,
    type: "smoothstep",
    zIndex: 0,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "",
    sourceHandle: "mx-out",
    targetHandle: 'inc-in'
  },
  {
    id: "inc-pc",
    source: "inc",
    target: "pc",
    animated: false,
    type: "smoothstep",
    zIndex: 0,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    label: "DIR+1",
    sourceHandle: "inc-out",
    targetHandle: 'pc-bottom-target-25'
  },
  {
    id: "alu-databus",
    source: "alu",
    target: "databus",
    animated: false,
    type: "smoothstep",
    zIndex: 0,
    markerEnd: {
      width: 50,
      height: 50,
      type: MarkerType.Arrow,
    },
    // label: "DIR+1",
    sourceHandle: "alu-left-source-50",
    targetHandle: 'databus-top-target-69.5'
  },
];

export default initialEdges;
