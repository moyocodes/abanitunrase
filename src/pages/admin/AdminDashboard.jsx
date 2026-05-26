import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getBookings, getContacts } from "@/lib/firestore";
import { seedRates } from "@/lib/seedRates";

const TYPE_COLORS = {
  wedding:      "text-purple-700 border-purple-400/50",
  occasion:     "text-blue-700 border-blue-400/50",
  travel:       "text-teal-700 border-teal-400/50",
  consultation: "text-amber-700 border-amber-400/60",
};

const STATUS_META = {
  new:       { label: "Submitted", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  held:      { label: "Held",      cls: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed", cls: "bg-[#1a1706]/5 text-[#1a1706]/60 border-[#1a1706]/15" },
};

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [seeding, setSeeding]   = useState(false);
  const [seedMsg, setSeedMsg]   = useState("");

  const handleSeedRates = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      await seedRates();
      setSeedMsg("✓ Rates seeded successfully.");
    } catch (e) {
      setSeedMsg("✗ Failed: " + (e.message ?? "unknown error"));
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    Promise.all([getBookings(), getContacts()])
      .then(([b, c]) => { setBookings(b); setContacts(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "All Bookings",   value: bookings.length },
    { label: "Submitted",      value: bookings.filter(b => b.status === "new").length },
    { label: "Bridal",         value: bookings.filter(b => b.type === "wedding").length },
    { label: "Occasion",       value: bookings.filter(b => b.type === "occasion").length },
    { label: "Travel",         value: bookings.filter(b => b.type === "travel").length },
    { label: "Consultations",  value: bookings.filter(b => b.type === "consultation").length },
    { label: "Enquiries",      value: contacts.length },
  ];

  const recent = bookings.slice(0, 6);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p className="font-mono text-[14px] tracking-[0.24em] uppercase text-[#1a1706]/40 py-10 font-semibold">
          Loading…
        </p>
      ) : (
        <>
          {/* Seed rates */}
          <div className="mb-8 flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSeedRates}
              disabled={seeding}
              className="font-mono text-[10px] tracking-[0.24em] uppercase px-5 py-2.5 border border-[#1a1706]/20 text-[#1a1706]/55 hover:border-[#1a1706]/50 hover:text-[#1a1706]/80 transition-colors bg-transparent cursor-pointer disabled:opacity-40"
            >
              {seeding ? "Seeding…" : "Seed Rates →"}
            </button>
            {seedMsg && (
              <span className={`font-mono text-[10px] tracking-[0.16em] ${seedMsg.startsWith("✓") ? "text-emerald-600" : "text-red-500"}`}>
                {seedMsg}
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="border border-[#1a1706]/[0.1] bg-white p-6 hover:border-[#1a1706]/[0.22] transition-colors"
              >
                <div className="font-mono text-[36px] font-bold text-[#1a1706] leading-none mb-2">
                  {value}
                </div>
                <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#1a1706]/55 font-semibold">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[14px] tracking-[0.2em] uppercase text-[#1a1706]/70 font-bold">
                Recent Bookings
              </h2>
              <Link
                to="/admin/bookings"
                className="font-mono text-[12px] tracking-[0.16em] uppercase text-[#1a1706]/55 hover:text-[#1a1706]/80 font-semibold transition-colors"
              >
                View All →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="border border-[#1a1706]/[0.06] py-14 text-center bg-white">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-[#1a1706]/35 font-medium">
                  No bookings yet
                </p>
              </div>
            ) : (
              <div className="border border-[#1a1706]/[0.08] bg-white overflow-x-auto">
                <table className="w-full border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-[#1a1706]/[0.07] bg-[#f0ede6]">
                      {["Type", "Client", "Email", "Date", "Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-mono text-[9px] tracking-[0.22em] uppercase text-[#1a1706]/55 font-bold whitespace-nowrap border-r border-[#e8e5dc] last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((b, i) => {
                      const sm = STATUS_META[b.status] ?? STATUS_META.new;
                      return (
                        <tr key={b.id} className={`border-b border-[#1a1706]/[0.05] ${i % 2 === 0 ? "bg-white" : "bg-[#faf9f5]"} hover:bg-[#f5f3ee] transition-colors`}>
                          <td className="px-4 py-3 border-r border-[#e8e5dc]">
                            <span className={`font-mono text-[9px] tracking-[0.14em] uppercase border px-2 py-0.5 font-semibold ${TYPE_COLORS[b.type] ?? "border-[#1a1706]/15 text-[#1a1706]/55"}`}>
                              {b.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-r border-[#e8e5dc]">
                            <div className="font-['Outfit'] text-[14px] font-semibold text-[#1a1706] truncate max-w-[140px]">
                              {b.data?.fullName || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r border-[#e8e5dc]">
                            <div className="font-mono text-[11px] text-[#1a1706]/60 truncate max-w-[180px]">
                              {b.data?.email || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r border-[#e8e5dc]">
                            <div className="font-mono text-[11px] text-[#1a1706]/55 whitespace-nowrap">
                              {formatDate(b.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-[9px] tracking-[0.14em] uppercase border px-2 py-0.5 font-semibold ${sm.cls}`}>
                              {sm.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/bookings"
              className="border border-[#1a1706]/[0.1] bg-white p-6 hover:border-[#1a1706]/[0.25] transition-all duration-200 group"
            >
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#1a1706]/55 font-bold mb-2 group-hover:text-[#1a1706]/75 transition-colors">
                Bookings
              </div>
              <div className="font-['Outfit'] text-[15px] font-semibold text-[#1a1706]">
                Manage bookings →
              </div>
            </Link>
            <Link
              to="/admin/emails"
              className="border border-[#1a1706]/[0.1] bg-white p-6 hover:border-[#1a1706]/[0.25] transition-all duration-200 group"
            >
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#1a1706]/55 font-bold mb-2 group-hover:text-[#1a1706]/75 transition-colors">
                Emails
              </div>
              <div className="font-['Outfit'] text-[15px] font-semibold text-[#1a1706]">
                Send client emails →
              </div>
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
