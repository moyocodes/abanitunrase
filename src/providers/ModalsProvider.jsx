import { createContext, useContext, useState } from "react";
import BookCallModal from "@/components/BookCallModal";
import BookingLookup from "@/components/BookingLookup";

const ModalsCtx = createContext(null);

export function ModalsProvider({ children }) {
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [lookupOpen,   setLookupOpen]   = useState(false);
  const [continuePay,  setContinuePay]  = useState(null);

  const openBookCall  = () => setBookCallOpen(true);
  const closeBookCall = () => { setBookCallOpen(false); setContinuePay(null); };
  const openLookup    = () => setLookupOpen(true);
  const closeLookup   = () => setLookupOpen(false);

  const handleContinuePayment = (booking) => {
    setLookupOpen(false);
    setContinuePay({
      prefill: {
        name:    booking.data?.fullName ?? "",
        email:   booking.data?.email   ?? "",
        phone:   booking.data?.phone   ?? "",
        service: booking.type === "coupleConsultation" ? "coupleConsultation" : "consultation",
      },
      autoPayment: true,
    });
  };

  return (
    <ModalsCtx.Provider value={{ bookCallOpen, lookupOpen, openBookCall, closeBookCall, openLookup, closeLookup }}>
      {children}
      <BookCallModal
        open={bookCallOpen || continuePay !== null}
        onClose={closeBookCall}
        onTrackBooking={() => { closeBookCall(); openLookup(); }}
        prefill={continuePay?.prefill}
        autoPayment={continuePay?.autoPayment}
      />
      <BookingLookup
        open={lookupOpen}
        onClose={closeLookup}
        onContinuePayment={handleContinuePayment}
      />
    </ModalsCtx.Provider>
  );
}

export function useModals() {
  return useContext(ModalsCtx);
}
