// Shared yes/no confirmation modal for the admin dashboard, replacing
// window.confirm() (a blocking native dialog that can't be styled and
// interrupts the page mid-interaction) with an in-page modal matching the
// rest of the admin UI.
export default function ConfirmModal({
  title = "Confirm",
  message,
  detail,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm border border-[#e8e5dc]">
        <div className="px-6 py-5 border-b border-[#e8e5dc]">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1706]/45 font-semibold mb-1">
            {title}
          </div>
          <div className="font-['Outfit'] text-[15px] text-[#1a1706] font-medium">
            {message}
          </div>
          {detail && (
            <div className="font-mono text-[11px] text-[#1a1706]/45 mt-1">
              {detail}
            </div>
          )}
        </div>
        <div className="px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 border border-[#1a1706]/15 text-[#1a1706]/55 hover:border-[#1a1706]/35 hover:text-[#1a1706]/80 transition-colors font-semibold bg-transparent cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2 transition-colors font-semibold border-none cursor-pointer ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#1a1706] text-[#f5f0e6] hover:bg-black"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
