import { cn } from "@/lib/utils";

export default function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="space-y-1">
      {options.map((option) => {
        const optValue = typeof option === "string" ? option : option.value;
        const optLabel = typeof option === "string" ? option : option.label;
        const isSelected = value === optValue;

        return (
          <label key={optValue} className={cn("flex items-center gap-3 py-2 cursor-pointer group")}>
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
                isSelected ? "border-[#1a1706]/60" : "border-black/20 group-hover:border-black/40"
              )}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#1a1706]" />}
            </div>
            <span className="text-sm text-black/65 group-hover:text-black/90 transition-colors">
              {optLabel}
            </span>
          </label>
        );
      })}
    </div>
  );
}
