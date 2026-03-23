import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Nav hidden={false} onBookCall={() => {}} />
      <div className="max-w-[760px] mx-auto px-6 md:px-10 pt-28 pb-20">
        {/* eyebrow */}
        <div className="font-['DM_Mono'] text-[8px] tracking-[0.4em] uppercase text-[#1a1706]/40 mb-4">
          ABÁNITÚNRASE
        </div>

        <h1 className="font-['Cormorant_Garamond'] italic text-[clamp(32px,5vw,60px)] text-[#1a1706] mb-3 leading-none">
          Privacy Policy.
        </h1>

        <p className="font-['DM_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#1a1706]/30 mb-10">
          Effective May 2026
        </p>

        {/* Introduction */}
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          At ABÁNITÚNRASE, we take the privacy of our clients seriously. This
          Privacy Policy explains how we collect, use, store, and protect your
          personal information when you interact with us — through our website
          at abanitunrase.com, via WhatsApp, email, or any other channel through
          which you engage our styling services.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          By booking a consultation, submitting an inquiry, or using our
          website, you agree to the practices described in this policy. Please
          read it carefully.
        </p>

        {/* Section 1 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          1. Information We Collect
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We collect information that is necessary to deliver our styling
          services and manage your bookings effectively. The categories of
          personal data we may collect include:
        </p>
        <ul className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4 list-none space-y-2 pl-0">
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Identity information:
              </strong>{" "}
              your full name, preferred name, gender, and any personal details
              relevant to your styling preferences.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Contact information:
              </strong>{" "}
              email address, phone number (including WhatsApp), and location
              within Lagos or other Nigerian cities.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Booking details:
              </strong>{" "}
              the nature of your occasion (wedding, event, travel, editorial),
              preferred dates and times, styling requests, budget range, and any
              mood boards or reference materials you share with us.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Body measurements:
              </strong>{" "}
              bust, waist, hip, height, and inseam measurements where provided
              for bespoke or fit-focused styling work.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Payment information:
              </strong>{" "}
              transaction records processed through Paystack. We do not directly
              store your card details — these are handled exclusively by
              Paystack's secure infrastructure.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Communication records:
              </strong>{" "}
              messages sent via our website contact forms, WhatsApp, or email
              correspondence.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              <strong className="font-semibold text-[#1a1706]/80">
                Technical data:
              </strong>{" "}
              browser type, device type, IP address, pages visited, and time
              spent on our website. This data is collected automatically through
              standard web analytics tools.
            </span>
          </li>
        </ul>

        {/* Section 2 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          2. How We Use Your Information
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Your personal data is used solely to deliver and improve our styling
          services. Specifically, we use your information to:
        </p>
        <ul className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4 list-none space-y-2 pl-0">
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Process and confirm your booking or consultation request
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Communicate with you about your appointment, styling
              recommendations, and follow-up care
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Send booking reminders, rescheduling notices, or important service
              updates
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Personalise your styling experience based on your preferences and
              past interactions
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Process payments and maintain transaction records for accounting
              purposes
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Respond to enquiries and resolve any concerns you may raise
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#1a1706]/30 mt-1">—</span>
            <span>
              Improve our website and service offerings based on aggregated
              usage patterns
            </span>
          </li>
        </ul>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We will never use your personal data for purposes unrelated to the
          services you have requested, and we will not contact you with
          unsolicited marketing without your explicit consent.
        </p>

        {/* Section 3 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          3. Payment Processing via Paystack
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          All payments made through our website are processed securely by
          Paystack, a PCI-DSS compliant payment processor operating under the
          regulation of the Central Bank of Nigeria. When you make a payment,
          you are sharing your card or bank details directly with Paystack —
          ABÁNITÚNRASE does not receive, view, or store your financial
          credentials.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We receive only a confirmation of successful or failed payment, along
          with a transaction reference number. Paystack's own privacy policy
          governs how they handle your payment data. We encourage you to review
          it at paystack.com/privacy.
        </p>

        {/* Section 4 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          4. Data Storage — Firebase & Google Infrastructure
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Your booking information and submitted forms are stored securely using
          Firebase (Firestore), a cloud database service operated by Google LLC.
          Firebase infrastructure is hosted on Google Cloud Platform and
          complies with international data security standards including ISO/IEC
          27001 and SOC 1/2/3.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Data stored in Firebase is encrypted at rest and in transit. Access to
          this data is restricted to authorised ABÁNITÚNRASE personnel only, and
          is protected by role-based authentication controls. We do not share
          your data with any other third-party services beyond those described
          in this policy.
        </p>

        {/* Section 5 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          5. We Do Not Sell Your Data
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          ABÁNITÚNRASE does not sell, rent, trade, or otherwise transfer your
          personal information to any third party for commercial gain. Your data
          is used exclusively to serve you as a client of our studio.
        </p>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We may share limited information with trusted service providers (such
          as Paystack or Firebase) strictly to enable the delivery of our
          services. These providers are contractually bound to handle your data
          securely and only as directed by us.
        </p>

        {/* Section 6 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          6. Photography & Image Consent
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          If you attend a styled shoot, editorial, or session with ABÁNITÚNRASE,
          images captured during that session may be used on our website,
          Instagram, or marketing materials. If you do not consent to the use of
          your likeness, please inform us in writing before your session. We
          will always respect your wishes regarding image use and will remove
          any existing images upon a written request.
        </p>

        {/* Section 7 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          7. Data Retention
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We retain your personal data for as long as is necessary to fulfil the
          purposes outlined in this policy, and for a reasonable period
          thereafter to comply with any legal or accounting obligations. If you
          would like your data deleted sooner, you may contact us directly and
          we will action your request within 14 business days.
        </p>

        {/* Section 8 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          8. Your Rights
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          You have the right to access the personal data we hold about you,
          request corrections, ask for deletion, or object to certain types of
          processing. To exercise any of these rights, please contact us using
          the details below. We will respond to all requests within a reasonable
          timeframe and will not discriminate against you for making a request.
        </p>

        {/* Section 9 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          9. Cookies & Website Analytics
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          Our website may use cookies and similar tracking technologies to
          understand how visitors interact with the site. This information is
          collected in aggregate and is not linked to your personal identity
          unless you have submitted a form. You may disable cookies in your
          browser settings, though this may affect some functionality of the
          site.
        </p>

        {/* Section 10 */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          10. Changes to This Policy
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          We may update this Privacy Policy from time to time to reflect changes
          in our services, legal requirements, or best practices. When we do,
          the "Effective" date at the top of this page will be updated. We
          encourage you to review this policy periodically. Continued use of our
          services after an update constitutes acceptance of the revised policy.
        </p>

        {/* Contact */}
        <h2 className="font-['Cormorant_Garamond'] italic text-[22px] text-[#1a1706] mt-10 mb-4">
          11. Contact Us
        </h2>
        <p className="font-['Outfit'] text-[15px] leading-[1.85] text-[#1a1706]/70 mb-4">
          If you have any questions about this Privacy Policy, wish to make a
          data request, or have concerns about how your information is handled,
          please reach out to us directly:
        </p>
        <div className="bg-[#1a1706]/[0.03] border border-[#1a1706]/[0.07] rounded-sm p-6 mt-2 mb-4">
          <p className="font-['DM_Mono'] text-[9px] tracking-[0.35em] uppercase text-[#1a1706]/40 mb-3">
            ABÁNITÚNRASE Studio
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
            Phone / WhatsApp:{" "}
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
