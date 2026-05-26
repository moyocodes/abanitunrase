import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectInput({ options, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-[#1a1706] border border-[#1a1706]/0 px-3 py-3 pr-8",
          "text-sm appearance-none outline-none transition-colors cursor-pointer focus:border-[#f5f0e6]/20",
          value ? "text-[#f5f0e6]" : "text-[#f5f0e6]/35"
        )}
      >
        {placeholder && (
          <option value="" disabled className="bg-[#1a1706] text-[#f5f0e6]/50">
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === "string" ? option : option.value;
          const optLabel = typeof option === "string" ? option : option.label;
          return (
            <option key={optValue} value={optValue} className="bg-[#1a1706] text-[#f5f0e6]">
              {optLabel}
            </option>
          );
        })}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#f5f0e6]/40">
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
