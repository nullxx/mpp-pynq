import { useEffect, useState } from "react";
import { Spin, Space, Typography } from "antd";
import Image from "../../assets/icon.png";
import Attribution from "../../components/Attribution";
import I18n from "../../components/i18n";
import { onInitializingMessageChange } from "../../lib/core";
import APIConfig from "../../components/APIConfig";

export default function Welcome() {
  const [initializingMessage, setInitializingMessage] = useState<string>("");

  useEffect(() => {
    const del = onInitializingMessageChange(setInitializingMessage);

    return () => {
      del();
    }
  }, []);

  return (
    <Space
      direction="vertical"
      align="center"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        zIndex: 1001,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography.Title><I18n k="title" /></Typography.Title>

      <img src={Image} alt="M++" height={200} />
      {/* <p><I18n k="words.loading" />...</p> */}
      <p>{initializingMessage}</p>
      <Spin size="large" />

      <Attribution />

      <APIConfig />
    </Space>
  );
}
