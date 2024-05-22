import React, { memo, useEffect } from 'react';
import { Row, Col, Text } from "atomize";
import I18n from '../../../components/i18n';
import { Handle, Position } from '../../../lib/ReactFlow';
import { getCore, subscribeToUIUpdates, unsubscribeToUIUpdates } from '../../../lib/core';

export default memo(function INCNode({ data, id }: any) {
    const [value, setValue] = React.useState(1);

    async function onUIUpdate() {
        const dirBus = await getCore().get_memory_dir_bus();
        setValue(dirBus + 1);
    }

    useEffect(() => {
        subscribeToUIUpdates(onUIUpdate);

        return () => {
            unsubscribeToUIUpdates(onUIUpdate);
        };
    }, []);

    return (
        <div
            style={{
                height: data.height || 300,
                overflow: "hidden",
                width: 100,
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
                    <p><b>+1</b> = 0x{value.toString(16).padStart(4, '0').toUpperCase()}</p>
                </Col>

                <Handle
                    id="inc-in"
                    type="target"
                    position={Position.Top}
                    style={{
                        background: "#555",
                        position: "absolute",
                        left: "50%",
                    }}
                    isConnectable={false}
                />
                <Handle
                    id="inc-out"
                    type="source"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "50%",
                    }}
                    isConnectable={false}
                />
            </Row>
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});