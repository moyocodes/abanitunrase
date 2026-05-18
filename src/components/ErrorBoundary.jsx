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
          <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e6]/30 mb-6">
            ABÁNITÚNRASE
          </p>
          <h1 className="font-heading italic text-[#f5f0e6] text-[clamp(28px,4vw,56px)] mb-4">
            Something went wrong.
          </h1>
          <p className="font-body text-[#f5f0e6]/45 text-sm mb-10 max-w-sm leading-relaxed">
            An unexpected error occurred. Please refresh the page or contact us
            if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-mono text-xs tracking-[0.25em] uppercase px-8 py-3 bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white transition-colors"
          >
            Refresh →
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
