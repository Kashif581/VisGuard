import { motion } from "framer-motion";

export default function Card({title,children,dark,className = "",}) {
  return (
    <motion.div
      // whileHover={{ scale: 1.02 }}
      className={`
        border rounded-2xl shadow-lg transition
        ${dark ? "bg-black/40 border-zinc-800 text-white" : "bg-white border-gray-300 text-black"}
        ${className}
      `}
    >
      {title && (
        <h2 className="text-lg mb-2 font-semibold">
          {title}
        </h2>
      )}

      {children}
    </motion.div>
  );
}