// Admin-only affordance: fills the whole form with mock data in one click so
// an admin can QA the booking flow without hand-typing every field. Never
// rendered unless the parent form is in isAdmin mode.
export default function AdminFillTestData({ onFill }) {
  return (
    <button
      type="button"
      onClick={onFill}
      className="font-mono text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 border border-dashed border-amber-500/50 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
      title="Admin only — fills every field with mock data for testing"
    >
      ⚡ Fill Test Data
    </button>
  );
}
