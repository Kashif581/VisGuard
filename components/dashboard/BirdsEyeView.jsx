import GlassCard from "./GlassCard";

export default function BirdsEyeView({ dark }) {
  return (
    <GlassCard dark={dark} className="p-3">
      
      <div className="flex items-center justify-between mb-3">
        
        <h3
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Bird's Eye View
        </h3>

        <select
          className={`rounded-lg px-3 py-1 text-xs outline-none border transition
            ${
              dark
                ? "bg-[#111C2D] border-white/10 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
        >
          <option>All Cameras</option>
        </select>

      </div>

      <div
        className={`relative overflow-hidden rounded-xl h-[345px] border
          ${
            dark
              ? "border-white/10"
              : "border-gray-300"
          }`}
      >
        <img
          src="/images/map.png"
          alt="map"
          className="w-full h-full object-cover"
        />

        {[1, 2, 3, 4, 5, 6, 7, 8].map((cam, index) => (
          <div
            key={cam}
            className="absolute w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] flex items-center justify-center backdrop-blur-xl"
            style={{
              top: `${15 + index * 10}%`,
              left: `${20 + (index % 3) * 25}%`,
            }}
          >
            {cam}
          </div>
        ))}
      </div>

    </GlassCard>
  );
}