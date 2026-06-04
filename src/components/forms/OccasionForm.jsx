import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
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

const TOTAL_STEPS = 8;

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
  contactMethod: "",
  // Step 1
  stylingTypes: [],
  stylingTypesOther: "",
  eventDate: "",
  eventLocation: "",
  duration: "",
  // Step 2
  stylingStart: "",
  dateConfirmed: "",
  // Step 3
  numberOfLooks: "",
  onDayStyling: "",
  outfitChanges: "",
  // Step 4
  personalStyle: "",
  designerRefs: "",
  avoidStyles: "",
  // Step 5
  comfortableFees: "",
  pricingExpectations: "",
  // Step 6
  workStyle: "",
  creativeImportance: "",
  communicationStyle: "",
  // Step 7
  collaborators: [],
  otherDetails: "",
  confirmTimeline: false,
  confirmRushFees: false,
  confirmFees: false,
};

export default function OccasionForm({ onComplete, amount: amountProp }) {
  const { occasion } = useData();
  const packageAmount = (occasion?.find(p => p.featured) ?? occasion?.[0])?.price ?? 0;
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyState);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const bookingIdRef = useRef(null);

  const set = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const handleNext = () => {
    setError("");
    if (step === 0) {
      if (!data.fullName.trim()) { setError("Full name is required."); return; }
      if (!data.email.trim()) { setError("Email is required."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) { setError("Please enter a valid email address."); return; }
      if (!data.phone.trim()) { setError("Phone number is required."); return; }
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!data.confirmTimeline) { setError("Please acknowledge the styling timeline."); return; }
    if (!data.confirmRushFees) { setError("Please acknowledge rush fees policy."); return; }
    if (!data.confirmFees) { setError("Please acknowledge the fee structure."); return; }
    setError("");
    saveBooking("occasion", { ...data, preferredTime: data.eventDate, amount: (amountProp ?? packageAmount) * 100 })
      .then(id => { bookingIdRef.current = id; })
      .catch(console.error);
    sendBookingEmails({
      kind: "form_submitted",
      email: data.email,
      name: data.fullName,
      phone: data.phone,
      serviceName: "Occasion Styling",
    }).catch(console.error);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (response) => {
    const amt = (amountProp ?? packageAmount) * 100;
    const id = bookingIdRef.current;
    if (id) {
      updateBookingStatus(id, "confirmed").catch(console.error);
      updateBooking(id, {
        "data.paid": true,
        "data.paymentReference": response?.reference || "",
        "data.amount": amt,
      }).catch(console.error);
    } else {
      saveBooking("occasion", {
        ...data,
        preferredTime: data.eventDate,
        paid: true,
        paymentReference: response?.reference || "",
        amount: amt,
      }, "confirmed").catch(console.error);
    }
    onComplete();
  };

  if (showPayment) {
    return (
      <PaystackPayment
        name={data.fullName}
        email={data.email}
        phone={data.phone}
        preferredTime={data.eventDate}
        amount={(amountProp ?? packageAmount) * 100}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
        formType="occasion"
      />
    );
  }

  return (
    <div>
      <StepIndicator steps={TOTAL_STEPS} current={step} />

      <div className="font-heading text-[#1a1706] text-xl mb-8">
        {step === 0 && "Occasion Styling Consultation"}
        {step === 1 && "Service Details"}
        {step === 2 && "Timeline"}
        {step === 3 && "Styling Scope"}
        {step === 4 && "Style Direction"}
        {step === 5 && "Budget"}
        {step === 6 && "Creative Alignment"}
        {step === 7 && "Collaboration & Acknowledgement"}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div>
          <SectionHeader>Client Information</SectionHeader>
          <FormField label="Full Name" required>
            <TextInput value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
          </FormField>
          <FormField label="Email" required>
            <TextInput value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" type="email" />
          </FormField>
          <FormField label="Phone" required>
            <TextInput value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 ..." type="tel" />
          </FormField>
          <FormField label="Preferred Contact Method">
            <RadioGroup
              name="contactMethod"
              options={["Email", "WhatsApp", "Phone call"]}
              value={data.contactMethod}
              onChange={(v) => set("contactMethod", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <SectionHeader>Service Details</SectionHeader>
          <FormField label="Type of Styling Required">
            <CheckboxGroup
              name="stylingTypes"
              options={["Event styling", "Photoshoot/Editorial", "Special appearance", "Content creation", "Other"]}
              values={data.stylingTypes}
              onChange={(v) => set("stylingTypes", v)}
            />
            {data.stylingTypes.includes("Other") && (
              <div className="mt-3">
                <TextInput value={data.stylingTypesOther} onChange={(e) => set("stylingTypesOther", e.target.value)} placeholder="Please specify" />
              </div>
            )}
          </FormField>
          <FormField label="Event / Shoot Date">
            <TextInput type="date" value={data.eventDate} onChange={(e) => set("eventDate", e.target.value)} placeholder="DD / MM / YYYY" />
          </FormField>
          <FormField label="Event / Shoot Location">
            <TextInput value={data.eventLocation} onChange={(e) => set("eventLocation", e.target.value)} placeholder="City, venue..." />
          </FormField>
          <FormField label="Duration">
            <RadioGroup
              name="duration"
              options={["One day", "Two days", "Multiple days"]}
              value={data.duration}
              onChange={(v) => set("duration", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <SectionHeader>Timeline</SectionHeader>
          <FormField label="When would you like styling to begin?">
            <RadioGroup
              name="stylingStart"
              options={["3–6 months in advance", "1–2 months", "Less than 1 month"]}
              value={data.stylingStart}
              onChange={(v) => set("stylingStart", v)}
            />
          </FormField>
          <FormField label="Is your date confirmed?">
            <RadioGroup
              name="dateConfirmed"
              options={["Yes", "Tentative"]}
              value={data.dateConfirmed}
              onChange={(v) => set("dateConfirmed", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <SectionHeader>Styling Scope</SectionHeader>
          <FormField label="Estimated Number of Looks Required">
            <TextInput value={data.numberOfLooks} onChange={(e) => set("numberOfLooks", e.target.value)} placeholder="e.g. 3" />
          </FormField>
          <FormField label="Will you require on-the-day styling support?">
            <RadioGroup
              name="onDayStyling"
              options={["Yes", "No"]}
              value={data.onDayStyling}
              onChange={(v) => set("onDayStyling", v)}
            />
          </FormField>
          <FormField label="Will there be outfit changes?">
            <RadioGroup
              name="outfitChanges"
              options={["Yes", "No"]}
              value={data.outfitChanges}
              onChange={(v) => set("outfitChanges", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <SectionHeader>Style Direction</SectionHeader>
          <FormField label="How would you describe your personal style?">
            <TextArea value={data.personalStyle} onChange={(e) => set("personalStyle", e.target.value)} placeholder="Describe your style..." rows={3} />
          </FormField>
          <FormField label="Are there designers, aesthetics, or references you love?">
            <TextArea value={data.designerRefs} onChange={(e) => set("designerRefs", e.target.value)} placeholder="Designers, aesthetics, references..." rows={3} />
          </FormField>
          <FormField label="Are there any styles, colours, or silhouettes you prefer to avoid?">
            <TextArea value={data.avoidStyles} onChange={(e) => set("avoidStyles", e.target.value)} placeholder="What to avoid..." rows={3} />
          </FormField>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
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
          <FormField label="How would you describe your expectations around pricing?">
            <RadioGroup
              name="pricingExpectations"
              options={[
                "I value quality and expertise",
                "I am working within a set budget",
                "I am still exploring options",
              ]}
              value={data.pricingExpectations}
              onChange={(v) => set("pricingExpectations", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <div>
          <SectionHeader>Creative Alignment</SectionHeader>
          <FormField label="How do you prefer to work with a stylist?">
            <RadioGroup
              name="workStyle"
              options={[
                "I value expert guidance and direction",
                "I prefer a collaborative approach",
                "I already have a clear vision and need execution",
              ]}
              value={data.workStyle}
              onChange={(v) => set("workStyle", v)}
            />
          </FormField>
          <FormField label="How important is creative trust in the styling process?">
            <RadioGroup
              name="creativeImportance"
              options={[
                "Very important",
                "Somewhat important",
                "I prefer to be highly involved",
              ]}
              value={data.creativeImportance}
              onChange={(v) => set("creativeImportance", v)}
            />
          </FormField>
          <FormField label="How would you describe your communication style?">
            <RadioGroup
              name="communicationStyle"
              options={["Prompt and clear", "Flexible", "As time allows"]}
              value={data.communicationStyle}
              onChange={(v) => set("communicationStyle", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 7 */}
      {step === 7 && (
        <div>
          <SectionHeader>Collaboration</SectionHeader>
          <FormField label="Are you currently working with any of the following?">
            <CheckboxGroup
              name="collaborators"
              options={["Designer", "Tailor", "Makeup artist", "Photographer", "Planner", "None"]}
              values={data.collaborators}
              onChange={(v) => set("collaborators", v)}
            />
          </FormField>
          <FormField label="Is there anything else we should be aware of?">
            <TextArea value={data.otherDetails} onChange={(e) => set("otherDetails", e.target.value)} placeholder="Any other details..." rows={4} />
          </FormField>

          <SectionHeader>Acknowledgement</SectionHeader>
          <div className="space-y-4 mb-8">
            {[
              { key: "confirmTimeline", label: "I understand ABÁNITÚNRASE recommends a 3–6 month styling timeline" },
              { key: "confirmRushFees", label: "I understand rush fees may apply for short-notice requests" },
              { key: "confirmFees", label: "I understand styling fees do not include garment purchases or tailoring" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer group">
                <div
                  className={cn(
                    "mt-0.5 w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors",
                    data[key] ? "border-[#1a1706] bg-[#1a1706]" : "border-[#1a1706]/30 group-hover:border-[#1a1706]/60"
                  )}
                  onClick={() => set(key, !data[key])}
                >
                  {data[key] && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#f5f0e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm text-[#1a1706]/75 group-hover:text-[#1a1706] transition-colors"
                  onClick={() => set(key, !data[key])}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
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
