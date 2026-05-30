import { areasData } from "../../data/areasData";
import GlassCard from "./GlassCard";

export default function ClasswiseTable({ dark }) {
  return (
    <GlassCard dark={dark} className="p-4">
      
      <div className="flex items-center justify-between mb-5">
        
        <h3
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Classwise Count
        </h3>

        <button
          className={`px-3 py-1 rounded-lg border text-xs transition
            ${
              dark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-gray-100 border-gray-300 text-black"
            }`}
        >
          Today
        </button>

      </div>

      <div className="space-y-4 text-sm">
        
        <div
          className={`grid grid-cols-4 text-xs border-b pb-2
            ${
              dark
                ? "text-gray-500 border-white/10"
                : "text-gray-500 border-gray-300"
            }`}
        >
          <span>Area</span>
          <span>Person</span>
          <span>Vehicle</span>
          <span>Bicycle</span>
        </div>

        {areasData.map((item) => (
          <div
            key={item.area}
            className={`grid grid-cols-4 text-xs
              ${dark ? "text-gray-300" : "text-gray-700"}
            `}
          >
            <span>{item.area}</span>
            <span>{item.person}</span>
            <span>{item.vehicle}</span>
            <span>{item.bicycle}</span>
          </div>
        ))}

      </div>
    </GlassCard>
  );
}