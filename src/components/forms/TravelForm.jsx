import { useState } from "react";
import { cn } from "@/lib/utils";
import { submitToGoogleForm } from "@/lib/googleForm";
import { saveBooking, updateBookingStatus, updateBooking } from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";
import { useData } from "@/providers";
import StepIndicator from "./StepIndicator";
import FormField from "./fields/FormField";
import TextInput from "./fields/TextInput";
import TextArea from "./fields/TextArea";
import RadioGroup from "./fields/RadioGroup";
import CheckboxGroup from "./fields/CheckboxGroup";
import PaystackPayment from "./PaystackPayment";

const TOTAL_STEPS = 6;

function SectionHeader({ children }) {
  return (
    <h3 className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#1a1706]/70 mb-6 mt-8 first:mt-0 pb-2 border-b border-[#1a1706]/10">
      {children}
    </h3>
  );
}

const emptyState = {
  // Step 0
  fullName: "",
  email: "",
  phone: "",
  // Step 1
  destinations: "",
  travelDates: "",
  travelDateReturn: "",
  lengthOfStay: "",
  // Step 2
  tripNature: [],
  plannedActivities: "",
  // Step 3
  numberOfLooks: "",
  inPersonStyling: "",
  personalStyle: "",
  avoidStyles: "",
  designerRefs: "",
  // Step 4
  comfortableFees: "",
  stylistWorkStyle: "",
  // Step 5
  acknowledge: false,
};

export default function TravelForm({ onComplete, amount: amountProp }) {
  const { travel } = useData();
  const packageAmount = (travel?.find(p => p.featured) ?? travel?.[0])?.price ?? 0;
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyState);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [holdState, setHoldState] = useState("idle");
  const [showHoldPrompt, setShowHoldPrompt] = useState(false);

  const set = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const validateStep = () => {
    if (step === 0) {
      if (!data.fullName.trim()) return "Full name is required.";
      if (!data.email.trim()) return "Email is required.";
      if (!data.phone.trim()) return "Phone number is required.";
    }
    return null;
  };

  const handleNext = () => {
    setError("");
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!data.acknowledge) { setError("Please acknowledge the terms before submitting."); return; }
    setError("");
    saveBooking("travel", data).then(id => setBookingId(id));
    sendBookingEmails({
      kind: "form_submitted",
      email: data.email,
      name: data.fullName,
      phone: data.phone,
      serviceName: "Kájáyelo Travel Styling",
    }).catch(console.error);
    submitToGoogleForm({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      service: "Travel Styling — Kájáyelo",
      date: data.travelDates ? `${data.travelDates}${data.travelDateReturn ? " → " + data.travelDateReturn : ""}` : "",
      vision: data.personalStyle,
      budget: data.comfortableFees,
      details: data.destinations,
      notes: [data.lengthOfStay, data.plannedActivities].filter(Boolean).join(" | "),
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (bookingId) updateBookingStatus(bookingId, "confirmed").catch(console.error);
    onComplete();
  };

  const handleHold = async () => {
    if (!data.email.trim()) return;
    setHoldState("submitting");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const heldUntil = expiresAt.toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short" });
    if (bookingId) {
      await updateBooking(bookingId, { status: "held", "data.heldUntil": expiresAt.toISOString() });
    } else {
      await saveBooking("travel", { ...data, heldUntil: expiresAt.toISOString() }, "held");
    }
    sendBookingEmails({
      kind: "hold",
      email: data.email,
      name: data.fullName,
      serviceName: "Kájáyelo Travel Styling",
      heldUntil,
    }).catch(console.error);
    setHoldState("done");
  };

  if (showPayment) {
    return (
      <PaystackPayment
        name={data.fullName}
        email={data.email}
        phone={data.phone}
        preferredTime={data.travelDates}
        amount={(amountProp ?? packageAmount) * 100}
        onSuccess={handlePaymentSuccess}
        onClose={() => { setShowPayment(false); setShowHoldPrompt(true); }}
        formType="travel"
      />
    );
  }

  if (showHoldPrompt) {
    return (
      <div className="py-10 text-center">
        {holdState === "done" ? (
          <>
            <div className="text-[32px] text-[#1a1706]/30 mb-4">&#10003;</div>
            <div className="font-heading italic text-[clamp(22px,2.6vw,34px)] text-[#1a1706] mb-3">Spot Reserved</div>
            <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#1a1706]/45 mb-7">Check your email. Your hold expires in 24 hours.</p>
            <button onClick={onComplete} className="font-mono text-[8px] tracking-[0.2em] uppercase px-6 py-3 border border-[#1a1706]/20 text-[#1a1706]/55 hover:text-[#1a1706] hover:border-[#1a1706]/40 transition-colors cursor-pointer bg-transparent">
              Close
            </button>
          </>
        ) : (
          <>
            <div className="font-heading italic text-[clamp(22px,2.6vw,34px)] text-[#1a1706] mb-3">Still interested?</div>
            <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-[#1a1706]/40 mb-8 max-w-xs mx-auto leading-[2]">
              Reserve your spot for 24 hours — we&apos;ll hold it while you decide.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => { setShowHoldPrompt(false); setShowPayment(true); }}
                className="font-mono text-[8px] tracking-[0.22em] uppercase py-3 px-6 bg-[#1a1706] text-[#f5f0e6] hover:bg-black transition-colors cursor-pointer"
              >
                Complete Payment →
              </button>
              <button
                onClick={handleHold}
                disabled={holdState === "submitting"}
                className="font-mono text-[8px] tracking-[0.22em] uppercase py-3 px-6 border border-[#1a1706]/25 text-[#1a1706]/70 hover:border-[#1a1706]/60 hover:text-[#1a1706] transition-colors cursor-pointer bg-transparent disabled:opacity-40"
              >
                {holdState === "submitting" ? "Reserving…" : "Hold for 24 hours →"}
              </button>
              <button
                onClick={onComplete}
                className="font-mono text-[7px] tracking-[0.2em] uppercase text-[#1a1706]/35 hover:text-[#1a1706]/60 transition-colors bg-transparent border-none cursor-pointer py-1"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={TOTAL_STEPS} current={step} />

      <div className="font-heading text-[#1a1706] text-xl mb-8">
        {step === 0 && "Kájáyelo Travel Styling"}
        {step === 1 && "Travel Information"}
        {step === 2 && "Purpose of Travel"}
        {step === 3 && "Styling Scope & Direction"}
        {step === 4 && "Budget & Creative Alignment"}
        {step === 5 && "Acknowledgement"}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div>
          <SectionHeader>Client Details</SectionHeader>
          <FormField label="Full Name" required>
            <TextInput value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
          </FormField>
          <FormField label="Email" required>
            <TextInput value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" type="email" />
          </FormField>
          <FormField label="Phone Number" required>
            <TextInput value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 ..." type="tel" />
          </FormField>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <SectionHeader>Travel Information</SectionHeader>
          <FormField label="Destination(s)">
            <TextInput value={data.destinations} onChange={(e) => set("destinations", e.target.value)} placeholder="Where are you travelling to?" />
          </FormField>
          <FormField label="Departure Date">
            <TextInput type="date" value={data.travelDates} onChange={(e) => set("travelDates", e.target.value)} />
          </FormField>
          <FormField label="Return Date">
            <TextInput type="date" value={data.travelDateReturn} onChange={(e) => set("travelDateReturn", e.target.value)} />
          </FormField>
          <FormField label="Length of Stay">
            <TextInput value={data.lengthOfStay} onChange={(e) => set("lengthOfStay", e.target.value)} placeholder="e.g. 7 days" />
          </FormField>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <SectionHeader>Purpose of Travel</SectionHeader>
          <FormField label="Nature of Trip">
            <CheckboxGroup
              name="tripNature"
              options={["Leisure", "Honeymoon", "Celebration", "Content/Work", "Other"]}
              values={data.tripNature}
              onChange={(v) => set("tripNature", v)}
            />
          </FormField>
          <FormField label="Planned Activities" hint="Dinners, excursions, events, etc.">
            <TextArea value={data.plannedActivities} onChange={(e) => set("plannedActivities", e.target.value)} placeholder="Describe your planned activities..." rows={4} />
          </FormField>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <SectionHeader>Styling Scope</SectionHeader>
          <FormField label="Estimated Number of Looks Required">
            <TextInput value={data.numberOfLooks} onChange={(e) => set("numberOfLooks", e.target.value)} placeholder="e.g. 5 looks" />
          </FormField>
          <FormField label="Will you require in-person styling?">
            <RadioGroup
              name="inPersonStyling"
              options={["Yes", "No"]}
              value={data.inPersonStyling}
              onChange={(v) => set("inPersonStyling", v)}
            />
          </FormField>

          <SectionHeader>Style Direction</SectionHeader>
          <FormField label="How would you describe your personal style?">
            <TextArea value={data.personalStyle} onChange={(e) => set("personalStyle", e.target.value)} placeholder="Your style aesthetic..." rows={3} />
          </FormField>
          <FormField label="Are there silhouettes, colours, or styles you prefer to avoid?">
            <TextArea value={data.avoidStyles} onChange={(e) => set("avoidStyles", e.target.value)} placeholder="What to avoid..." rows={3} />
          </FormField>
          <FormField label="Any designers or references you love?">
            <TextArea value={data.designerRefs} onChange={(e) => set("designerRefs", e.target.value)} placeholder="Designers, inspo references..." rows={3} />
          </FormField>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <SectionHeader>Budget</SectionHeader>
          <FormField label="Are you comfortable with professional styling fees separate from wardrobe costs?">
            <RadioGroup
              name="comfortableFees"
              options={["Yes", "Open to discussion"]}
              value={data.comfortableFees}
              onChange={(v) => set("comfortableFees", v)}
            />
          </FormField>

          <SectionHeader>Creative Alignment</SectionHeader>
          <FormField label="Which best describes how you like to work with a stylist?">
            <RadioGroup
              name="stylistWorkStyle"
              options={[
                "I value expert direction",
                "I prefer collaboration",
                "I already have a vision and need execution",
              ]}
              value={data.stylistWorkStyle}
              onChange={(v) => set("stylistWorkStyle", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div>
          <SectionHeader>Acknowledgement</SectionHeader>

          <div className={cn(
            "border border-[#1a1706]/10 rounded-lg p-5 mb-8 bg-[#1a1706]/[0.02]",
            "space-y-2"
          )}>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1706]/55 mb-3">
              By submitting this form, you acknowledge that:
            </p>
            <div className="flex items-start gap-2 text-[#1a1706]/65 text-sm">
              <span className="text-[#1a1706]/40 mt-0.5">•</span>
              <span>Travel and accommodation costs are client-covered</span>
            </div>
            <div className="flex items-start gap-2 text-[#1a1706]/65 text-sm">
              <span className="text-[#1a1706]/40 mt-0.5">•</span>
              <span>Styling timelines and availability apply</span>
            </div>
            <div className="flex items-start gap-2 text-[#1a1706]/65 text-sm">
              <span className="text-[#1a1706]/40 mt-0.5">•</span>
              <span>Polaroid documentation is part of the service</span>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group mb-8">
            <div
              className={cn(
                "mt-0.5 w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors",
                data.acknowledge ? "border-[#1a1706]/60 bg-[#1a1706]/5" : "border-[#1a1706]/25 group-hover:border-[#1a1706]/50"
              )}
              onClick={() => set("acknowledge", !data.acknowledge)}
            >
              {data.acknowledge && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#1a1706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              className="text-sm text-[#1a1706]/70 group-hover:text-[#1a1706] transition-colors"
              onClick={() => set("acknowledge", !data.acknowledge)}
            >
              I acknowledge and agree
            </span>
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs font-mono mb-4">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1a1706]/10 mt-4">
        {step > 0 ? (
          <button
            onClick={handlePrev}
            className="font-mono text-xs tracking-[0.2em] uppercase text-[#1a1706]/45 hover:text-[#1a1706] transition-colors py-2"
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={handleNext}
            className={cn(
              "font-mono text-xs tracking-[0.2em] uppercase py-3 px-6 transition-all",
              "bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white"
            )}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={cn(
              "font-mono text-xs tracking-[0.2em] uppercase py-3 px-6 transition-all",
              "bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white"
            )}
          >
            Proceed to Payment →
          </button>
        )}
      </div>
    </div>
  );
}
