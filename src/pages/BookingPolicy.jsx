import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function BookingPolicy() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Nav hidden={false} onBookCall={() => {}} />
      <div className="max-w-[760px] mx-auto px-6 md:px-10 pt-28 pb-20">
        {/* eyebrow */}
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40 mb-4">
          ABÁNITÚNRASE
        </div>

        <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,60px)] text-[#1a1706] mb-3 leading-none">
          Booking Policy.
        </h1>

        <p className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-10">
          Effective May 2026
        </p>

        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          At ABÁNITÚNRASE, every booking is a commitment — from us to you, and
          from you to the process. To ensure the integrity of each styling
          experience and to respect the time and artistry involved, we ask that
          all clients read and understand the following booking terms before
          confirming a session.
        </p>

        {/* Section 1 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          1. Consultation Fee
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All consultations require a non-refundable booking fee, payable in
          full at the time of scheduling. This fee secures your session and
          covers the preliminary research and preparation we undertake before
          your appointment. The amount varies by consultation type and is
          displayed clearly at checkout.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          The consultation fee is credited toward your styling package fee if
          you proceed to a full engagement within 30 days of your consultation.
        </p>

        {/* Section 2 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          2. Scheduling & Confirmation
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Once payment is received, we will confirm your session within 24 hours
          via email and WhatsApp. Your preferred time is treated as a request —
          we will confirm availability and propose a final time if necessary.
          Sessions are confirmed only upon our written acknowledgement.
        </p>

        {/* Section 3 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          3. Rescheduling
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We understand that plans change. You may reschedule your consultation
          once at no additional cost, provided you give us at least 48
          hours&apos; notice. Rescheduling requests made with less than 48
          hours&apos; notice will incur a rescheduling fee of 20% of the
          original consultation fee.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          To reschedule, contact us via WhatsApp or email with your booking
          reference and preferred new time.
        </p>

        {/* Section 4 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          4. Cancellations & Refunds
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Consultation fees are non-refundable in all circumstances. This
          reflects the preparation time, research, and capacity allocation
          committed to your session from the moment of booking.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          For full styling packages paid in advance: if you cancel more than 7
          days before your first session, you are eligible for a 50% refund of
          the styling package fee (not including the consultation fee).
          Cancellations within 7 days of the first session are non-refundable.
        </p>

        {/* Section 5 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          5. No-Shows
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          If you do not attend your scheduled session and have not contacted us
          in advance, your booking will be marked as a no-show. No-shows are
          non-refundable and are not eligible for rescheduling without a new
          booking fee.
        </p>

        {/* Section 6 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          6. Spot Hold
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          If you are not ready to pay immediately, we offer a 48-hour spot hold.
          This reserves your preferred time slot while you arrange payment. If
          full payment is not received within 48 hours, the hold expires and the
          slot is released. A spot hold does not guarantee availability — it is
          a courtesy reservation subject to confirmation.
        </p>

        {/* Section 7 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          7. Styling Package Deposits
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Full styling engagements (Bridal, Occasion, or Travel) require a 50%
          deposit to commence work. The balance is due no later than 48 hours
          before your first in-person session or wardrobe delivery. Work does
          not begin until the deposit is received and confirmed.
        </p>

        {/* Section 8 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          8. Communication
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All booking-related communications — confirmations, rescheduling
          requests, queries — must be made via email or WhatsApp using the
          contact details provided in your confirmation. We do not accept
          booking changes via social media DMs.
        </p>

        {/* Contact box */}
        <div className="bg-[#1a1706]/[0.03] border border-[#1a1706]/[0.07] rounded-sm p-6 mt-10 mb-4">
          <p className="font-['DM_Mono'] text-[9px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-3">
            Get in Touch
          </p>
          <p className="font-['Outfit'] text-[14px] leading-[1.9] text-[#1a1706]/60">
            Email:{" "}
            <a
              href="mailto:officialabanitunrase@gmail.com"
              className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors underline underline-offset-2 decoration-[#1a1706]/20"
            >
              officialabanitunrase@gmail.com
            </a>
            <br />
            WhatsApp:{" "}
            <a
              href="tel:+2348126286593"
              className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors"
            >
              +234 812 628 6593
            </a>
            <br />
            Lagos, Nigeria
          </p>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-[#1a1706]/10">
          <Link
            to="/"
            className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/40 hover:text-[#1a1706]/70 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
