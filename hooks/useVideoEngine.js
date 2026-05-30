

import { useEffect, useRef, useState } from "react";

import { VIDEOS, FPS, W, H } from "../data/videoConfig";

import { handleCanvasClick } from "../components/dashboard/zones/zones_interaction/handleCanvasClick";
import { handleMouseDown } from "../components/dashboard/zones/zones_interaction/handleMouseDown";
import { handleMouseMove } from "../components/dashboard/zones/zones_interaction/handleMouseMove";
import { handleMouseUp } from "../components/dashboard/zones/zones_interaction/handleMouseUp";

import { saveZone as saveZoneUtil } from "../components/dashboard/zones/zones_interaction/saveZone";
import { deleteZone as deleteZoneUtil } from "../components/dashboard/zones/zones_interaction/deleteZone";

export default function useVideoEngine() {
  // =========================
  // REFS
  // =========================
  const videoRefs = useRef({});
  const canvasRefs = useRef({});

  // =========================
  // STATE
  // =========================
  const [detections, setDetections] = useState({});

  const [zonesByVideo, setZonesByVideo] = useState({});
  const [currentZoneByVideo, setCurrentZoneByVideo] = useState({});
  const [activeZoneByVideo, setActiveZoneByVideo] = useState({});

  const [dragPointByVideo, setDragPointByVideo] = useState({});
  const [dragStartByVideo, setDragStartByVideo] = useState({});

  const [zoneColor, setZoneColor] = useState("#00ffff");
  const [zoneType, setZoneType] = useState("restricted");

  const [tool, setTool] = useState("draw");

  const [activeVideoId, setActiveVideoId] = useState("cam1");

  // =========================
  // LOAD DETECTIONS
  // =========================
  useEffect(() => {
    VIDEOS.forEach(async (video) => {
      const data = await fetch(video.detectionFile).then((r) =>
        r.json()
      );

      setDetections((prev) => ({
        ...prev,
        [video.id]: data
      }));
    });
  }, []);

  // =========================
  // DRAW LOOP
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      VIDEOS.forEach((videoItem) => {
        const videoId = videoItem.id;

        const video = videoRefs.current[videoId];
        const canvas = canvasRefs.current[videoId];

        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");

        const vw = video.videoWidth;
        const vh = video.videoHeight;

        if (!vw || !vh) return;

        ctx.clearRect(0, 0, W, H);

        const scaleX = W / vw;
        const scaleY = H / vh;

        // =========================
        // DETECTIONS
        // =========================
        const frame = Math.round(video.currentTime * FPS);

        const frameData = detections[videoId]?.find(
          (d) => d.frame === frame
        );

        if (frameData) {
          frameData.detections.forEach((det) => {
            const [x1, y1, x2, y2] = det.bbox;

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;

            ctx.strokeRect(
              x1 * scaleX,
              y1 * scaleY,
              (x2 - x1) * scaleX,
              (y2 - y1) * scaleY
            );

            ctx.fillStyle = "black";
            ctx.font = "16px Arial";

            ctx.fillText(
              det.class,
              x1 * scaleX,
              y1 * scaleY - 5
            );
          });
        }

        // =========================
        // DRAW ZONES
        // =========================
        const drawZone = (zone, isActive = false) => {
          if (!zone || zone.points.length < 2) return;

          ctx.beginPath();

          ctx.strokeStyle = zone.color;

          ctx.lineWidth = isActive ? 3 : 2;

          ctx.moveTo(
            zone.points[0].x,
            zone.points[0].y
          );

          zone.points.forEach((p) => {
            ctx.lineTo(p.x, p.y);
          });

          ctx.closePath();
          ctx.fillStyle = `${zone.color}55`; 
          ctx.fill();

          ctx.stroke();

          // draw vertices
          zone.points.forEach((p) => {
            ctx.beginPath();

            ctx.fillStyle = isActive
              ? "yellow"
              : zone.color;

            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);

            ctx.fill();
          });

          ctx.fillStyle = zone.color;

          ctx.font = "14px Arial";

          ctx.fillText(
            zone.type,
            zone.points[0].x + 10,
            zone.points[0].y - 10
          );
        };

        const zones = zonesByVideo[videoId] || [];

        const currentZone =
          currentZoneByVideo[videoId] || [];

        zones.forEach((zone, i) => {
          drawZone(
            zone,
            i === activeZoneByVideo[videoId]
          );
        });

        if (currentZone.length > 0) {
          drawZone(
            {
              points: currentZone,
              color: zoneColor,
              type: zoneType
            },
            true
          );
        }
      });
    }, 33);

    return () => clearInterval(interval);
  }, [
    detections,
    zonesByVideo,
    currentZoneByVideo,
    activeZoneByVideo,
    zoneColor,
    zoneType,
    activeVideoId
  ]);

  // =========================
  // SAVE ZONE
  // =========================
  const saveZone = (videoId) => {
    saveZoneUtil({
      videoId,
      currentZoneByVideo,
      setZonesByVideo,
      setCurrentZoneByVideo,
      setActiveZoneByVideo,
      zoneColor,
      zoneType
    });
  };

  // =========================
  // DELETE ZONE
  // =========================
  const deleteZone = (videoId) => {
    deleteZoneUtil({
      videoId,
      activeZoneByVideo,
      setZonesByVideo,
      setActiveZoneByVideo
    });
  };

  // =========================
  // CANVAS CLICK
  // =========================
  const onCanvasClick = (e, videoId) => {
    handleCanvasClick({
      e,
      videoId,
      canvasRefs,
      zonesByVideo,
      setActiveZoneByVideo,
      setCurrentZoneByVideo,
      setZonesByVideo,
      tool
    });
  };

  // =========================
  // MOUSE DOWN
  // =========================
  const onMouseDown = (e, videoId) => {
    handleMouseDown({
      e,
      videoId,
      tool,
      activeZoneByVideo,
      canvasRefs,
      zonesByVideo,
      setDragPointByVideo,
      setDragStartByVideo
    });
  };

  // =========================
  // MOUSE MOVE
  // =========================
  const onMouseMove = (e, videoId) => {
    handleMouseMove({
      e,
      videoId,
      dragPointByVideo,
      activeZoneByVideo,
      canvasRefs,
      setZonesByVideo
    });
  };

  // =========================
  // MOUSE UP
  // =========================
  const onMouseUp = (videoId) => {
    handleMouseUp({
      videoId,
      setDragPointByVideo,
      setActiveZoneByVideo
    });
  };

  // =========================
  // RETURN
  // =========================
  return {
    videoRefs,
    canvasRefs,

    detections,
    setDetections,

    zonesByVideo,
    setZonesByVideo,

    currentZoneByVideo,
    setCurrentZoneByVideo,

    activeZoneByVideo,
    setActiveZoneByVideo,

    dragPointByVideo,
    setDragPointByVideo,

    zoneColor,
    setZoneColor,

    zoneType,
    setZoneType,

    tool,
    setTool,

    activeVideoId,
    setActiveVideoId,

    onCanvasClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,

    saveZone,
    deleteZone,
  };
}