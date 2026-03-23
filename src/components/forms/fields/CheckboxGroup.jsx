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
          <label
            key={optValue}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
              isChecked ? "bg-[#1a1706]" : "bg-[#1a1706]/[0.04] hover:bg-[#1a1706]/[0.08]"
            )}
          >
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
                isChecked ? "border-[#f5f0e6]/60 bg-[#f5f0e6]/10" : "border-[#1a1706]/30"
              )}
            >
              {isChecked && <Check size={10} className="text-[#f5f0e6]" />}
            </div>
            <span className={cn("text-sm font-medium transition-colors", isChecked ? "text-[#f5f0e6]" : "text-[#1a1706]/70")}>
              {optLabel}
            </span>
          </label>
        );
      })}
    </div>
  );
}
