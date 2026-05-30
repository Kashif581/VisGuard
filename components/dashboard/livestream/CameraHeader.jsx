export default function CameraHeader({ dark, name }) {
  return (
    <div
      className={`flex justify-between items-center px-3 py-2 ${
        dark ? "bg-zinc-900" : "bg-gray-200"
      }`}
    >
      <span className="text-sm font-medium">
        {name}
      </span>

      <span className="text-xs text-red-500 animate-pulse">
        ● LIVE
      </span>
    </div>
  );
}