export default function GlassCard({ children, dark, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl border transition-all duration-300
        ${
          dark
            ? "bg-zinc-900 border-zinc-800 text-white"
            : "bg-white border-gray-300 text-black shadow-md"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}