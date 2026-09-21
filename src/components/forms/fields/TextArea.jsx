import { cn } from "@/lib/utils";

export default function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  variant = "dark",
}) {
  const isLight = variant === "light";
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full border px-3 py-3",
        "text-sm outline-none transition-colors resize-none",
        isLight
          ? "bg-white border-[#1a1706]/15 text-[#1a1706] placeholder:text-[#1a1706]/35 focus:border-[#1a1706]/35"
          : "bg-[#1a1706] border-[#f5f0e6]/10 text-[#f5f0e6] placeholder:text-[#f5f0e6]/55 focus:border-[#f5f0e6]/35",
      )}
    />
  );
}
