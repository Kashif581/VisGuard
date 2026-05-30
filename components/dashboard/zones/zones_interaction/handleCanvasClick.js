export const handleCanvasClick = ({
  e,
  videoId,
  canvasRefs,
  zonesByVideo,
  setActiveZoneByVideo,
  setCurrentZoneByVideo,
  setZonesByVideo,
  tool
}) => {
  const canvas = canvasRefs.current[videoId];
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // const scaleX = W / rect.width;
  // const scaleY = H / rect.height;

  // const x = (e.clientX - rect.left) * scaleX;
  // const y = (e.clientY - rect.top) * scaleY;

  const zones = zonesByVideo[videoId] || [];
  const isPointInPolygon = (point, vs) => {
  let x = point.x;
  let y = point.y;
  let inside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i].x, yi = vs[i].y;
    let xj = vs[j].x, yj = vs[j].y;

    let intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.00001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
  };
  // SELECT WHOLE ZONE (EDIT MODE FIX)
  for (let z = 0; z < zones.length; z++) {
    const zone = zones[z];
  
    if (isPointInPolygon({ x, y }, zone.points)) {
      setActiveZoneByVideo((prev) => ({
        ...prev,
        [videoId]: z
      }));
      return;
    }
  }



  // =========================
  // DRAW MODE
  // =========================
  if (tool === "draw") {
    setCurrentZoneByVideo((prev) => ({
      ...prev,
      [videoId]: [
        ...(prev[videoId] || []),
        { x, y }
      ]
    }));
  }

  // =========================
  // ERASE MODE
  // =========================
  if (tool === "erase") {
    setZonesByVideo((prev) => {
      const videoZones = prev[videoId] || [];

      return {
        ...prev,
        [videoId]: videoZones.map((zone) => ({
          ...zone,
          points: zone.points.filter((p) => {
            const dist = Math.hypot(p.x - x, p.y - y);
            return dist > 12;
          })
        }))
      };
    });
  }
};