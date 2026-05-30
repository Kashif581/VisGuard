import React, { useState, useEffect } from "react";
import useVideoEngine from "../hooks/useVideoEngine";

import ZoneRadialMenu from "../components/dashboard/zones/ZoneRadialMenu";
import LiveHeader from "../components/dashboard/livestream/LiveHeader";
import CameraGrid from "../components/dashboard/livestream/CameraGrid";
import VIDEOS from "../data/videoConfig";

export default function LiveStreamingPage({ dark }) {
  const videoEngine = useVideoEngine();


  return (
    <div className={`relative p-6 space-y-6 min-h-screen ${dark ? "bg-black/40 border-zinc-800 text-white" : "text-black bg-gray-100"}`}>

      {/* HEADER */}
      <LiveHeader dark={dark}/>


      {/* RADIAL MENU */}
      <ZoneRadialMenu

        zoneColor={videoEngine.zoneColor}
        setZoneColor={videoEngine.setZoneColor}
        zoneType={videoEngine.zoneType}
        setZoneType={videoEngine.setZoneType}
        setTool={videoEngine.setTool}
        deleteZone={videoEngine.deleteZone}
        activeVideoId={videoEngine.activeVideoId}

        saveZone={() => 
          videoEngine.saveZone(videoEngine.activeVideoId)
        }
      />
      
      

      <CameraGrid
        cameras={VIDEOS}
        dark={dark}
      >
        {(camera) => (
          <div className="relative"
          onClick={() => 
            videoEngine.setActiveVideoId(camera.id)
          }
          >
            {/* VIDEO */}
            <video
            ref={(el) => {
              videoEngine.videoRefs.current[camera.id] = el;
            }}
            src={camera.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video object-cover"
            />
            <canvas
            ref={(el) => {
              videoEngine.canvasRefs.current[camera.id] = el;
            }}
            width={500}
            height={300}
            className="absolute inset-0 w-full h-full"
              
            onClick={(e) =>
              videoEngine.onCanvasClick(e, camera.id)
            }
          
            onMouseDown={(e) =>
              videoEngine.onMouseDown(e, camera.id)
            }
          
            onMouseMove={(e) =>
              videoEngine.onMouseMove(e, camera.id)
            }
          
            onMouseUp={() =>
              videoEngine.onMouseUp(camera.id)
            }
            />
          </div>
          
        )}
      </CameraGrid>
    </div>
  );
}