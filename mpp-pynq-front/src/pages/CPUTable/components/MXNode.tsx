import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Text } from "atomize";
import { Handle, Position } from 'react-flow-renderer';
import I18n from '../../../components/i18n';
import { getCore, subscribeToUIUpdates, unsubscribeToUIUpdates } from '../../../lib/core';

export default memo(function MXNode({ data, id }: any) {
    const [selMx, setSelMx] = useState(0);
    const [mxOut, setMxOut] = useState(0);

    async function onUiUpdate(controlBus: bigint) {
        const selDir = Number((BigInt(controlBus) >> BigInt(26)) & BigInt(0b11));
        setSelMx(selDir);
        
        const mxOut = await getCore().get_memory_dir_bus();
        setMxOut(mxOut);
    }

    useEffect(() => {
        subscribeToUIUpdates(onUiUpdate);

        return () => {
            unsubscribeToUIUpdates(onUiUpdate);
        }
    }, []);

    return (

        <div
            style={{
                height: data.height || 300,
                overflow: "hidden",
                width: data.width || 220,
                padding: 8,
                backgroundColor: "#f5f5f5",
            }}
            className="pretty-shadow"
        >
            <div style={{ position: 'absolute', right: 0, top: "47%", paddingRight: 10 }}>
                0x{mxOut.toString(16).padStart(4, '0').toUpperCase()}
            </div>

            <Row>
                <Col size="100%">
                    <Text tag="h4" textSize="display4">
                        <I18n k={data.labelKey} />
                    </Text>
                </Col>
            </Row>
            <Row>
                <Col size="100%">
                    <svg width="75" height="200" xmlns="http://www.w3.org/2000/svg" version="1.0">
                        <g>
                            <title>Layer 1</title>
                            <g id="layer1">
                                <g id="g7601">
                                    <path strokeMiterlimit="4" markerStart="none" strokeWidth="2" stroke="#000000" fillRule="evenodd" fillOpacity="0.75" fill="white" id="path1326" d="m0,0l0,200l75,-45l0,-110l-75,-45" />
                                    <path strokeMiterlimit="4" markerStart="none" stroke="#000000" fillRule="evenodd" fillOpacity="0.75" fill="none" id="path1332" d="m0,160" />
                                    <path strokeMiterlimit="4" markerStart="none" stroke="#000000" fillRule="evenodd" fillOpacity="0.75" fill="none" id="path2219" d="m0,120" />
                                    <text fontFamily="Arial" strokeWidth="1px" textAnchor="start" fontWeight={selMx === 0b00 ? "bold" : "normal"} fill={selMx === 0b00 ? "red" : "#000000"} fontStyle="normal" fontSize="12px" xmlSpace="preserve" id="text7463" y="44.23926" x="4.00001">
                                        <tspan id="tspan7465" y="44.23926" x="4.33331">00</tspan>
                                    </text>
                                    <text fontFamily="Arial" strokeWidth="1px" textAnchor="start" fontWeight={selMx === 0b01 ? "bold" : "normal"} fill={selMx === 0b01 ? "red" : "#000000"} fontStyle="normal" fontSize="12px" xmlSpace="preserve" id="text7467" y="84.23926" x="4.00001">
                                        <tspan id="tspan7469" y="84.23926" x="4.33331">01</tspan>
                                    </text>
                                    <text fontFamily="Arial" strokeWidth="1px" textAnchor="start" fontWeight={selMx === 0b10 ? "bold" : "normal"} fill={selMx === 0b10 ? "red" : "#000000"} fontStyle="normal" fontSize="12px" xmlSpace="preserve" id="text7471" y="124.23926" x="3.00001">
                                        <tspan id="tspan7473" y="124.23926" x="3.33331">10</tspan>
                                    </text>
                                    <text fontFamily="Arial" strokeWidth="1px" textAnchor="start" fontWeight={selMx === 0b11 ? "bold" : "normal"} fill={selMx === 0b11 ? "red" : "#000000"} fontStyle="normal" fontSize="12px" xmlSpace="preserve" id="text7475" y="164.3125" x="3.50001">
                                        <tspan id="tspan7477" y="164.3125" x="3.83331">11</tspan>
                                    </text>
                                </g>
                            </g>
                        </g>

                    </svg>
                </Col>

                <Handle
                    id="mx-00"
                    type="target"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "27%",
                    }}
                    isConnectable={false}
                />
                <Handle
                    id="mx-01"
                    type="target"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "44%",
                    }}
                    isConnectable={false}
                />
                <Handle
                    id="mx-10"
                    type="target"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "60%",
                    }}
                    isConnectable={false}
                />
                <Handle
                    id="mx-11"
                    type="target"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "78%",
                    }}
                    isConnectable={false}
                />

                <Handle
                    id="mx-out"
                    type="source"
                    position={Position.Right}
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