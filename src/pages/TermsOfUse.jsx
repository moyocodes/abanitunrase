import { Link } from "react-router-dom";
import Nav from "@/components/Nav";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Nav hidden={false} onBookCall={() => {}} />
      <div className="max-w-[760px] mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* eyebrow */}
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40 mb-4">
          ABÁNITÚNRASE
        </div>

        <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,60px)] text-[#1a1706] mb-3 leading-none">
          Terms of Use.
        </h1>

        <p className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-10">
          Effective May 2026
        </p>

        {/* Introduction */}
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          These Terms of Use govern your engagement with ABÁNITÚNRASE, a luxury personal styling house based in Lagos, Nigeria. By booking a consultation, making payment, or engaging our services in any capacity, you confirm that you have read, understood, and agree to be bound by these terms.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          If you do not agree with any part of these terms, please do not proceed with a booking. For questions before booking, you are welcome to reach us on WhatsApp or email before committing.
        </p>

        {/* Section 1 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          1. Our Services
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          ABÁNITÚNRASE offers personal styling, wardrobe consulting, editorial direction, and occasion-based styling services. Our work covers weddings and bridal styling, events and occasions, travel capsule wardrobes, and creative editorials. Each service tier is described on our website and confirmed in writing before work commences.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All styling work reflects our professional creative direction. While we listen closely to your preferences, the final approach — including garment selection, colour coordination, and outfit composition — involves our aesthetic judgement. We encourage open communication throughout so that we can align our vision with yours.
        </p>

        {/* Section 2 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          2. Booking Policy
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All bookings must be confirmed in writing via WhatsApp or email. A booking is not considered active until a consultation fee has been received and acknowledged by ABÁNITÚNRASE. We reserve the right to decline bookings at our discretion, including in cases where our capacity is full or where the nature of the request falls outside our current service scope.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Clients are encouraged to book well in advance, particularly for wedding and event styling, which may require substantial lead time for sourcing, bespoke fitting, and alterations. Last-minute bookings are subject to availability and may attract a premium.
        </p>

        {/* Section 3 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          3. Consultation Fees Are Non-Refundable
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Consultation fees paid to ABÁNITÚNRASE are strictly non-refundable. These fees cover the time, preparation, research, and expertise committed to your booking from the moment it is confirmed. This applies regardless of whether the consultation has taken place.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          In exceptional circumstances — such as a bereavement or a documented medical emergency — we may, at our sole discretion, offer a credit note redeemable against a future booking. This is not a right and will be assessed on a case-by-case basis.
        </p>

        {/* Section 4 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          4. 24-Hour Hold Policy
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Upon enquiry, ABÁNITÚNRASE may place a 24-hour provisional hold on a date or slot at your request. This hold is offered as a courtesy and does not guarantee your booking. If payment is not received within 24 hours of the hold being placed, the slot will be released and made available to other clients without further notice.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We will always communicate the hold expiry clearly. Extensions beyond 24 hours are not standard and must be explicitly agreed upon in writing.
        </p>

        {/* Section 5 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          5. Styling Fees vs. Garment Costs
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          It is important to understand that our styling fees are entirely separate from the cost of garments, accessories, tailoring, alterations, or any other items procured on your behalf during the styling process.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Our styling fee covers our creative direction, sourcing, coordination, and time. The cost of actual garments — whether ready-to-wear, rented, or bespoke — is the client's financial responsibility and will be communicated transparently before any purchase or commitment is made on your behalf.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          For bespoke commissions coordinated through our network of Lagos tailors and designers, a clear brief, timeline, and cost estimate will be shared with you before work begins. We do not mark up vendor costs without disclosure.
        </p>

        {/* Section 6 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          6. Cancellation & Rescheduling
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Should you need to reschedule a confirmed booking, please notify us as early as possible — ideally at least 48 hours before your scheduled appointment. We will do our best to accommodate a new date subject to availability. Rescheduling requests made with less than 24 hours' notice may forfeit the original consultation fee and require a new payment to secure a future slot.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Outright cancellations — where you choose not to proceed with a booking entirely — result in the forfeiture of all consultation fees paid. No refund or credit will be issued for cancellations unless we are in breach of a material obligation on our part.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          In rare cases where ABÁNITÚNRASE needs to cancel or reschedule your appointment due to illness, emergency, or other unforeseen circumstances, we will communicate promptly and offer you an alternative date or a full refund of your consultation fee, at your preference.
        </p>

        {/* Section 7 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          7. Intellectual Property
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All styling concepts, mood boards, lookbooks, written briefs, and creative direction documents produced by ABÁNITÚNRASE remain the intellectual property of ABÁNITÚNRASE, unless expressly transferred in writing. You are granted a personal, non-transferable licence to use these materials for your own styling purposes.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All photographs, videos, and content produced in collaboration with ABÁNITÚNRASE or featuring our styling work — including editorial images and behind-the-scenes content — may be used by ABÁNITÚNRASE for portfolio, website, and social media purposes. Credit will be given where appropriate. If you do not consent to this, please notify us in writing before your session.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          You may not reproduce, redistribute, or commercially exploit any creative materials prepared by ABÁNITÚNRASE without prior written consent.
        </p>

        {/* Section 8 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          8. Communication Channels
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          The official communication channels for ABÁNITÚNRASE are WhatsApp and email. All booking confirmations, styling briefs, invoices, and correspondence relevant to your engagement should be conducted through these channels to ensure clarity and traceability.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Agreements made verbally or via other messaging platforms (e.g., Instagram DMs) are not formally binding unless confirmed in writing via WhatsApp or email. We recommend always requesting written confirmation of any arrangement.
        </p>
        <div className="bg-[#1a1706]/[0.03] border border-[#1a1706]/[0.07] rounded-sm p-6 mt-2 mb-4">
          <p className="font-['DM_Mono'] text-[9px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-3">Official Contact</p>
          <p className="font-['Outfit'] text-[14px] leading-[1.9] text-[#1a1706]/60">
            Email: <a href="mailto:Officialabanitunrase@gmail.com" className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors underline underline-offset-2 decoration-[#1a1706]/20">Officialabanitunrase@gmail.com</a><br />
            WhatsApp: <a href="tel:+2348126286593" className="text-[#1a1706]/80 hover:text-[#1a1706] transition-colors">+234 812 628 6593</a>
          </p>
        </div>

        {/* Section 9 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          9. Client Responsibilities
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          As a client, you are responsible for providing accurate information about yourself, including your measurements, preferences, event details, and any relevant constraints (e.g., dress codes, cultural requirements, budget limits). Inaccurate or incomplete information may affect the quality of our work and does not entitle you to a refund.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          You are also responsible for attending scheduled appointments on time. Arriving significantly late to an in-person consultation may result in a shortened session or forfeiture of the slot, at ABÁNITÚNRASE's discretion.
        </p>

        {/* Section 10 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          10. Limitation of Liability
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          ABÁNITÚNRASE shall not be held liable for any indirect, incidental, or consequential loss arising from our services, including but not limited to delays caused by third-party vendors, tailors, or logistics providers. Our liability in any circumstance is limited to the value of the consultation fee paid for the relevant booking.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We take every effort to source quality garments and recommend reputable tailors, but we cannot be held responsible for the independent conduct of third-party vendors once a referral or purchase has been made.
        </p>

        {/* Section 11 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          11. Governing Law
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          These Terms of Use are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from or in connection with your engagement with ABÁNITÚNRASE shall first be addressed through direct negotiation in good faith. If a resolution cannot be reached, disputes may be referred to mediation or a competent court of jurisdiction in Lagos State, Nigeria.
        </p>

        {/* Section 12 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          12. Updates to These Terms
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We may update these Terms of Use from time to time. Changes will be reflected by an updated effective date on this page. Continued use of our services after any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.
        </p>

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
    </div>
  );
}
