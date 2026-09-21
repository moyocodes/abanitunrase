import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectInput({
  options,
  value,
  onChange,
  placeholder,
  variant = "dark",
}) {
  const isLight = variant === "light";
  const bgCls = isLight ? "bg-white" : "bg-[#1a1706]";
  const optionCls = isLight
    ? "bg-white text-[#1a1706]"
    : "bg-[#1a1706] text-[#f5f0e6]";

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          bgCls,
          isLight ? "border border-[#1a1706]/15" : "border border-[#1a1706]/0",
          "px-3 py-3 pr-8",
          "text-sm appearance-none outline-none transition-colors cursor-pointer",
          isLight ? "focus:border-[#1a1706]/35" : "focus:border-[#f5f0e6]/20",
          isLight
            ? value
              ? "text-[#1a1706]"
              : "text-[#1a1706]/35"
            : value
              ? "text-[#f5f0e6]"
              : "text-[#f5f0e6]/35",
        )}
      >
        {placeholder && (
          <option
            value=""
            disabled
            className={isLight ? "bg-white text-[#1a1706]/50" : "bg-[#1a1706] text-[#f5f0e6]/50"}
          >
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === "string" ? option : option.value;
          const optLabel = typeof option === "string" ? option : option.label;
          return (
            <option key={optValue} value={optValue} className={optionCls}>
              {optLabel}
            </option>
          );
        })}
      </select>
      <div
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
          isLight ? "text-[#1a1706]/40" : "text-[#f5f0e6]/40",
        )}
      >
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
