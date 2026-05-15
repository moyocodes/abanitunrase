import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectInput({ options, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent border-b border-black/12 py-3",
          "text-[#1a1706] text-sm appearance-none",
          "outline-none focus:border-black/40 transition-colors cursor-pointer",
          !value && "text-black/30"
        )}
      >
        {placeholder && (
          <option value="" disabled className="bg-white text-black/40">
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === "string" ? option : option.value;
          const optLabel = typeof option === "string" ? option : option.label;
          return (
            <option key={optValue} value={optValue} className="bg-white text-[#1a1706]">
              {optLabel}
            </option>
          );
        })}
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-black/35">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
