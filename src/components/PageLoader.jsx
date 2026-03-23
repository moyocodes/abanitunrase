export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[9999]">
      <img
        src="/logwhi.png"
        alt="Abánitúnrase"
        className="h-10 opacity-0 animate-[fadeIn_0.6s_ease_0.1s_forwards]"
      />
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-[#f5f0e6]/30"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 0.9; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
