import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5f0e6]/8 to-transparent" />

          <img
            src="/logwhi.png"
            alt="Abánitúnrase"
            className="h-9 mb-12 opacity-60"
          />

          <h1 className="font-['Cormorant_Garamond'] italic text-[#f5f0e6] text-[clamp(28px,4vw,52px)] mb-4 leading-tight">
            Something went wrong.
          </h1>
          <p className="font-['Outfit'] text-[#f5f0e6]/40 text-[14px] mb-10 max-w-sm leading-relaxed font-light">
            An unexpected error occurred. Refresh the page or reach us at{" "}
            <a
              href="mailto:Officialabanitunrase@gmail.com"
              className="text-[#f5f0e6]/60 hover:text-[#f5f0e6] transition-colors underline underline-offset-2"
            >
              Officialabanitunrase@gmail.com
            </a>{" "}
            if it persists.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="font-['DM_Mono'] text-[9px] tracking-[0.28em] uppercase px-8 py-3.5 bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white transition-colors cursor-pointer border-none"
            >
              Refresh →
            </button>
            <a
              href="/"
              className="font-['DM_Mono'] text-[9px] tracking-[0.28em] uppercase px-8 py-3.5 border border-[#f5f0e6]/18 text-[#f5f0e6]/50 hover:border-[#f5f0e6]/45 hover:text-[#f5f0e6] transition-all no-underline"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
