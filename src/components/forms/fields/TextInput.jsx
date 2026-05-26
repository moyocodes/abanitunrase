import { cn } from "@/lib/utils";

export default function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full bg-[#1a1706] border border-[#1a1706]/0 px-3 py-3",
        "text-[#f5f0e6] text-sm placeholder:text-[#f5f0e6]/35",
        "outline-none focus:border-[#f5f0e6]/20 transition-colors",
        "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-100",
        "[color-scheme:dark]"
      )}
    />
  );
}
