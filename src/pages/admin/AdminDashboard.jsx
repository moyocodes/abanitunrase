import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getBookings, getContacts } from "@/lib/firestore";

const TYPE_COLORS = {
  wedding: "text-purple-700/70 border-purple-400/40",
  occasion: "text-blue-700/70 border-blue-400/40",
  travel: "text-teal-700/70 border-teal-400/40",
  consultation: "text-amber-700/80 border-amber-400/50",
};

const STATUS_COLORS = {
  new: "border-amber-400/60 text-amber-700/80",
  "in progress": "border-sky-400/60 text-sky-700/80",
  confirmed: "border-green-500/50 text-green-700/80",
  completed: "border-[#1a1706]/20 text-[#1a1706]/45",
  cancelled: "border-red-400/40 text-red-700/60",
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookings(), getContacts()])
      .then(([b, c]) => {
        setBookings(b);
        setContacts(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "All Bookings", value: bookings.length },
    { label: "New", value: bookings.filter((b) => b.status === "new").length },
    { label: "Wedding", value: bookings.filter((b) => b.type === "wedding").length },
    { label: "Occasion", value: bookings.filter((b) => b.type === "occasion").length },
    { label: "Travel", value: bookings.filter((b) => b.type === "travel").length },
    { label: "Consultations", value: bookings.filter((b) => b.type === "consultation").length },
    { label: "Enquiries", value: contacts.length },
  ];

  const recent = bookings.slice(0, 6);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p className="font-mono text-[16px] tracking-[0.24em] uppercase text-[#1a1706]/40 py-10">
          Loading…
        </p>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="border border-[#1a1706]/[0.08] bg-white p-6 hover:border-[#1a1706]/[0.18] transition-colors"
              >
                <div className="font-heading italic text-[#1a1706] text-5xl mb-2">
                  {value}
                </div>
                <div className="font-mono text-[12px] tracking-[0.16em] uppercase text-[#1a1706]/45">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[16px] tracking-[0.18em] uppercase text-[#1a1706]/50">
                Recent Bookings
              </h2>
              <Link
                to="/admin/bookings"
                className="font-mono text-[13px] tracking-[0.14em] uppercase text-[#1a1706]/45 hover:text-[#1a1706]/70 transition-colors"
              >
                View All →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="border border-[#1a1706]/[0.06] py-14 text-center bg-white">
                <p className="font-mono text-[16px] tracking-[0.2em] uppercase text-[#1a1706]/30">
                  No bookings yet
                </p>
              </div>
            ) : (
              <div className="border border-[#1a1706]/[0.08] bg-white divide-y divide-[#1a1706]/[0.05]">
                {recent.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between px-5 py-5 hover:bg-[#1a1706]/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`font-mono text-[12px] tracking-[0.12em] uppercase border px-3 py-1 flex-shrink-0 ${TYPE_COLORS[b.type] ?? "border-[#1a1706]/15 text-[#1a1706]/55"}`}
                      >
                        {b.type}
                      </span>
                      <div className="min-w-0">
                        <div className="font-body text-[#1a1706] text-2xl truncate">
                          {b.data?.fullName || "—"}
                        </div>
                        <div className="font-mono text-[12px] tracking-[0.08em] text-[#1a1706]/50 mt-1 truncate">
                          {b.data?.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[12px] tracking-[0.12em] uppercase border px-3 py-1 flex-shrink-0 ${STATUS_COLORS[b.status] ?? "border-[#1a1706]/15 text-[#1a1706]/55"}`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/bookings"
              className="border border-[#1a1706]/[0.08] bg-white p-6 hover:border-[#1a1706]/[0.2] transition-all duration-200 group"
            >
              <div className="font-mono text-[13px] tracking-[0.16em] uppercase text-[#1a1706]/45 mb-3 group-hover:text-[#1a1706]/65 transition-colors">
                Bookings
              </div>
              <div className="font-heading italic text-[#1a1706] text-3xl">
                Manage bookings →
              </div>
            </Link>
            <Link
              to="/admin/content"
              className="border border-[#1a1706]/[0.08] bg-white p-6 hover:border-[#1a1706]/[0.2] transition-all duration-200 group"
            >
              <div className="font-mono text-[13px] tracking-[0.16em] uppercase text-[#1a1706]/45 mb-3 group-hover:text-[#1a1706]/65 transition-colors">
                Content
              </div>
              <div className="font-heading italic text-[#1a1706] text-3xl">
                Edit site content →
              </div>
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
