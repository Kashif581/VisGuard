import { useEffect, useRef } from "react";

export default function ZoneCanvas({ zones, currentZone, tool, setCurrentZone, erasePoint}) {
  const canvasRef = useRef(null);

  // -----------------------------
  // Utility: distance from point to line
  // -----------------------------
  const isPointNearLine = (p, a, b, threshold = 10) => {
    const A = p.x - a.x;
    const B = p.y - a.y;
    const C = b.x - a.x;
    const D = b.y - a.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    let param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;

    if (param < 0) {
      xx = a.x;
      yy = a.y;
    } else if (param > 1) {
      xx = b.x;
      yy = b.y;
    } else {
      xx = a.x + param * C;
      yy = a.y + param * D;
    }

    const dx = p.x - xx;
    const dy = p.y - yy;

    return Math.sqrt(dx * dx + dy * dy) < threshold;
  };

  // -----------------------------
  // CLICK HANDLER
  // -----------------------------
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // DRAW MODE
    if (tool === "draw") {
      setCurrentZone((prev) => [...prev, point]);
    }

    // ERASE MODE
    if (tool === "erase") {
      erasePoint(point.x, point.y);
    }

    // EDIT MODE → select zone
    if (tool === "edit") {
      let found = false;

      for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
        const zone = zones[zoneIndex];

        for (let i = 0; i < zone.points.length - 1; i++) {
          const a = zone.points[i];
          const b = zone.points[i + 1];

          if (isPointNearLine(point, a, b)) {
            window.__selectZone?.(zoneIndex);
            found = true;
            break;
          }
        }

        if (found) break;
      }
    }
  };

  // -----------------------------
  // DRAW CANVAS
  // -----------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...zones, { points: currentZone, color: "#00ffff" }].forEach(
      (zone) => {
        if (!zone.points || zone.points.length < 2) return;

        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        zone.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });

        ctx.closePath();
        ctx.stroke();
      }
    );
  }, [zones, currentZone]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={300}
      onClick={handleCanvasClick}
      className="absolute inset-0 w-full h-full z-20 cursor-crosshair"
    />
  );
}