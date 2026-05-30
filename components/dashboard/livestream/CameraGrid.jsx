import CameraCard from "./CameraCard";

export default function CameraGrid({
  cameras,
  dark,
  children
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.id}
          camera={camera}
          dark={dark}
        >
          {children?.(camera)}
        </CameraCard>
      ))}
    </div>
  );
}