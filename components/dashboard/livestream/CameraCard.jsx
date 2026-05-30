import CameraHeader from "./CameraHeader";


export default function CameraCard({
  camera,
  dark,
  selected,
  onSelect,
  children
}) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 transition-all ${
        selected
          ? "border-cyan-500 scale-[1.02]"
          : "border-transparent"
      } ${
        dark
          ? "bg-black/40 text-white"
          : "bg-white text-black"
      }`}
    >
      {/* CAMERA HEADER */}
      <CameraHeader
        dark={dark}
        name={camera.name}
      />

      {/* VIDEO */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}