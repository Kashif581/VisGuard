export const deleteZone = ({
  videoId,
  activeZoneByVideo,
  setZonesByVideo,
  setActiveZoneByVideo
}) => {
  const activeIndex = activeZoneByVideo[videoId];

  if (activeIndex == null) return;

  setZonesByVideo((prev) => {
    const updated = { ...prev };

    updated[videoId] =
      (updated[videoId] || []).filter(
        (_, i) => i !== activeIndex
      );

    return updated;
  });

  // clear selection
  setActiveZoneByVideo((prev) => ({
    ...prev,
    [videoId]: null
  }));
};