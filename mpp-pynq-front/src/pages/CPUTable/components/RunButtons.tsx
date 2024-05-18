import {
  VerticalAlignBottomOutlined,
  ArrowDownOutlined,
  StopFilled,
  SendOutlined,
} from "@ant-design/icons";
import { sleep } from "../../../lib/utils";
import {
  addChangeListener,
  removeChangeListener,
  SettingDefaultValue,
  SettingType,
} from "./Settings";
import { useState, useEffect, useRef } from "react";
import { getStoredValue } from "../../../lib/storage";
import { Space, Button, Tooltip, Collapse, List } from "antd";
import { getCore } from "../../../lib/core/index";
import I18n, { useI18n } from "../../../components/i18n";
import toast from "react-hot-toast";

const { Panel } = Collapse;

export let clockCycleTime = -1;
const maxTimeInmediate = 10 * 1000;
const buttonsInfo = [
  {
    description: <I18n k="words.runProgram" />,
    icon: <SendOutlined />,
  },
  {
    description: <I18n k="words.runInstruction" />,
    icon: <ArrowDownOutlined />,
  },
  {
    description: <I18n k="words.runState" />,
    icon: <VerticalAlignBottomOutlined />,
  },
  {
    description: <I18n k="words.stop" />,
    icon: <StopFilled />,
  },
];

function RunButtonsInfo() {
  return (
    <Collapse bordered={false}>
      <Panel header={useI18n("whatIsThis")} key="1">
        <List
          itemLayout="horizontal"
          dataSource={buttonsInfo}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={item.icon} title={item.description} />
            </List.Item>
          )}
        />
      </Panel>
    </Collapse>
  );
}

export default function RunButtons() {
  const [running, setRunning] = useState(false);
  const _running = useRef<boolean>();
  const [isRuningInmediate, setIsRuningInmediate] = useState(false);
  const isBreak = useRef<AbortController>(new AbortController());

  async function handleRunState() {
    setRunning(true);
    clockCycleTime = await getCore().run_clock_cycle(true);
    setRunning(false);
  }

  async function handleRunInstruction() {
    const cycleTime = getStoredValue(
      SettingType.CYCLE_TIME,
      SettingDefaultValue.CYCLE_TIME
    );
    _running.current = true;

    setRunning(true);

    await getCore().run_instruction(cycleTime, true);
    setRunning(false);
    _running.current = false;
  }

  async function handleRunProgram() {
    setRunning(true);

    let t;
    if (isRuningInmediate) {
      t = toast.loading(<I18n k="status.running" capitalize />, {
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });

      await sleep(100, isBreak.current.signal); // wait for the toast to be rendered
    }

    let start = new Date().getTime();

    const cycleTime = getStoredValue(
      SettingType.CYCLE_TIME,
      SettingDefaultValue.CYCLE_TIME
    );
    _running.current = true;

    let lastCheck = start;

    const checkFn = async () => {
      const now = new Date().getTime();
      if (now - lastCheck > maxTimeInmediate && isRuningInmediate) {

        const shouldContinue = await new Promise((resolve) => {
          toast(
            (t) => (
              <div style={{ display: 'block' }}>
                <b><I18n k="status.runningTooLong" capitalize /></b>
                <div style={{ height: 10 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }} />
                  <Button
                    type="primary"
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(true);
                    }}
                  >
                    <SendOutlined />
                    {" "}
                    <I18n k="words.continue" />
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(false);
                    }}
                    danger
                  >
                    <StopFilled />
                    {" "}
                    <I18n k="words.stop" />
                  </Button>
                </div>
              </div>
            ),
            {
              duration: Infinity,
              position: 'bottom-right',
              style: {
                background: "#fffeae",
              }
            }
          );
        });
        if (!shouldContinue) {
          await getCore().abort_running();
        } else {
          lastCheck = new Date().getTime();
          setTimeout(checkFn, 500);
        }
      }

    }

    setTimeout(checkFn, 500);

    const time = (await getCore().run_program(cycleTime, !isRuningInmediate)) * 1000;

    if (isRuningInmediate) {
      toast.dismiss(t);
    }

    setRunning(false);
    _running.current = false;

    const shouldMeasureTime = getStoredValue(
      SettingType.MEASURE_RUN_TIME,
      SettingDefaultValue.MEASURE_RUN_TIME
    );

    if (shouldMeasureTime) {
      toast(`Time: ${time.toFixed(2)}ms`, {
        icon: "🕒",
      });
    }
  }

  const handleStopRunning = async () => {
    _running.current = false; // will stop running the next loop
    // it can be in the sleep function so we abort the sleep
    isBreak.current.abort();
    await getCore().abort_running();
    isBreak.current = new AbortController();
  };

  useEffect(() => {
    _running.current = running;
    // isCurrentRunning = running;
  }, [running]);

  useEffect(() => {
    const initialCycleTime = getStoredValue(
      SettingType.CYCLE_TIME,
      SettingDefaultValue.CYCLE_TIME
    );
    setIsRuningInmediate(initialCycleTime < 500);

    const cb = (v: number) => {
      setIsRuningInmediate(v < 500);
    };
    addChangeListener(SettingType.CYCLE_TIME, cb);

    return () => {
      removeChangeListener(SettingType.CYCLE_TIME, cb);
    };
  }, []);

  return (
    <Space direction="vertical" size="middle">
      <Space className="runButtons onboarding-runButtons">
        <Tooltip title={<I18n k="words.runProgram" />}>
          <Button
            type="primary"
            style={{
              backgroundColor: isRuningInmediate ? "orange" : undefined,
              borderColor: isRuningInmediate ? "orange" : undefined,
            }}
            icon={<SendOutlined />}
            onClick={handleRunProgram}
            disabled={running}
            size={"middle"}
          />
        </Tooltip>

        <Tooltip title={<I18n k="words.runInstruction" />}>
          <Button
            type="primary"
            icon={<ArrowDownOutlined />}
            onClick={handleRunInstruction}
            disabled={running}
            size={"middle"}
          />
        </Tooltip>
        <Tooltip title={<I18n k="words.runState" />}>
          <Button
            type="primary"
            icon={<VerticalAlignBottomOutlined />}
            onClick={handleRunState}
            disabled={running}
            size={"middle"}
          />
        </Tooltip>
        <Tooltip title={<I18n k="words.stop" />}>
          <Button
            type="primary"
            icon={<StopFilled />}
            onClick={handleStopRunning}
            disabled={!running || isRuningInmediate}
            size={"middle"}
          />
        </Tooltip>
      </Space>
      <p style={{ fontSize: 10 }}>
        <I18n k="words.status" />:{" "}
        {running ? <I18n k="status.running" /> : <I18n k="status.stopped" />}
      </p>
      <RunButtonsInfo />
    </Space>
  );
}
