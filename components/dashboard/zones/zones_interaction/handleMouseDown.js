export const handleMouseDown = ({
  e,
  videoId,
  tool,
  activeZoneByVideo,
  canvasRefs,
  zonesByVideo,
  setDragPointByVideo,
  setDragStartByVideo
}) => {
  // only allow edit mode
  if (tool !== "edit") return;

  const activeZoneIndex = activeZoneByVideo[videoId];

  if (activeZoneIndex == null) return;

  const canvas = canvasRefs.current[videoId];

  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const zone = zonesByVideo[videoId]?.[activeZoneIndex];

  if (!zone) return;

  let hitVertexIndex = null;

  // =========================
  // CHECK WHICH VERTEX IS HIT
  // =========================
  zone.points.forEach((p, i) => {
    const dist = Math.hypot(p.x - x, p.y - y);

    // easier clicking
    if (dist < 30) {
      hitVertexIndex = i;
    }
  });

  // no vertex selected
  if (hitVertexIndex === null) return;

  // =========================
  // SAVE DRAG START
  // =========================
  setDragStartByVideo((prev) => ({
    ...prev,
    [videoId]: { x, y }
  }));

  // =========================
  // SAVE ACTIVE DRAG POINT
  // =========================
  setDragPointByVideo((prev) => ({
    ...prev,
    [videoId]: hitVertexIndex
  }));
};