import React from "react";
import { useReactFlow, useEdges } from "react-flow-renderer";
import {
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../lib/core";

export default function useUpdateEdges({
  data,
  id,
}: {
  data: any;
  id: string;
}) {
  const reactFlowInstance = useReactFlow();
  const allEdges = useEdges();

  const [controlBusBitLoadLabel, setControlBusBitLoadLabel] = React.useState(data?.controlBusBitLoad?.label ? { name: data.controlBusBitLoad.label, value: 0 } : undefined);
  const [controlBusBitReleaseLabel, setControlBusBitReleaseLabel] = React.useState(data?.controlBusBitRelease?.label ? { name: data.controlBusBitRelease.label, value: 0 } : undefined);

  async function onUIUpdate(controlBus: bigint) {
    if (data.controlBusBitLoad) {
      // const controlBusBitLoadValue = execute(
      //   data.controlBusBitLoad?.getFunction
      // );
      const controlBusBitLoadValue = Number((BigInt(controlBus) >> BigInt(data.controlBusBitLoad.controlBusBitPosition)) & BigInt(1));

      const targetEdge = allEdges.find((edge) => edge.target === id);
      if (!targetEdge) return;

      // targetEdge.label = `${data.controlBusBitLoad.label}: ${controlBusBitLoadValue}`;
      setControlBusBitLoadLabel({
        name: data.controlBusBitLoad.label,
        value: controlBusBitLoadValue,
      });

      targetEdge.label = `${data.controlBusBitLoad.label}: ${controlBusBitLoadValue}`;
      let stokeColor = undefined;
      if (controlBusBitLoadValue === 1) {
        targetEdge.animated = true;
        stokeColor = "red";
      } else {
        targetEdge.animated = false;
      }
      targetEdge.style = { ...targetEdge.style, stroke: stokeColor };

      const allEdgesEdited = allEdges.map((edge) => {
        if (edge.id === targetEdge.id) {
          return targetEdge;
        }
        return edge;
      });

      reactFlowInstance.setEdges(allEdgesEdited);
    }

    if (data.controlBusBitRelease) {
      // const controlBusBitReleaseValue = execute(
      //   data.controlBusBitRelease?.getFunction
      // );

      const controlBusBitReleaseValue = Number((BigInt(controlBus) >> BigInt(data.controlBusBitRelease.controlBusBitPosition)) & BigInt(1));

      const sourceEdge = allEdges.find((edge) => edge.source === id);
      if (!sourceEdge) return;

      // sourceEdge.label = `${data.controlBusBitRelease.label}: ${controlBusBitReleaseValue}`;
      setControlBusBitReleaseLabel({
        name: data.controlBusBitRelease.label,
        value: controlBusBitReleaseValue,
      });

      sourceEdge.label = `${data.controlBusBitRelease.label}: ${controlBusBitReleaseValue}`;
      if (controlBusBitReleaseValue === 1) {
        sourceEdge.animated = true;
      } else {
        sourceEdge.animated = false;
      }

      const allEdgesEdited = allEdges.map((edge) => {
        if (edge.id === sourceEdge.id) {
          return sourceEdge;
        }
        return edge;
      });

      reactFlowInstance.setEdges(allEdgesEdited);
    }
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [controlBusBitLoadLabel, controlBusBitReleaseLabel];
}