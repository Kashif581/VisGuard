import GlassCard from "./GlassCard";
import { VIDEOS } from "../../data/videoConfig";
import CameraCard from "./livestream/CameraCard";
import { Camera } from "lucide-react";

export default function CameraView({
  dark,
  activeVideoId,
  setActiveVideoId
}) {
  const activeVideo = VIDEOS.find(v => v.id === activeVideoId);

  return (
    <GlassCard dark={dark} className="p-3">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        {/* <h3
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Camera Live View
        </h3> */}

        {/* CAMERA SELECT */}
        <select
          value={activeVideoId}
          onChange={(e) => setActiveVideoId(e.target.value)}
          className={`rounded-lg px-3 py-1 text-xs outline-none border transition
            ${
              dark
                ? "bg-[#111C2D] border-white/10 text-white"
                : "bg-white border-gray-300 text-black"
            }
          `}
        >
          {VIDEOS.map((cam) => (
            <option key={cam.id} value={cam.id}>
              {cam.name || cam.id}
            </option>
          ))}
        </select>

      </div>
      <CameraCard
        camera={{
          // name: activeVideo?.name || "Camera"
        }}
        dark={dark}
        >
          <video
            src={activeVideo?.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
      </CameraCard>

    </GlassCard>
  );
}