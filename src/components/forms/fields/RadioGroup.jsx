import { cn } from "@/lib/utils";

export default function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="space-y-1">
      {options.map((option) => {
        const optValue = typeof option === "string" ? option : option.value;
        const optLabel = typeof option === "string" ? option : option.label;
        const isSelected = value === optValue;

        return (
          <label
            key={optValue}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
              isSelected ? "bg-[#1a1706]" : "bg-[#1a1706]/[0.04] hover:bg-[#1a1706]/[0.08]"
            )}
          >
            <input
              type="radio"
              name={name}
              value={optValue}
              checked={isSelected}
              onChange={() => onChange(optValue)}
              className="sr-only"
            />
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                isSelected ? "border-[#f5f0e6]/60" : "border-[#1a1706]/30"
              )}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#f5f0e6]" />}
            </div>
            <span className={cn("text-sm font-medium transition-colors", isSelected ? "text-[#f5f0e6]" : "text-[#1a1706]/70")}>
              {optLabel}
            </span>
          </label>
        );
      })}
    </div>
  );
}
