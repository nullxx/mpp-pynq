import React, { memo } from "react";
import { Text, Row, Col } from "atomize";
import { Handle, Position } from "react-flow-renderer";
import useUpdateEdges from "../../../hook/useUpdateEdges";
import I18n from "../../../components/i18n";
import Handles from "./Handles";

export default memo(({ data, id }: any) => {
  useUpdateEdges({ data, id });

  return (
    <div
      style={{
        borderRadius: 5,
        padding: 5,
        background: "#fff",
        width: data.width,
        height: data.height,
      }}
      className="loadable-node"
    >
      <Handles data={data} id={id} />

      <Row>
        <Col size="100%">
          <Text tag="h4" textSize="display4">
            <I18n k={data.labelKey} />
          </Text>
        </Col>
      </Row>
    </div>
  );
});
