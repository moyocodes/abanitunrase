import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/providers";
import LookSlideshow from "@/components/LookSlideshow";
import BookCallModal from "@/components/BookCallModal";

export const sortedLooks = (allLooks) =>
  [...allLooks].sort((a, b) => (a.catIdx ?? 0) - (b.catIdx ?? 0));

export const lookToPos = (allLooks, lookId) => {
  const idx = sortedLooks(allLooks).findIndex(l => l.id === lookId);
  return idx >= 0 ? String(idx + 1).padStart(2, "0") : null;
};

export default function LookPage() {
  const { pos } = useParams();
  const navigate = useNavigate();
  const { looks: allLooks, refetch } = useData();
  const [bookCallOpen, setBookCallOpen] = useState(false);

  const sorted = sortedLooks(allLooks ?? []);
  const startLook = sorted[parseInt(pos, 10) - 1] ?? null;

  const handleLookChange = (lookId) => {
    const newPos = lookToPos(allLooks ?? [], lookId);
    if (newPos) navigate(`/lookbook/${newPos}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0e0d08]">
      <BookCallModal open={bookCallOpen} onClose={() => setBookCallOpen(false)} />
      <LookSlideshow
        allLooks={allLooks ?? []}
        startLookId={startLook?.id ?? null}
        startCatIdx={null}
        onClose={() => navigate("/lookbook")}
        onBookCall={() => setBookCallOpen(true)}
        onLookChange={handleLookChange}
        refetch={refetch}
      />
    </div>
  );
}
