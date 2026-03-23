import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData, useModals } from "@/providers";
import LookSlideshow from "@/components/LookSlideshow";
import { FormModal, WeddingForm, OccasionForm, TravelForm } from "@/components/forms";

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
  const { openBookCall } = useModals();
  const [formType, setFormType] = useState(null);
  const [formPrice, setFormPrice] = useState(null);

  const sorted = sortedLooks(allLooks ?? []);
  const startLook = sorted[parseInt(pos, 10) - 1] ?? null;

  const handleLookChange = (lookId) => {
    const newPos = lookToPos(allLooks ?? [], lookId);
    if (newPos) navigate(`/lookbook/${newPos}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0e0d08]">
      <LookSlideshow
        allLooks={allLooks ?? []}
        startLookId={startLook?.id ?? null}
        startCatIdx={null}
        onClose={() => navigate("/lookbook")}
        onBook={(type, price) => { setFormType(type); setFormPrice(price ?? null); }}
        onBookCall={openBookCall}
        onLookChange={handleLookChange}
        refetch={refetch}
      />
      <FormModal
        open={formType !== null}
        onClose={() => setFormType(null)}
        title={formType === "wedding" ? "Wedding Styling Intake" : formType === "occasion" ? "Occasion Styling" : "Kájáyelo Travel Styling"}
      >
        {formType === "wedding"  && <WeddingForm  onComplete={() => setFormType(null)} amount={formPrice} />}
        {formType === "occasion" && <OccasionForm onComplete={() => setFormType(null)} amount={formPrice} />}
        {formType === "travel"   && <TravelForm   onComplete={() => setFormType(null)} amount={formPrice} />}
      </FormModal>
    </div>
  );
}
