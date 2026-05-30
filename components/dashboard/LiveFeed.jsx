import { motion } from "framer-motion";

export default function LiveFeed({ dark }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-200 text-black"} h-48 rounded-2xl flex items-center justify-center relative`}
        >
          Camera {i}
          <div className="absolute border-2 border-red-500 w-14 h-14 animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  );
}