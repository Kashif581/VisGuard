
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,Legend,} from "recharts";
import { useState } from "react";
import GlassCard from "./GlassCard";
import { chartData } from "../../data/chartData";
import { hover } from "framer-motion";


export default function ChartSection({ dark }) {
  const [filter, setFilter] = useState("today");

  const now = new Date();

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.time);

    if (filter === "today") {
      return date.toDateString() === now.toDateString();
    }

    if (filter === "7days") {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      return date >= past && date <= now;
    }

    if (filter === "30days") {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      return date >= past && date <= now;
    }

    return true;
  });

  const formattedData = filteredData.map((d) => ({
    ...d,
    label: new Date(d.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  // 🔥 Custom Tooltip with Image
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const hovered = payload[0];
      const data = hovered.payload;
      const type = hovered.dataKey;
      const image = data.images?.[type];
     

      return (
        <div className={`p-3 rounded-lg shadow-lg w-56 border ${dark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-gray-200 text-black"}`}>
          
          {/* 📸 Dynamic Image */}
          {image && (
            <img
              src={image}
              alt={type}
              className="w-full h-28 object-cover rounded mb-2"
            />
          )}

          {/* 🕒 TIME */}
          <p className="text-sm text-gray-400 mb-1">{data.label}</p>

          {/* 🔢 VALUES */}
          <p className="text-white text-sm font-semibold capitalize">{type}: {data[type]}</p>
          <p className="text-red-400 text-sm">🔥 Fire: {data.fire}</p>
          <p className="text-yellow-400 text-sm">🟡 Weapon: {data.weapon}</p>
          <p className="text-purple-400 text-sm">🟣 Fight: {data.fight}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <GlassCard dark={dark}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-5 mb-8">
        <h2 className={`text-lg font-semibold ${dark ? "text-white" : "text-black"}`}>Event Trend</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`rounded-lg px-4 py-2 text-sm outline-none border transition
            ${
              dark
                ? "bg-[#111C2D] border-white/10 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis dataKey="label" stroke="#888" />
          <YAxis stroke="#888" />

          {/* 👇 USE CUSTOM TOOLTIP */}
          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <Line type="monotone" dataKey="fire" stroke="#ef4444" strokeWidth={2} dot />
          <Line type="monotone" dataKey="weapon" stroke="#f59e0b" strokeWidth={2} dot />
          <Line type="monotone" dataKey="fight" stroke="#a855f7" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}