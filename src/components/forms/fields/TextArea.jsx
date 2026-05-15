import { cn } from "@/lib/utils";

export default function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full bg-transparent border-b border-black/12 py-3",
        "text-[#1a1706] text-sm placeholder:text-black/25",
        "outline-none focus:border-black/40 transition-colors",
        "resize-none"
      )}
    />
  );
}
