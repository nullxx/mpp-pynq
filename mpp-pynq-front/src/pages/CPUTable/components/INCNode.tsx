import React, { memo, useEffect } from 'react';
import { Row, Col, Text } from "atomize";
import I18n from '../../../components/i18n';
import { Handle, Position } from '../../../lib/ReactFlow';
import { getCore, subscribeToUIUpdates, unsubscribeToUIUpdates } from '../../../lib/core';

const addSubSel = {
    0b10: '+1',
    0b00: '+0',
    0b11: '-1',
}

export default memo(function INCNode({ data }: any) {
    const [value, setValue] = React.useState(1);
    const [id, setId] = React.useState(0);

    async function onUIUpdate(controlBus: bigint) {
        const dirBus = await getCore().get_dir_bus();
        setValue(dirBus);

        const id = Number((BigInt(controlBus) >> BigInt(7)) & BigInt(0b11));
        setId(id);
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                    <p style={{margin: 'unset'}}><b>{addSubSel[id as keyof typeof addSubSel]}</b></p>
                    <span>0x{value.toString(16).padStart(4, '0').toUpperCase()}</span>
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