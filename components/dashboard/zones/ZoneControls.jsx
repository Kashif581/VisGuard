export default function ZoneControls({
  zoneColor,
  setZoneColor,
  zoneType,
  setZoneType,
  tool,
  setTool,
  saveZone,
  newZone,
  deleteZone,
  clearAllZones,
  clearCurrentZone,
  deselectZone,
  activeZoneIndex
}) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-4 items-center">
        <input
          type="color"
          value={zoneColor}
          onChange={(e) => setZoneColor(e.target.value)}
        />

        <select
          value={zoneType}
          onChange={(e) => setZoneType(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="restricted">Restricted</option>
          <option value="danger">Danger</option>
          <option value="counting">Counting</option>
          <option value="safe">Safe</option>
        </select>

        <button onClick={() => setTool("draw")}>Draw</button>
        <button onClick={() => setTool("edit")}>Edit</button>
        <button onClick={() => setTool("erase")}>Erase</button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={saveZone}>Save</button>
        <button onClick={newZone}>New</button>

        {activeZoneIndex !== null && (
          <button onClick={() => deleteZone(activeZoneIndex)}>
            Delete Selected
          </button>
        )}

        <button onClick={clearAllZones}>Clear All</button>
        <button onClick={clearCurrentZone}>Clear Current</button>
        <button onClick={deselectZone}>Deselect</button>
      </div>
    </div>
  );
}