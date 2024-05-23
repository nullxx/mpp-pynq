import { Row, Col, Text } from "atomize";
import NumberBaseInput from "../../../components/NumberBaseInput";
import { useEffect, useState } from "react";
import {
  getCore,
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../../../lib/core";
import { Handle, Position } from "../../../lib/ReactFlow";
import I18n from "../../../components/i18n";
import Handles from "./Handles";
import useUpdateEdges from "../../../hook/useUpdateEdges";

enum SelAluOp {
  SUM = 0b000,
  SUB = 0b001,
  AND = 0b010,
  OR = 0b011,
  XOR = 0b100,
  NOT = 0b101,
  TRANSPARENT = 0b110,
  INCREMENT = 0b111,
}

const DEFAULT_SELALU_VALUE = 0;

export default function ALUNode({ data, id }: any) {
  const [selAlu, setSelAlu] = useState(DEFAULT_SELALU_VALUE);
  const [output, setOutput] = useState(0);

  useUpdateEdges({ data, id });

  async function onUIUpdate(controlBus: bigint) {
    const selAlu = Number((BigInt(controlBus) >> BigInt(23)) & BigInt(0b111));
    setSelAlu(selAlu);

    const output = await getCore().get_alu_out();
    setOutput(output);
  }

  useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pretty-shadow" style={{ width: 200, padding: 10, backgroundColor: '#f5f5f5' }}>
      <Handles data={data} id={id} />
      <Handle
        id={`${id}-input-A`}
        type="target"
        position={Position.Bottom}
        style={{
          background: "#555",
          position: "absolute",
          left: "30%",
        }}
        isConnectable={false}
      />

      <Handle
        id={`${id}-input-B`}
        type="target"
        position={Position.Bottom}
        style={{
          background: "#555",
          position: "absolute",
          left: "70%",
        }}
        isConnectable={false}
      />

      <Handle
        id={`${id}-output-FZ`}
        type="source"
        position={Position.Right}
        style={{
          background: "#555",
          position: "absolute",
          top: "30%",
        }}
        isConnectable={false}
      />
      <Handle
        id={`${id}-output-FC`}
        type="source"
        position={Position.Right}
        style={{
          background: "#555",
          position: "absolute",
          top: "70%",
        }}
        isConnectable={false}
      />

      <Row>
        <Col size="100%">
          <Text tag="h4" textSize="display4">
            <I18n k={data.labelKey} />
          </Text>
        </Col>
        <Col display="flex">
          <NumberBaseInput
            initialBase="HEX"
            number={output}
            width={153}
            readOnly
          />
          <Text>{SelAluOp[selAlu]}</Text>
        </Col>
      </Row>
    </div>
  );
}
