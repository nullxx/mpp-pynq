import React, { useEffect } from "react";
import { Row, Col, Text } from "atomize";
import { Alert } from "antd";
import {
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
  getCore,
} from "../../../../lib/core/index";
import { deductOperationOf, NO_OP_NAME } from "../../../../lib/debugger";
import { useForceUpdate } from "../../../../hook/forceUpdate";
import I18n from "../../../../components/i18n";

const offsetPadding = 50;


function DebuggerComponentRow({
  range,
  operation,
  focus,
}: {
  range: [number, number];
  operation: string;
  focus: boolean;
}) {
  return (
    <Row className={focus ? "debuggerPointed" : undefined}>
      <Col>
        {range[0].toString(16).toUpperCase() +
          "-" +
          range[1].toString(16).toUpperCase()}
      </Col>
      {operation === NO_OP_NAME ? (
        <Col className={focus ? "debuggerPointedOpNotFound" : undefined}>
          {operation}
        </Col>
      ) : (
        <Col className={focus ? "debuggerPointedOp" : undefined}>
          {operation}
        </Col>
      )}
    </Row>
  );
}

function DebuggerComponent({
  memOffset,
}: {
  memOffset: number;
}) {
  const pointerRef = React.useRef<HTMLDivElement>(null);
  const listScrollRef = React.useRef<HTMLDivElement>(null);

  const [result, setResult] = React.useState<any[]>([]);

  const deductOperations = (memOffset: number, offsetPadding: number) => {
    deductOperationOf(memOffset - offsetPadding, memOffset + offsetPadding).then(
      (operations) => {
        setResult(operations);
      }
    );
  }

  const onUIUpdate = () => {
    deductOperations(memOffset, offsetPadding);
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);

    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    deductOperations(memOffset, offsetPadding);
  }, [offsetPadding, memOffset])

  // const result = [] as any[];
  const pointIndex = result?.findIndex(
    ({ range: [start, end] }) => start <= memOffset && end >= memOffset
  );

  React.useEffect(() => {
    if (!pointerRef.current || !listScrollRef.current) return;

    const pointer = pointerRef.current;
    const listScroll = listScrollRef.current;

    const listScrollHeight = listScroll.clientHeight;

    const pointerTop = pointer.offsetTop;
    const pointerHeight = pointer.clientHeight;

    const pointerBottom = pointerTop + pointerHeight;

    listScroll.scrollTop = pointerBottom - listScrollHeight; // maybe is better without smooth, because when the program is fast it will be better
  }, [memOffset]);

  return (
    <>
      <Row>
        <Col>
          <I18n k="debugger.memoryRange" />
        </Col>
        <Col>
          <I18n k="debugger.operation" />
        </Col>
      </Row>
      {pointIndex === -1 && (
        <Row>
          <Col size="100%">
            <Alert
              message={`No operation in 0x${memOffset.toString(16).padStart(4, '0').toUpperCase()}`}
              type="warning"
            />
          </Col>
        </Row>
      )}
      <div style={{ overflow: "hidden", maxHeight: 200 }} ref={listScrollRef}>
        {result?.map((item, i) => {
          return (
            <div
              ref={pointIndex === i ? pointerRef : undefined}
              key={item.range[0] + " " + item.range[1]}
            >
              <DebuggerComponentRow
                range={item.range}
                operation={item.operation}
                focus={pointIndex === i}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

const DebuggerNode = ({ data }: { data: any }) => {
  const [searchValue, setSearchValue] = React.useState(0);

  const forceUpdate = useForceUpdate();

  async function onUIUpdate() {
    setSearchValue(await getCore().get_register_pc());
    forceUpdate(); // need to update state to force re-render because the searchValue is not changed, but the DebuggerComponent could be changed
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
        padding: 10,
        backgroundColor: "#f5f5f5",
      }}
      className="pretty-shadow"
    >
      <Row>
        <Col size="100%">
          <Text tag="h4" textSize="display4">
            {data.label}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col size="100%">
          <DebuggerComponent
            memOffset={searchValue}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DebuggerNode;
