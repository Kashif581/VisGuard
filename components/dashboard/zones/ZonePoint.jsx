export default function ZonePoint({
  point,
  index,
  tool,
  onMouseDown
}) {
  return (
    <div
      className={`
        absolute w-4 h-4 rounded-full
        border-2 border-white shadow-lg
        -translate-x-1/2 -translate-y-1/2
        ${
          tool === "edit"
            ? "cursor-move bg-cyan-500"
            : "cursor-default bg-gray-400"
        }
      `}
      style={{
        left: point.x,
        top: point.y
      }}
      onMouseDown={() => tool === "edit" && onMouseDown(index)}
    />
  );
}