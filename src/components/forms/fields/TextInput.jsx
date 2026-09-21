import { cn } from "@/lib/utils";

export default function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  variant = "dark",
}) {
  const isLight = variant === "light";
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full border px-3 py-3",
        "text-sm outline-none transition-colors",
        isLight
          ? [
              "bg-white border-[#1a1706]/15 text-[#1a1706] placeholder:text-[#1a1706]/35",
              "focus:border-[#1a1706]/35",
              "[color-scheme:light]",
            ]
          : [
              "bg-[#1a1706] border-[#f5f0e6]/10 text-[#f5f0e6] placeholder:text-[#f5f0e6]/55",
              "focus:border-[#f5f0e6]/35",
              "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-100",
              "[color-scheme:dark]",
            ],
      )}
    />
  );
}
