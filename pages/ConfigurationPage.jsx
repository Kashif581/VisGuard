
// const googlemapapi = "AIzaSyA5mkvg-OoXriUBllN7cJmeNDIb8wKtZf4"

import { useState, useRef, useEffect } from "react";
import GlassCard from "../components/dashboard/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Dialog, DialogHeader, DialogTitle } from "../components/ui/Dialog";
import { Plus, Trash2 } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN = "";

const classesList = ["person", "weapon", "fire", "vehicle", "fight"];

const EMPTY_FORM = {
  name: "",
  rtsp: "",
  email: "",
  classes: [],
  confidence: 0.5,

  location: { lat: "", lng: "" },
  status: "online",
  type: "fixed",
  zone: "",
};

export default function ConfigurationPage({dark}) {
  const [cameras, setCameras] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  // ---------------- MAP ----------------
  useEffect(() => {
    if (!open) return;

    let map;

    const initMap = async () => {
      const mapboxModule = await import("mapbox-gl");
      const geocoderModule = await import("@mapbox/mapbox-gl-geocoder");

      const mapboxgl = mapboxModule.default;
      const MapboxGeocoder = geocoderModule.default;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      // wait for modal render
      const waitForContainer = () =>
        new Promise((resolve) => {
          const check = () => {
            if (mapContainer.current?.offsetWidth > 0) resolve();
            else requestAnimationFrame(check);
          };
          check();
        });

      await waitForContainer();

      // 🔥 Better detailed style
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [71.6833, 29.3956], // Bahawalpur
        zoom: 13,
      });

      mapRef.current = map;

      // Controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl());
      map.addControl(new mapboxgl.ScaleControl());

      // 📍 Set Location
      const setLocation = (lng, lat) => {
        setForm((prev) => ({
          ...prev,
          location: {
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          },
        }));

        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker({
            color: "#22c55e",
            draggable: true,
          })
            .setLngLat([lng, lat])
            .addTo(map);

          markerRef.current.on("dragend", () => {
            const { lng, lat } = markerRef.current.getLngLat();
            setLocation(lng, lat);
          });
        } else {
          markerRef.current.setLngLat([lng, lat]);
        }
      };

      // 🔍 Improved Geocoder
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl,

        marker: false,
        placeholder: "Search (e.g. Usman Hall IUB)",

        countries: "pk",
        types: "poi,place,address",
        limit: 10,

        proximity: {
          longitude: 71.6833,
          latitude: 29.3956,
        },

        flyTo: false,
      });

      geocoderRef.current = geocoder;

      const geocoderContainer = document.getElementById("geocoder");
      if (geocoderContainer) {
        geocoderContainer.innerHTML = "";
        geocoderContainer.appendChild(geocoder.onAdd(map));
      }

      // 🔥 Search result
      geocoder.on("result", (e) => {
        const [lng, lat] = e.result.center;

        setLocation(lng, lat);

        // Save readable address
        setForm((prev) => ({
          ...prev,
          zone: e.result.place_name,
        }));

        map.flyTo({
          center: [lng, lat],
          zoom: 18, // 🔥 building level
          speed: 1.5,
          curve: 1.8,
        });
      });

      // 🖱️ Click map
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setLocation(lng, lat);
      });

      // 📍 Current location
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
      );

      map.on("load", () => {
        setTimeout(() => map.resize(), 300);
      });
    };

    initMap();

    return () => {
      map?.remove();
      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
    };
  }, [open]);

  // ---------------- SAVE ----------------
  const handleAddCamera = () => {
    setError("");

    if (!form.name || !form.rtsp || !form.email) {
      return setError("Please fill all required fields");
    }

    if (!form.location.lat || !form.location.lng) {
      return setError("Please select location on map");
    }

    setCameras((prev) => [...prev, form]);
    setForm(EMPTY_FORM);
    setOpen(false);
  };

  const handleDeleteCamera = (index) => {
    setCameras((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleClass = (cls) => {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter((c) => c !== cls)
        : [...prev.classes, cls],
    }));
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-all duration-300 ${dark ? "bg-black/40 border-zinc-800 text-white" : "text-black bg-gray-100"}`}>
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Camera Configuration
        </h1>

        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> Add Camera
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {cameras.length === 0 && (
          <p className={dark ? "text-gray-400" : "text-gray-600"}>No cameras added</p>
        )}

        {cameras.map((cam, index) => (
          <GlassCard dark={dark} key={index} className="p-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">{cam.name}</h2>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCamera(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <p className="text-sm">RTSP: <span className="text-gray-400">{cam.rtsp}</span></p>
            <p className="text-sm">Location:{" "}<span className="text-gray-400">{cam.location.lat}, {cam.location.lng}</span></p>
            <p className="text-sm">Status:{" "}<span className="px-1 py-0.2 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">{cam.status}</span></p>
            <p className="text-sm">Type:{" "}<span className="px-1 py-0.2 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">{cam.type}</span></p>
            <p className="text-sm">Classes: {cam.classes?.map((cls, i) => (<span key={i} className="px-1 py-0.2 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">{cls}</span>))}</p>
          </GlassCard>
        ))}
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className={`p-6 rounded-xl w-full max-w-2xl space-y-4 transition-all duration-300 ${dark? "bg-zinc-900 text-white": "bg-white text-black"}`}>
          <DialogHeader>
            <DialogTitle>Add Camera</DialogTitle>
          </DialogHeader>

          {error && (
            <p className="text-red-400 text-sm bg-red-900 p-2 rounded">
              {error}
            </p>
          )}

          <Input
            dark={dark}
            placeholder="Camera Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            dark={dark}
            placeholder="RTSP URL"
            value={form.rtsp}
            onChange={(e) =>
              setForm({ ...form, rtsp: e.target.value })
            }
          />

          <Input
            dark={dark}
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* STATUS */}
          <select
            className={`w-full p-2 rounded border transition ${dark? "bg-zinc-800 border-zinc-700 text-white": "bg-white border-gray-300 text-black"}`}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
            <option value="error">Error</option>
          </select>

          {/* TYPE */}
          <select
            className={`w-full p-2 rounded border transition ${dark? "bg-zinc-800 border-zinc-700 text-white": "bg-white border-gray-300 text-black"}`}
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="fixed">Fixed</option>
            <option value="ptz">PTZ</option>
            <option value="thermal">Thermal</option>
            <option value="lpr">LPR</option>
            <option value="dome">Dome</option>
          </select>

          {/* CLASSES */}
          <div>
            <p className={dark ? "text-sm mb-2 text-white" : "text-sm mb-2 text-black"}>Classes</p>
            <div className="flex flex-wrap gap-2">
              {classesList.map((cls) => {
                const selected = form.classes.includes(cls);
                return (
                  <Button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`transition ${
                      selected
                        ? "bg-slate-950 text-white border-slate-950": dark? "bg-zinc-800 text-white border-zinc-700": "bg-white text-black border-gray-300"}`}>
                          {cls}</Button>
                        );})}
            </div>
          </div>

          {/* CONFIDENCE */}
          <div>
            <p className="text-sm mb-2">
              Confidence ({form.confidence})
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={form.confidence}
              onChange={(e) =>
                setForm({
                  ...form,
                  confidence: e.target.value,
                })
              }
              className="w-full"
            />
          </div>

          {/* MAP */}
          <div>
            <p className="text-sm mb-2">
              Search or Click Location
            </p>

            <div id="geocoder" className="mb-2" />

            <div
              ref={mapContainer}
              className="w-full h-64 rounded-lg"
            />

            <p className={`text-xs mt-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Lat: {form.location.lat || "-"} | Lng:{" "}
              {form.location.lng || "-"}
            </p>
          </div>

          {/* SAVE */}
          <Button onClick={handleAddCamera} className="w-full">
            Save Camera
          </Button>
        </div>
      </Dialog>
    </div>
  );
}



