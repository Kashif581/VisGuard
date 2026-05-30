import ZoneControls from "../components/dashboard/zones/ZoneControls";
import ZoneCanvas from "../components/dashboard/zones/ZoneCanvas";

import ChartSection from "../components/dashboard/ChartSection";
import StatsSection from "../components/dashboard/StatsSection";
import CameraView from "../components/dashboard/CameraView";
import ClasswiseTable from "../components/dashboard/ClasswiseTable";
import BirdsEyeView from "../components/dashboard/BirdsEyeView";
import useVideoEngine from "../hooks/useVideoEngine";


export default function AnalyticsPage({ dark }) {
  
  const videoEngine = useVideoEngine();

  return (
    <main className="relative w-full overflow-hidden p-6">

      


      {/* ================= DASHBOARD CONTENT ================= */}

      {/* TOP STATS */}
      <StatsSection dark={dark} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.1fr_0.9fr] gap-4 mb-4">
        <CameraView 
        dark={dark} 
        activeVideoId={videoEngine.activeVideoId}
        setActiveVideoId={videoEngine.setActiveVideoId}
        />
        <BirdsEyeView dark={dark} />
        <ClasswiseTable dark={dark} />
      </div>

      {/* BOTTOM CHART */}
      <ChartSection dark={dark} />

    </main>
  );
}