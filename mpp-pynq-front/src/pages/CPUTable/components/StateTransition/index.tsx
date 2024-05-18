import React, { useState } from "react";
import { unsubscribeToUIUpdates } from "../../../../lib/core";
import { Row, Col, Text } from "atomize";
import { subscribeToUIUpdates, getCore } from "../../../../lib/core/index";
import stateDetails from "./constants.json";

import { Steps } from "antd";
import IconButton from "../../../../components/IconButton";
import { DeleteOutlined } from "@ant-design/icons";
import I18n from "../../../../components/i18n";
const { Step } = Steps;

interface State {
  state: number;
  op: string;
}

export default function StateTransition({ data }: { data: any }) {
  const [states, setStates] = useState<State[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [states.length]);

  async function onUIUpdate() {
    const nextStateNumber = await getCore().get_next_state();
    const currentStateNumber = await getCore().get_state();


    const nextState = stateDetails[nextStateNumber];
    const currentState = stateDetails[currentStateNumber];

    const stss = [currentState, nextState]
    setStates(stss);

  }

  function handleClear() {
    setStates([]);
    setCurrentStep(0);
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
      ref={divRef}
      style={{
        maxHeight: 300,
        overflow: "auto",
        width: 240,
        padding: 8,
        backgroundColor: "#f5f5f5",
      }}
      className="pretty-shadow"
    >
      <Row>
        <Col size="100%">
          <Text tag="h4" textSize="display4">
            <I18n k={data.labelKey} />
          </Text>
        </Col>
      </Row>
      <Row>
        <Col size="100%">
          <Steps direction="vertical" size="small" current={currentStep} type="default" style={{textAlign: 'left'}} >
            {states.map((state: State, index: number, arr) => {
              let title = null;
              if (index === arr.length - 1) {

                title = (
                  <I18n k="transitionstates.nextState" />
                );
              } else if (index === arr.length - 2) {
                title = (
                  <I18n k="transitionstates.currentState" />
                )
              }

              return (
                <Step
                  className="state-transition-step"
                  key={index}
                  title={title}
                  status={index === 0 ? "process" : "finish"}
                  description={state.op}
                  progressDot={() => "S" + state.state}
                />
              );
            })}
          </Steps>
        </Col>
      </Row>
      <Row>
        <Col>
          {states.length > 0 ? (
            <IconButton
              icon={<DeleteOutlined />}
              title="Clear"
              onClick={handleClear}
            />
          ) : (
            <sub><I18n k="transitionstates.noStates" /></sub>
          )}
        </Col>
      </Row>
    </div>
  );
}
