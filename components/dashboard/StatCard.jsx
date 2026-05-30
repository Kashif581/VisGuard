/* ==============================
   STAT CARD COMPONENT
================================ */

import GlassCard from "./GlassCard";

export default function StatCard({ item, dark }) {
  return (
    <GlassCard
      dark={dark}
      className={`
        p-5 transition-all duration-300
        shadow-[0_0_30px_rgba(0,255,255,0.03)]
        hover:border-cyan-400/30
      `}
    >
      <div className="flex items-start justify-between">
        
        <div>
          
          <p
            className={`text-xs mb-2 ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.title}
          </p>

          <h2
            className={`text-4xl font-bold mb-2 tracking-tight ${
              dark ? "text-white" : "text-black"
            }`}
          >
            {item.value}
          </h2>

          <p className={`text-xs ${item.color}`}>
            {item.sub}
          </p>

        </div>

        <div
          className={`text-3xl opacity-80 ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {item.icon}
        </div>

      </div>
    </GlassCard>
  );
}