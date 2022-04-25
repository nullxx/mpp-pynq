import React, { useState } from "react";
import { Drawer, Button, Space, Popconfirm } from "antd";
import { DrawerProps } from "antd/es/drawer";
import CodeEditor from "./components/CodeEditor";
import { execute } from "../../lib/core/index";
import IconButton from "../../components/IconButton";
import { CodeOutlined } from "@ant-design/icons";

const Coder: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<DrawerProps["size"]>();
  const [canSaveToMem, setCanSaveToMem] = useState(false);
  const [initOffset, setInitOffset] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);

  const showDefaultDrawer = () => {
    setSize("default");
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const handleSaveToMemory = () => {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      execute("set_memory_value", initOffset + i, parseInt(slot, 16));
    }
    onClose();
  };

  const onNewTranslation = (lines: string[] | null) => {
    setCanSaveToMem(lines !== null);
    if (lines) {
      setSlots(lines);
    }
  };

  const onNewOffset = (offset: number) => {
    setInitOffset(offset);
  };

  return (
    <>
      <Space>
        <IconButton
          title="Code"
          icon={<CodeOutlined />}
          onClick={showDefaultDrawer}
        />
      </Space>
      <Drawer
        title="Code"
        placement="right"
        size={size}
        onClose={onClose}
        visible={visible}
        extra={
          <Space>
            <Popconfirm
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={onClose}
            >
              <Button>Cancel</Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={handleSaveToMemory}
              disabled={!canSaveToMem}
            >
              SAVE
            </Button>
          </Space>
        }
      >
        <CodeEditor
          onNewTranslation={onNewTranslation}
          onNewOffset={onNewOffset}
        />
      </Drawer>
    </>
  );
};

export default Coder;