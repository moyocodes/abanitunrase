import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5f0e6]/8 to-transparent" />

      <p className="font-mono text-[8px] tracking-[0.5em] uppercase text-[#f5f0e6]/20 mb-10">
        ABÁNITÚNRASE
      </p>

      <div
        className="font-heading italic text-[#f5f0e6]/8 text-[clamp(100px,22vw,240px)] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        404
      </div>

      <h1 className="font-heading italic text-[#f5f0e6] text-[clamp(22px,3.5vw,52px)] leading-tight mb-4 -mt-3">
        This look doesn&apos;t exist.
      </h1>
      <p className="font-body text-[#f5f0e6]/38 text-sm mb-12 max-w-xs leading-relaxed">
        The page you&apos;re looking for may have moved or never existed.
        Let&apos;s get you back to the atelier.
      </p>

      <Link
        to="/"
        className="font-mono text-[9px] tracking-[0.3em] uppercase px-10 py-3.5 border border-[#f5f0e6]/18 text-[#f5f0e6]/50 hover:border-[#f5f0e6]/45 hover:text-[#f5f0e6] transition-all duration-300"
      >
        ← Back to the Atelier
      </Link>
    </div>
  );
}
