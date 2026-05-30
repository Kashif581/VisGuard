export const handleMouseMove = ({
  e,
  videoId,
  dragPointByVideo,
  activeZoneByVideo,
  canvasRefs,
  setZonesByVideo
}) => {
  const dragIndex = dragPointByVideo[videoId];

  if (dragIndex == null) return;

  const activeZoneIndex = activeZoneByVideo[videoId];

  if (activeZoneIndex == null) return;

  const canvas = canvasRefs.current[videoId];

  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  setZonesByVideo((prev) => {
    const updated = { ...prev };

    if (!updated[videoId]) return prev;

    const zones = [...updated[videoId]];

    const zone = { ...zones[activeZoneIndex] };

    const points = [...zone.points];

    // =========================
    // MOVE SINGLE VERTEX
    // =========================
    points[dragIndex] = { x, y };

    zones[activeZoneIndex] = {
      ...zone,
      points
    };

    updated[videoId] = zones;

    return updated;
  });
};