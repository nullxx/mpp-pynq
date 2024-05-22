import { Handle, HandleType, Position } from "react-flow-renderer";

export default function Handles({ data, id }: any) {

  return data.handlePos?.map((pos: string, index: number) => {
    const [handlePos, type, handlePosValue] = pos.split('-'); // top-target-50 (50% from left)

    return (
      <Handle
        id={`${id}-${handlePos}-${type}-${handlePosValue}`}
        key={`${id}-${handlePos}-${type}-${handlePosValue}`}
        type={type as HandleType}
        position={handlePos as Position}
        style={{
          background: "#555",
          position: "absolute",
          left: (handlePos === 'top' || handlePos === 'bottom') ? `${handlePosValue}%` : undefined,
          top: (handlePos === 'left' || handlePos === 'right') ? `${handlePosValue}%` : undefined,
        }}
        isConnectable={false}
      />
    );
  }
  );
}