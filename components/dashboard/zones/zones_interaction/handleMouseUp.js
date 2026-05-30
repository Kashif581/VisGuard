export const handleMouseUp = ({
  videoId,
  setDragPointByVideo,
  setActiveZoneByVideo
}) => {
  setDragPointByVideo((prev) => ({
    ...prev,
    [videoId]: null
  }));

  setActiveZoneByVideo((prev) => ({
    ...prev,
    [videoId]: null
  }));
};