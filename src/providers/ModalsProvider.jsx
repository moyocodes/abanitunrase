import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCallModal from "@/components/BookCallModal";
import BookingLookup from "@/components/BookingLookup";
import PaystackPayment from "@/components/forms/PaystackPayment";
import { updateBookingStatus, updateBooking } from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";

const ModalsCtx = createContext(null);

const TYPE_SERVICE = {
  wedding:            "Wedding Styling",
  occasion:           "Occasion Styling",
  travel:             "Kájáyelo Travel Styling",
  consultation:       "Consultation",
  coupleConsultation: "Couple's Consultation",
};

export function ModalsProvider({ children }) {
  const navigate = useNavigate();
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [lookupOpen,   setLookupOpen]   = useState(false);
  const [continuePay,  setContinuePay]  = useState(null);
  const [directPay,    setDirectPay]    = useState(null);

  const openBookCall  = () => setBookCallOpen(true);
  const closeBookCall = () => { setBookCallOpen(false); setContinuePay(null); };
  const openLookup    = () => setLookupOpen(true);
  const closeLookup   = () => setLookupOpen(false);

  const handleContinuePayment = (booking) => {
    setLookupOpen(false);
    const type = booking.type;
    if (type === "consultation" || type === "coupleConsultation") {
      setContinuePay({
        prefill: {
          name:    booking.data?.fullName ?? "",
          email:   booking.data?.email   ?? "",
          phone:   booking.data?.phone   ?? "",
          service: type,
        },
        autoPayment: true,
      });
    } else {
      setDirectPay(booking);
    }
  };

  const handleDirectPaySuccess = (payment) => {
    const b = directPay;
    updateBookingStatus(b.id, "confirmed").catch(console.error);
    updateBooking(b.id, {
      "data.paid": true,
      "data.paymentReference": payment.reference,
    }).catch(console.error);
    sendBookingEmails({
      email: b.data.email,
      name:  b.data.fullName,
      phone: b.data.phone,
      formType: b.type,
      serviceName: TYPE_SERVICE[b.type] || b.type,
      reference: payment.reference,
    }).catch(console.error);
    setDirectPay(null);
  };

  const handleRebook = (booking) => {
    closeLookup();
    const type = booking?.type;
    if (!type || type === "consultation" || type === "coupleConsultation") {
      setBookCallOpen(true);
    } else {
      navigate("/lookbook");
    }
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
        onRebook={handleRebook}
      />

      {directPay && (
        <div className="fixed inset-0 z-[920] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#1a1706]/55 backdrop-blur-lg"
            onClick={() => setDirectPay(null)}
          />
          <div className="relative z-10 bg-white w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-2">
              <p className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/40">
                ABÁNÍTÚNRASE
              </p>
              <button
                onClick={() => setDirectPay(null)}
                className="w-7 h-7 rounded-full border border-[#1a1706]/15 text-[#1a1706]/40 text-xs flex items-center justify-center hover:text-[#1a1706] transition-colors"
              >
                &#10005;
              </button>
            </div>
            <p className="font-['Cormorant_Garamond'] italic text-[#1a1706] text-xl mb-1">
              {TYPE_SERVICE[directPay.type] || directPay.type}
            </p>
            <p className="font-['DM_Mono'] text-[7.5px] tracking-[0.15em] uppercase text-[#1a1706]/35 mb-4">
              Complete your booking payment
            </p>
            <PaystackPayment
              name={directPay.data?.fullName}
              email={directPay.data?.email}
              phone={directPay.data?.phone}
              formType={directPay.type}
              serviceName={TYPE_SERVICE[directPay.type]}
              amount={directPay.data?.amount ?? 0}
              onSuccess={handleDirectPaySuccess}
              onClose={() => setDirectPay(null)}
            />
          </div>
        </div>
      )}
    </ModalsCtx.Provider>
  );
}

export function useModals() {
  return useContext(ModalsCtx);
}
