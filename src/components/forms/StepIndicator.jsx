import { cn } from "@/lib/utils";

export default function StepIndicator({ steps, current }) {
  const pct = ((current + 1) / steps) * 100;

  return (
    <div className="py-5">
      <div className={cn("font-mono text-[10px] tracking-[0.25em] uppercase text-[rgba(26,23,6,0.38)] mb-3")}>
        Step {current + 1} of {steps}
      </div>
      <div className="w-full h-px bg-[rgba(26,23,6,0.1)] relative">
        <div
          className="absolute left-0 top-0 h-px bg-[#1a1706] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
