import { cn } from "@/lib/utils";

export default function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full bg-[#1a1706] border border-[#1a1706]/0 px-3 py-3",
        "text-[#f5f0e6] text-sm placeholder:text-[#f5f0e6]/35",
        "outline-none focus:border-[#f5f0e6]/20 transition-colors",
        "resize-none"
      )}
    />
  );
}
