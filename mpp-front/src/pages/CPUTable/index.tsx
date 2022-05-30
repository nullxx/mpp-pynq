import { useState, useCallback, ReactNode } from "react";
import Flow, { applyEdgeChanges, applyNodeChanges } from "../../lib/ReactFlow";
import { Layout, Row, Col } from "antd";

import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeTypes,
} from "../../lib/ReactFlow";

import initialNodes from "./constants/nodes";
import initialEdges from "./constants/edges";
import RegisterNode from "./components/RegisterNode";
import FloatingEdge from "./components/FloatingEdge";
// import FloatingConnectionLine from "./components/FloatingConnectionLine";
import LoadableNode from "./components/LoadableNode";
import BusNode from "./components/BusNode";
import MemoryNode from "./components/MemoryNode";
import ButtonStack from "./components/ButtonStack";
import Settings from "./components/Settings";
import { EdgeTypes } from "react-flow-renderer";
import StateTransition from "./components/StateTransition";

const { Header, Sider, Content } = Layout;

const nodeTypes: NodeTypes = {
  registerNode: RegisterNode as unknown as ReactNode,
  loadableNode: LoadableNode as unknown as ReactNode,
  memoryNode: MemoryNode as unknown as ReactNode,
  stateTransition: StateTransition as unknown as ReactNode,
  busNode: BusNode as unknown as ReactNode, // not used
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge as unknown as ReactNode,
};

function CPUTable() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Header style={{ backgroundColor: "unset" }}>
          <Row>
            <Col span={5} offset={0}>
              <h2>M++ Simulator</h2>
            </Col>
            <Col span={1} offset={18}>
              <Settings />
            </Col>
          </Row>
        </Header>
        <Layout>
          <Content>
            <div
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ccc",
              }}
            >
              <Flow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
              />
            </div>
          </Content>
          <Sider theme="light">
            <ButtonStack />
          </Sider>
        </Layout>
      </Layout>
    </>
  );
}
/*
<CPUImage />
<Input x={132} y={132} height="2rem" /> 
<Input x={175} y={132} height="2rem" /> 
<Input x={132} y={175} height="2rem" /> 
<Input x={175} y={175} height="2rem" />
<Input x={267} y={106} height="22px" /> 
*/
export default CPUTable;
