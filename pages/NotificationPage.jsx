import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/dashboard/GlassCard";
import { Dialog, DialogHeader, DialogTitle } from "../components/ui/Dialog";

export default function NotificationPage({dark}) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      camera: "Entrance Gate",
      event: "Fight Detected",
      time: "10:32 AM",
      video: "/videos/Vechicle.mp4",
    },
    {
      id: 2,
      camera: "Parking Area",
      event: "Fight Detected",
      time: "10:35 AM",
      video: "/videos/Vechicle.mp4",
    },
  ]);

  const [selected, setSelected] = useState(null);

  // Live simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem = {
        id: Date.now(),
        camera: `Camera ${Math.floor(Math.random() * 10)}`,
        event: "Fight Detected",
        time: new Date().toLocaleTimeString(),
        video: "/videos/Vechicle.mp4",
      };

      setNotifications((prev) => [newItem, ...prev]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background text-foreground">

      {/* Header */}
      <h1 className="text-2xl font-semibold">
        Live Notifications
      </h1>

      {/* Notifications */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <motion.div
            key={item.id}
            // whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(item)}
          >
            <GlassCard dark={dark} className="cursor-pointer rounded-2xl border border-border bg-card text-card-foreground p-4 flex justify-between items-center hover:shadow-lg transition">

              {/* LEFT SIDE - TEXT */}
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">
                  {item.camera}
                </p>

                <p className="text-red-500 font-semibold">
                  {item.event}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {item.time}
                </p>
              </div>

              {/* RIGHT SIDE - VIDEO */}
              <div className="w-28 h-16 rounded-lg overflow-hidden border border-border bg-black ml-4">
                <video
                  src={item.video}
                  muted
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <div className="p-6 rounded-xl w-full max-w-4xl bg-background text-foreground">

            <DialogHeader>
              <DialogTitle>{selected.camera}</DialogTitle>
            </DialogHeader>

            <p className="text-red-500 mb-4 font-medium">
              {selected.event}
            </p>

            <video
              src={selected.video}
              controls
              autoPlay
              className="w-full rounded-lg border border-border"
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}