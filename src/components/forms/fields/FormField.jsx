import { cn } from "@/lib/utils";

export default function FormField({ label, required, children, hint }) {
  return (
    <div className="mb-6">
      {label && (
        <label className={cn("block font-mono text-[9px] tracking-[0.3em] uppercase text-[#1a1706]/65 font-semibold mb-2")}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && (
        <p className="mt-1.5 font-mono text-[10px] text-black/30">{hint}</p>
      )}
    </div>
  );
}
