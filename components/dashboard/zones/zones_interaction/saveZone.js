export const saveZone = ({
  videoId,
  currentZoneByVideo,
  setZonesByVideo,
  setCurrentZoneByVideo,
  setActiveZoneByVideo,
  zoneColor,
  zoneType
}) => {
  const currentZone = currentZoneByVideo[videoId] || [];

  if (currentZone.length < 3) return;

  setZonesByVideo((prev) => ({
    ...prev,
    [videoId]: [
      ...(prev[videoId] || []),
      {
        points: currentZone,
        color: zoneColor,
        type: zoneType
      }
    ]
  }));

  setCurrentZoneByVideo((prev) => ({
    ...prev,
    [videoId]: []
  }));

  setActiveZoneByVideo((prev) => ({
    ...prev,
    [videoId]: null
  }));
};