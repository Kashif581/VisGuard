import { useState, useRef, useEffect } from "react";

export default function ZoneRadialMenu({
  tool,
  setTool,

  zoneColor,
  setZoneColor,

  zoneType,
  setZoneType,

  saveZone,
  deleteZone,

  activeVideoId
}) {
  const [open, setOpen] = useState(false);

  // =============================
  // POSITION
  // =============================
  const [pos, setPos] = useState(() => ({
    x: 100,
    y:
      typeof window !== "undefined"
        ? window.innerHeight - 220
        : 100
  }));

  // =============================
  // DRAGGING
  // =============================
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // =============================
  // ACTIVE TOOL
  // =============================
  const [selectedButton, setSelectedButton] = useState(tool);

  useEffect(() => {
    setSelectedButton(tool);
  }, [tool]);

  // =============================
  // ZONE TYPE TOGGLE
  // =============================
  const cycleZoneType = () => {
    setZoneType((prev) => {
      if (prev === "restricted") return "danger";
      if (prev === "danger") return "counting";
      return "restricted";
    });
  };

  // =============================
  // ACTIONS
  // =============================
  const actions = [
    {
      id: "draw",
      icon: "✏️",
      label: "Draw",
      action: () => setTool("draw")
    },
    {
      id: "edit",
      icon: "✋",
      label: "Edit",
      action: () => setTool("edit")
    },
    {
      id: "erase",
      icon: "🧹",
      label: "Erase",
      action: () => setTool("erase")
    },

    {
      id: "save",
      icon: "💾",
      label: "Save",
      action: () => saveZone(activeVideoId)
    },

    {
      id: "delete",
      icon: "🗑️",
      label: "Delete",
      action: () => deleteZone(activeVideoId)
    },

    // COLOR BUTTON
    {
      id: "color",
      label: "Color",
      icon: (
        <div className="relative w-full h-full">
          <input
            type="color"
            value={zoneColor}
            onChange={(e) => setZoneColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-full h-full rounded-full border border-white"
            style={{ backgroundColor: zoneColor }}
          />
        </div>
      ),
      action: () => {}
    },

    // TYPE BUTTON
    {
      id: "type",
      label: "Type",
      icon: (
        <div className="text-[9px] font-bold">
          {zoneType.slice(0, 3).toUpperCase()}
        </div>
      ),
      action: cycleZoneType
    }
  ];

  // =============================
  // RADIAL CONFIG
  // =============================
  const radius = 60;
  const angleStep = (2 * Math.PI) / actions.length;

  // =============================
  // DRAG EVENTS
  // =============================
  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed z-50"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* =============================
          RADIAL BUTTONS
      ============================= */}
      {actions.map((item, i) => {
        const angle = i * angleStep - Math.PI / 2;

        const x = open ? Math.cos(angle) * radius : 0;
        const y = open ? Math.sin(angle) * radius : 0;

        return (
          <button
            key={item.id}
            title={item.label}
            onClick={() => {
              setSelectedButton(item.id);
              item.action();
            }}
            className={`
              absolute
              w-8 h-8
              rounded-full
              flex items-center justify-center
              shadow-lg
              border border-white/20
              backdrop-blur-md
              text-sm
              transition-all duration-300
              hover:scale-110
              ${
                selectedButton === item.id
                  ? "bg-cyan-500 text-white scale-110 ring-2 ring-cyan-300"
                  : "bg-black/80 text-white"
              }
            `}
            style={{
              left: "50%",
              top: "50%",
              transform: `
                translate(-50%, -50%)
                translate(${x}px, ${y}px)
              `,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transitionDelay: `${i * 25}ms`
            }}
          >
            {item.icon}
          </button>
        );
      })}

      {/* =============================
          CENTER BUTTON
      ============================= */}
      <button
        onClick={() => setOpen(!open)}
        onMouseDown={handleMouseDown}
        className="
          w-12 h-12
          rounded-full
          bg-cyan-400
          text-black
          font-bold
          shadow-xl
          flex items-center justify-center
          hover:scale-110
          transition
          cursor-grab
          active:cursor-grabbing
        "
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
}