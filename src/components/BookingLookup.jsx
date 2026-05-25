import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBookingsByEmail } from "@/lib/firestore";

const STATUS_CONFIG = {
  new:       { label: "Initiated",  cls: "bg-sky-50 text-sky-700 border-sky-200" },
  held:      { label: "On Hold",    cls: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed ✓",cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Complete",   cls: "bg-[#1a1706]/5 text-[#1a1706]/70 border-[#1a1706]/15" },
};

const TYPE_LABELS = {
  wedding:      "Wedding Styling",
  occasion:     "Occasion Styling",
  travel:       "Kájáyelo Travel",
  consultation: "Consultation",
};

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default function BookingLookup({ open, onClose, onContinuePayment }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setSearched(false);
    try {
      const results = await getBookingsByEmail(email.trim());
      setBookings(results);
      setSearched(true);
    } catch {
      setError("Could not load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail(""); setBookings([]); setSearched(false); setError("");
    }, 400);
  };

  const now = new Date();
  const isExpiredHold = (b) =>
    b.status === "held" && b.data?.heldUntil && new Date(b.data.heldUntil) < now;

  const active = bookings.filter((b) => !isExpiredHold(b));
  const expiredCount = bookings.length - active.length;

  const fieldBase =
    "w-full font-['Outfit'] text-[clamp(16px,1.4vw,19px)] text-[#1a1706] bg-transparent border-0 border-b border-[#1a1706]/13 py-[10px] outline-none transition-[border-color] duration-[250ms] placeholder:text-[#1a1706]/25 focus:border-[#1a1706]";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#1a1706]/55 z-[900] backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[901] bg-white border-t border-[#1a1706]/8 w-full max-w-[680px] overflow-y-auto max-h-[88dvh]"
            style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-[#1a1706]/15" />
            </div>

            <div className="px-5 py-6 md:px-12 md:py-10">
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#1a1706]/15 bg-transparent text-[#1a1706]/40 cursor-pointer text-[14px] transition-all duration-200 flex items-center justify-center hover:bg-[#1a1706]/6 hover:text-[#1a1706]"
                onClick={handleClose}
              >
                &#10005;
              </button>

              <div className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-2">
                Booking Status
              </div>
              <div className="font-['Cormorant_Garamond'] italic text-[clamp(26px,3.4vw,44px)] text-[#1a1706] mb-6 md:mb-9">
                Track your booking.
              </div>

              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                  className={fieldBase + " flex-1"}
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase px-5 py-2 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap flex-shrink-0"
                >
                  {loading ? "Searching…" : "Find →"}
                </button>
              </form>

              {error && (
                <p className="font-['DM_Mono'] text-[8px] tracking-[0.2em] uppercase text-red-500/70 mb-4">{error}</p>
              )}

              {searched && (
                active.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="font-['Cormorant_Garamond'] italic text-[clamp(20px,2.4vw,30px)] text-[#1a1706]/45 mb-3">
                      No active bookings found.
                    </div>
                    <p className="font-['DM_Mono'] text-[7.5px] tracking-[0.2em] uppercase text-[#1a1706]/30 leading-[2]">
                      {expiredCount > 0
                        ? `${expiredCount} hold${expiredCount > 1 ? "s" : ""} found but expired.`
                        : "No bookings were found for this email address."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {expiredCount > 0 && (
                      <p className="font-['DM_Mono'] text-[7px] tracking-[0.18em] uppercase text-[#1a1706]/30">
                        {expiredCount} expired hold{expiredCount > 1 ? "s" : ""} not shown
                      </p>
                    )}
                    {active.map((b) => {
                      const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.new;
                      const typeLabel = TYPE_LABELS[b.type] ?? b.type;
                      const service = b.data?.service || typeLabel;
                      return (
                        <div
                          key={b.id}
                          className="border border-[#1a1706]/10 p-4 md:p-5 flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="font-['Outfit'] text-[15px] font-medium text-[#1a1706]">
                                {service}
                              </div>
                              <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.18em] uppercase text-[#1a1706]/35 mt-0.5">
                                {typeLabel} · {formatDate(b.createdAt)}
                              </div>
                            </div>
                            <span className={`font-['DM_Mono'] text-[7px] tracking-[0.18em] uppercase px-2 py-1 border ${cfg.cls} whitespace-nowrap`}>
                              {cfg.label}
                            </span>
                          </div>

                          {b.status === "held" && !isExpiredHold(b) && onContinuePayment && (
                            <div className="mt-3 pt-3 border-t border-[#1a1706]/8">
                              <button
                                onClick={() => { handleClose(); onContinuePayment(b); }}
                                className="font-['Outfit'] text-[14px] font-semibold tracking-[0.04em] uppercase px-5 py-3 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors cursor-pointer border-none"
                              >
                                Complete Payment →
                              </button>
                            </div>
                          )}

                          {b.data?.preferredTime && (
                            <div className="font-['DM_Mono'] text-[7.5px] tracking-[0.15em] uppercase text-[#1a1706]/40">
                              Preferred time: {b.data.preferredTime}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <p className="font-['DM_Mono'] text-[7px] tracking-[0.18em] uppercase text-[#1a1706]/25 pt-2">
                      Questions? Email officialabanitunrase@gmail.com
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
