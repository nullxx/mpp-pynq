import React, { memo } from "react";
import { Handle, Position } from "../../../lib/ReactFlow";
import { Text, Row, Col } from "atomize";
import NumberBaseInput from "../../../components/NumberBaseInput";
import {
  execute,
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../../../lib/core";
import I18n from "../../../components/i18n";
import allEdges from "../constants/edges";

const DEFAULT_BUS_VALUE = 0;

function getEdges(isSourceHandle: boolean, pos: string) {
  const key = isSourceHandle ? "sourceHandle" : "targetHandle";
  const positions = allEdges.map((edge) => {
    let data = null;
    // eslint-disable-next-line no-cond-assign
    if (data = edge[key]) { // databus-bottom-target
      const [, position, , num] = data.split("-");
      if (position === pos) {
        return Number(num);
      }
    }
    return null;
  })
    .filter((pos) => pos !== null)
    .filter((value, index, self) => self.indexOf(value) === index);

  return positions;
}

const handleSourceBottomPositions = getEdges(true, "bottom");
const handleTargetBottomPositions = getEdges(false, "bottom");
const handleSourceTopPositions = getEdges(true, "top");
const handleTargetTopPositions = getEdges(false, "top");

export default memo(({ data, isConnectable, id }: any) => {
  const [value, setValue] = React.useState(DEFAULT_BUS_VALUE);
  const [, setChanged] = React.useState(false);

  async function onUIUpdate() {
    if (!data.getFunction)
      return console.warn(
        `Not updating ${data.label}. Missing data.getFunction`
      );

    const out = await execute(data.getFunction);

    setValue((prevValue) => {
      let hasChanged = false;
      if (prevValue !== out) {
        hasChanged = true;
      }
      setChanged(hasChanged);
      return out;
    });
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: data.width,
        padding: 5,
      }}
      className="bus pretty-shadow"
    >
      <Row>
        <Col>
          <Text tag="p" textSize="display5">
            <I18n k={data.labelKey} />
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberBaseInput
            initialBase="HEX"
            number={value}
            width={180}
            readOnly
          />
        </Col>
      </Row>

      {handleSourceTopPositions.map((position) => (
        <Handle
          key={`${id}-top-source-${position}`}
          id={`${id}-top-source-${position}`}
          type="source"
          position={Position.Top}
          style={{
            background: "#555",
            position: "absolute",
            left: `${position}%`,
          }}
          isConnectable={false}
        />
      ))}

      {handleTargetTopPositions.map((position) => (
        <Handle
          key={`${id}-top-target-${position}`}
          id={`${id}-top-target-${position}`}
          type="target"
          position={Position.Top}
          style={{
            background: "#555",
            position: "absolute",
            left: `${position}%`,
          }}
          isConnectable={false}
        />
      ))}

      {handleSourceBottomPositions.map((position) => (
        <Handle
          key={`${id}-bottom-source-${position}`}
          id={`${id}-bottom-source-${position}`}
          type="source"
          position={Position.Bottom}
          style={{
            background: "#555",
            position: "absolute",
            left: `${position}%`,
          }}
          isConnectable={false}
        />
      ))}

      {handleTargetBottomPositions.map((position) => (
        <Handle
          key={`${id}-bottom-target-${position}`}
          id={`${id}-bottom-target-${position}`}
          type="target"
          position={Position.Bottom}
          style={{
            background: "#555",
            position: "absolute",
            left: `${position}%`,
          }}
          isConnectable={false}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});