export default function Input({
  dark,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full px-3 py-2 rounded-lg border outline-none transition

        ${dark
          ? "bg-zinc-900 text-white border-zinc-700 focus:ring-orange-500"
          : "bg-white text-black border-gray-300 focus:ring-orange-500"
        }

        focus:ring-2
        ${className}
      `}
    />
  );
}