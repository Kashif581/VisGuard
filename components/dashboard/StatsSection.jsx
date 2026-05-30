import StatCard from "./StatCard";
import { statsData } from "../../data/statsData";
export default function StatsSection({dark}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      {statsData.map((item) => (
        <StatCard dark={dark} key={item.title} item={item} />
      ))}
    </div>
  );
}