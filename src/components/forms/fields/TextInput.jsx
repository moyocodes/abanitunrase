import { cn } from "@/lib/utils";

export default function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full bg-transparent border-b border-black/12 py-3",
        "text-[#1a1706] text-sm placeholder:text-black/25",
        "outline-none focus:border-black/40 transition-colors"
      )}
    />
  );
}
