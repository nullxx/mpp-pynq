import React, { useEffect } from "react";
import { Row, Col, Text } from "atomize";

import NumberBaseInput, { getRadix } from "../../../components/NumberBaseInput";
import { Base } from "../../../constants/bases";

import {
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
  getCore,
} from "../../../lib/core/index";
import { useForceUpdate } from "../../../hook/forceUpdate";
import { Tooltip } from "antd";
import { getStoredValue } from "../../../lib/storage";
import { SettingType, SettingDefaultValue } from "./Settings";
import { Handle, Position } from "react-flow-renderer";
import useUpdateEdges from "../../../hook/useUpdateEdges";
import I18n from "../../../components/i18n";
import { useReadAsync } from "../../../hook/useReadAsync";

let maxRepresentableOffset = -1;

function MemoryComponentRow({
  offset,
  offsetRadix,
  value,
  style,
  valueBaseRadix,
}: {
  offset: number;
  offsetRadix: number;
  value: number;
  style?: React.CSSProperties;
  valueBaseRadix: number;
}) {
  if (offset < 0 || offset > maxRepresentableOffset) return null;
  

  return (
    <Row style={style}>
      <Col>{offset.toString(offsetRadix).toUpperCase()}</Col>
      <Col>
        {Number(value).toString(valueBaseRadix).toUpperCase()}
        <sub>({valueBaseRadix})</sub>
      </Col>
    </Row>
  );
}

function MemoryComponent({ offset, base }: { offset: number; base: Base }) {
  const radix = getRadix(base);

  const prevOffset = Number(offset - 1);
  const currOffset = Number(offset);
  const nextOffset = Number(offset + 1);

  const [prevValue] = useReadAsync<number>(() => getCore().get_memory_value(prevOffset))
  const [currValue] = useReadAsync<number>(() => getCore().get_memory_value(currOffset))
  const [nextValue] = useReadAsync<number>(() => getCore().get_memory_value(nextOffset))

  const valueBaseRadix = getRadix(
    getStoredValue(
      SettingType.MEM_VALUE_BASE,
      SettingDefaultValue.MEM_VALUE_BASE
    )
  );

  return (
    <div style={{ overflow: "hidden" }}>
      <Row>
        <Col>Offset</Col>
        <Col>Value</Col>
      </Row>
      <MemoryComponentRow
        offset={prevOffset}
        offsetRadix={radix}
        value={prevValue}
        valueBaseRadix={valueBaseRadix}
      />
      <MemoryComponentRow
        offset={currOffset}
        offsetRadix={radix}
        value={currValue}
        style={{ backgroundColor: "#f0c40094" }}
        valueBaseRadix={valueBaseRadix}
      />
      <MemoryComponentRow
        offset={nextOffset}
        offsetRadix={radix}
        value={nextValue}
        valueBaseRadix={valueBaseRadix}
      />
    </div>
  );
}

const MemoryNode = ({ data, id }: { data: any; id: string }) => {
  if (maxRepresentableOffset === -1) maxRepresentableOffset = getCore().get_memory_size() - 1;

  const [searchValue, setSearchValue] = React.useState(0);
  const [base, setBase] = React.useState<Base>("HEX");
  const [LE, setLE] = React.useState(1); // deafult reading

  const forceUpdate = useForceUpdate();
  useUpdateEdges({ data, id });

  async function onUIUpdate() {
    setSearchValue(await getCore().get_memory_dir_bus());
    setLE(await getCore().get_control_bus_le());
    forceUpdate(); // need to update state to force re-render because the searchValue is not changed, but the MemoryComponent could be changed
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (num: number, base: Base) => {
    setSearchValue(num);
    setBase(base);
  };

  const onBaseChange = (base: Base) => {
    setBase(base);
  };

  return (
    <div
      style={{
        height: data.height,
        width: data.width,
        padding: 10,
        backgroundColor: "#f5f5f5",
      }}
      className="pretty-shadow"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555", position: "absolute", left: "30%" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={false}
      />

      <Handle
        type="source"
        position={Position.Top}
        style={{ background: "#555", position: "absolute", left: "70%" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={false}
      />
      <Row>
        <Col>
          <Tooltip title={<I18n k={data.helpInfoKey} />} className="tooltip">
            <Text tag="h4" textSize="display4">
              <I18n k={data.labelKey} />
            </Text>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col size="100%">
          <NumberBaseInput
            initialBase={base}
            number={searchValue}
            onChange={onSearch}
            onBaseChange={onBaseChange}
            width={200}
            max={maxRepresentableOffset}
          />
        </Col>
      </Row>
      <Row>
        <Col size="100%">
          <MemoryComponent offset={searchValue} base={base} />
        </Col>
      </Row>
      <Row>
        <Col size="100%">
          {LE ? <I18n k="memory.reading" /> : <I18n k="memory.writting" />}
        </Col>
      </Row>
    </div>
  );
};

export default MemoryNode;
