export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-slate-950 hover:bg-slate-950 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-gray-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}