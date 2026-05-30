import {
  Cctv,
  ShieldAlert,
  ChartSpline,
  MonitorCog,
  MapPinned,
  BotMessageSquare,
  Radar,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ open, dark }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ACTIVE MENU STYLE FUNCTION
  const menuItemClass = (path) =>
    `flex items-center gap-3 cursor-pointer transition px-3 py-2 rounded-xl
    ${
      location.pathname === path
        ? dark
          ? "bg-slate-950 text-white"
          : "bg-slate-950 text-white"
        : dark
        ? "text-zinc-200 hover:bg-zinc-800 hover:text-slate-950"
        : "text-gray-700 hover:bg-gray-100 hover:text-slate-950"
    }`;

  return (
    <div
      className={`h-screen flex flex-col justify-between
      ${
        dark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-gray-300"
      }
      backdrop-blur-md border-r p-4 transition-all duration-300
      ${open ? "w-64" : "w-20"}`}
    >
      {/* TOP SECTION */}
      <div>
        {/* BRAND */}
        <div
          className={`flex items-center gap-3 mb-6 px-1 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          <div className="bg-slate-950 p-2 rounded-xl flex items-center justify-center">
            <img
              src="/images/logo1-removebg-preview.png"
              alt="VisGuard_Logo"
              className="w-[22px] h-[22px] object-contain"
            />
          </div>

          {open && (
            <div>
              <h1 className="text-lg font-bold leading-none">
                VisGuard
              </h1>
              <p className="text-xs text-gray-400">
                AI Surveillance
              </p>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div
          className={`w-full mb-6 border-t ${
            dark ? "border-zinc-800" : "border-gray-300"
          }`}
        />

        {/* MENU */}
        <ul className="space-y-3">
          {/* LIVE STREAMING */}
          <li
            onClick={() => navigate("/livestream")}
            className={menuItemClass("/livestream")}
          >
            <Cctv />
            {open && "Live Streaming"}
          </li>

          {/* ANALYTICS */}
          <li
            onClick={() => navigate("/analytics")}
            className={menuItemClass("/analytics")}
          >
            <ChartSpline />
            {open && "Analytics"}
          </li>

          {/* MAP */}
          <li
            onClick={() => navigate("/map")}
            className={menuItemClass("/map")}
          >
            <MapPinned />
            {open && "Map"}
          </li>

          {/* AI SEARCH */}
          <li
            onClick={() => navigate("/chat")}
            className={menuItemClass("/chat")}
          >
            <BotMessageSquare />
            {open && "Events Chat"}
          </li>

          {/* ALERTS */}
          <li
            onClick={() => navigate("/notification")}
            className={menuItemClass("/notification")}
          >
            <ShieldAlert />
            {open && "Alerts"}
          </li>

          {/* CONFIGURATION */}
          <li
            onClick={() => navigate("/config")}
            className={menuItemClass("/config")}
          >
            <MonitorCog />
            {open && "Configuration"}
          </li>
        </ul>
      </div>

      {/* FOOTER */}
      <div
        className={`border-t pt-4 text-sm ${
          dark
            ? "border-zinc-800 text-zinc-400"
            : "border-gray-300 text-gray-500"
        }`}
      >
        {open ? (
          <div>
            <p className="font-medium">Vision Guard v1.0</p>
            <p className="text-xs mt-1">
              Powered by AI Monitoring
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Radar size={18} />
          </div>
        )}
      </div>
    </div>
  );
}