import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckboxGroup({ options, values = [], onChange, name }) {
  const toggle = (optValue) => {
    if (values.includes(optValue)) {
      onChange(values.filter((v) => v !== optValue));
    } else {
      onChange([...values, optValue]);
    }
  };

  return (
    <div className="space-y-1">
      {options.map((option) => {
        const optValue = typeof option === "string" ? option : option.value;
        const optLabel = typeof option === "string" ? option : option.label;
        const isChecked = values.includes(optValue);

        return (
          <label key={optValue} className={cn("flex items-center gap-3 py-2 cursor-pointer group")}>
            <input
              type="checkbox"
              name={name}
              value={optValue}
              checked={isChecked}
              onChange={() => toggle(optValue)}
              className="sr-only"
            />
            <div
              className={cn(
                "w-4 h-4 border flex items-center justify-center transition-colors flex-shrink-0",
                isChecked ? "border-[#1a1706]/60 bg-[#1a1706]/06" : "border-black/20 group-hover:border-black/40"
              )}
            >
              {isChecked && <Check size={10} className="text-[#1a1706]" />}
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
