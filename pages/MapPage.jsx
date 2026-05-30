import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const GOOGLE_API_KEY = "";

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [selectedCamera, setSelectedCamera] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
  });

  // 🔴 Sample Data (replace with backend)
  const cameras = [
    {
      id: 1,
      name: "Gate Camera",
      lat: 29.3956,
      lng: 71.6833,
      status: "online",
      type: "fixed",
      zone: "Main Gate",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    },
    {
      id: 2,
      name: "Parking Camera",
      lat: 29.40,
      lng: 71.69,
      status: "error",
      type: "ptz",
      zone: "Parking",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    },
  ];

  // ---------------- INIT MAP ----------------
  useEffect(() => {
    const init = async () => {
      setOptions({
        apiKey: GOOGLE_API_KEY,
        version: "weekly",
      });

      const { Map } = await importLibrary("maps");

      mapInstance.current = new Map(mapRef.current, {
        center: { lat: 29.3956, lng: 71.6833 },
        zoom: 13,
        disableDefaultUI: true,
        styles: darkMapStyle,
      });
    };

    init();
  }, []);

  // ---------------- MARKERS ----------------
  useEffect(() => {
    if (!mapInstance.current) return;

    const google = window.google;

    // clear markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const filtered = cameras.filter(
      (cam) =>
        (filters.status === "all" || cam.status === filters.status) &&
        (filters.type === "all" || cam.type === filters.type)
    );

    filtered.forEach((cam) => {
      const colorMap = {
        online: "#22c55e",
        offline: "#9ca3af",
        maintenance: "#f59e0b",
        error: "#ef4444",
      };

      const marker = new google.maps.Marker({
        position: { lat: cam.lat, lng: cam.lng },
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: colorMap[cam.status],
          fillOpacity: 1,
          strokeWeight: 0,
        },
      });

      marker.addListener("click", () => {
        setSelectedCamera(cam);
      });

      markersRef.current.push(marker);
    });
  }, [filters]);

  // ---------------- STATS ----------------
  const stats = {
    total: cameras.length,
    online: cameras.filter((c) => c.status === "online").length,
    offline: cameras.filter((c) => c.status === "offline").length,
    maintenance: cameras.filter((c) => c.status === "maintenance").length,
    error: cameras.filter((c) => c.status === "error").length,
  };

  return (
    <div className="w-full h-screen relative text-white">

      {/* MAP */}
      <div ref={mapRef} className="w-full h-full" />

      {/* LEFT PANEL */}
      <div className="absolute top-6 left-6 w-72 bg-black/70 backdrop-blur p-4 rounded-xl space-y-4">

        <div className="flex justify-between">
          <h2 className="font-semibold">Filters</h2>
          <button onClick={() => setFilters({ status: "all", type: "all" })}>
            Clear
          </button>
        </div>

        <div>
          <p className="text-sm mb-2">Status</p>
          {["online", "offline", "maintenance", "error"].map((s) => (
            <label key={s} className="flex justify-between">
              {s}
              <input
                type="radio"
                name="status"
                onChange={() => setFilters((f) => ({ ...f, status: s }))}
              />
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm mb-2">Type</p>
          {["fixed", "ptz"].map((t) => (
            <label key={t} className="flex justify-between">
              {t}
              <input
                type="radio"
                name="type"
                onChange={() => setFilters((f) => ({ ...f, type: t }))}
              />
            </label>
          ))}
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-6 py-3 rounded-xl flex gap-6 text-sm">
        <div>Total: {stats.total}</div>
        <div className="text-green-400">Online: {stats.online}</div>
        <div className="text-gray-400">Offline: {stats.offline}</div>
        <div className="text-yellow-400">Maintenance: {stats.maintenance}</div>
        <div className="text-red-400">Error: {stats.error}</div>
      </div>

      {/* 🎥 CAMERA POPUP */}
      {selectedCamera && (
        <div className="absolute bottom-6 right-6 w-80 bg-black/90 backdrop-blur rounded-xl p-4 shadow-xl">

          <h2 className="font-semibold mb-2">
            {selectedCamera.name}
          </h2>

          {selectedCamera.status === "online" ? (
            <video
              src={selectedCamera.streamUrl}
              controls
              autoPlay
              muted
              className="w-full h-40 rounded-lg mb-2"
            />
          ) : (
            <div className="h-40 flex items-center justify-center bg-zinc-800 rounded-lg mb-2">
              Camera Offline
            </div>
          )}

          <div className="text-sm space-y-1">
            <p>Status: {selectedCamera.status}</p>
            <p>Type: {selectedCamera.type}</p>
            <p>Zone: {selectedCamera.zone}</p>
          </div>

          <button
            onClick={() => setSelectedCamera(null)}
            className="mt-3 text-red-400 text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// 🌙 DARK MAP STYLE
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
];



