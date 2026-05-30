import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onToggle, dark, setDark }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      camera: "Entrance Gate",
      event: "Fight Detected",
      time: "10:32 AM",
      video: "/videos/Vechicle1.mp4",
    },
    {
      id: 2,
      camera: "Parking Area",
      event: "Fight Detected",
      time: "10:35 AM",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      id: 3,
      camera: "Lobby Camera",
      event: "Fight Detected",
      time: "10:40 AM",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative z-[9999] flex items-center justify-between px-6 py-5.5 border-b backdrop-blur-md transition-all duration-300
      ${dark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-gray-300 text-black"}`}
    >
      {/* LEFT */}

      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-lg">
          Surveillance Analytics
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 relative">

        {/* NOTIFICATION */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-zinc-800 relative"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* THEME TOGGLE (FIXED) */}
        <button
          onClick={() => setDark((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-zinc-105"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE */}
        <img
          src="./images/profile1.PNG"
          alt="profile"
          className="w-8 h-8 rounded-full border border-zinc-600 object-cover"
        />

        {/* DROPDOWN */}
        {open && (
          <div
            ref={dropdownRef}
            className={`absolute right-0 top-12 w-96 rounded-xl shadow-2xl border z-[9999]
           ${dark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-gray-200 text-black"}`}
          >
            {/* HEADER */}
            <div className="px-4 py-3 border-b border-zinc-700 font-semibold">
              Latest Alerts
            </div>

            {/* LIST */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/40 transition border-b border-zinc-800"
                >
                  {/* VIDEO THUMBNAIL */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden border border-zinc-700 bg-black">
                    <video
                      src={n.video}
                      muted
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-400">
                      {n.event}
                    </p>
                    <p className="text-xs opacity-70">{n.camera}</p>
                    <p className="text-xs opacity-50">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-3 text-center border-t border-zinc-800">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/notification");
                }}
                className="text-blue-400 hover:underline text-sm"
              >
                More →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}