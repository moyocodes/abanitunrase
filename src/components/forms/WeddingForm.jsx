import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { saveBooking, confirmBookingPayment } from "@/lib/firestore";
import { sendBookingEmails } from "@/lib/email";
import { useData } from "@/providers";
import StepIndicator from "./StepIndicator";
import FormField from "./fields/FormField";
import TextInput from "./fields/TextInput";
import TextArea from "./fields/TextArea";
import RadioGroup from "./fields/RadioGroup";
import CheckboxGroup from "./fields/CheckboxGroup";
import SelectInput from "./fields/SelectInput";
import PaystackPayment from "./PaystackPayment";
import AdminPaymentStep from "./AdminPaymentStep";

const TOTAL_STEPS = 9;

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
  age: "",
  gender: "",
  genderOther: "",
  phone: "",
  email: "",
  // Step 1
  weddingStyle: "",
  colourPalette: "",
  hasNecklinePreference: "",
  necklinePreference: "",
  // Step 2
  silhouette: "",
  silhouetteOther: "",
  necklineDetail: "",
  fabricPreference: "",
  comfortRequirements: "",
  heelPreference: "",
  // Step 3
  accessories: [],
  accessoriesOther: "",
  noAccessories: "",
  venueAndSeason: "",
  climateConsiderations: "",
  // Step 4
  budgetRange: "",
  alterationsIncluded: "",
  // Step 5
  bodyDescription: "",
  elementsPreference: "",
  skinTone: "",
  skinToneOther: "",
  measurements: "",
  // Step 6
  hasMoodBoard: "",
  moodBoardLink: "",
  hasCelebInspo: "",
  celebInspoLink: "",
  // Step 7
  weddingDate: "",
  attireTimeline: "",
  dresscode: "",
  drescodeOther: "",
  coordinateParty: "",
  // Step 8
  culturalRequirements: "",
  culturalDetails: "",
  hasSymbols: "",
  symbolImages: "",
  fittingsCount: [],
  additionalDetails: "",
  confirmAccurate: false,
  confirmTimeline: false,
  confirmFees: false,
};

export default function WeddingForm({
  onComplete,
  amount: amountProp,
  isAdmin = false,
}) {
  const { bridal } = useData();
  const packageAmount =
    (bridal?.find((p) => p.featured) ?? bridal?.[0])?.price ?? 0;
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyState);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const bookingIdRef = useRef(null);

  const set = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!data.fullName.trim()) return "Full name is required.";
        if (!data.age.trim()) return "Age is required.";
        if (!data.gender) return "Please select a gender.";
        if (!data.phone.trim()) return "Contact number is required.";
        if (!data.email.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
          return "Please enter a valid email address.";
        break;
      case 1:
        if (!data.weddingStyle.trim())
          return "Please describe your wedding style vision.";
        break;
      case 3:
        if (!data.venueAndSeason.trim())
          return "Please describe your venue and season.";
        break;
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

  const handleSubmit = async () => {
    if (!data.confirmAccurate) {
      setError("Please confirm all details are accurate.");
      return;
    }
    if (!data.confirmTimeline) {
      setError("Please acknowledge the styling timeline.");
      return;
    }
    if (!data.confirmFees) {
      setError("Please acknowledge the fee structure.");
      return;
    }
    setError("");
    const id = await saveBooking("wedding", {
      ...data,
      preferredTime: data.weddingDate,
      amount: (amountProp ?? packageAmount) * 100,
    }).catch(console.error);
    if (id) bookingIdRef.current = id;
    sendBookingEmails({
      kind: "form_submitted",
      email: data.email,
      name: data.fullName,
      phone: data.phone,
      serviceName: "Wedding Styling",
      amountLabel: `₦${(amountProp ?? packageAmount).toLocaleString("en-NG")}`,
      allFields: data,
    }).catch(console.error);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (response) => {
    let id = bookingIdRef.current;
    if (!id) {
      id = await saveBooking("wedding", {
        ...data,
        preferredTime: data.weddingDate,
      }).catch(console.error);
    }
    // Admin's manual-reference path already writes paid/confirmed directly
    // (markBookingPaidManually); only re-verify with Paystack for real
    // Paystack checkouts (client flow, or admin's "Collect via Paystack").
    if (id && !response?.manual) {
      await confirmBookingPayment(id, response?.reference).catch(console.error);
    }
    onComplete();
  };

  if (showPayment) {
    const PaymentComponent = isAdmin ? AdminPaymentStep : PaystackPayment;
    return (
      <PaymentComponent
        bookingId={bookingIdRef.current}
        name={data.fullName}
        email={data.email}
        phone={data.phone}
        preferredTime={data.weddingDate}
        amount={(amountProp ?? packageAmount) * 100}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
        formType="wedding"
        allFields={data}
      />
    );
  }

  return (
    <div>
      <StepIndicator steps={TOTAL_STEPS} current={step} />

      <div className="font-heading text-[#1a1706] text-xl mb-8">
        {step === 0 && "Wedding Styling Intake"}
        {step === 1 && "Your Wedding Vision"}
        {step === 2 && "Dress Style & Comfort"}
        {step === 3 && "Accessories & Venue"}
        {step === 4 && "Budget"}
        {step === 5 && "Body Shape & Preferences"}
        {step === 6 && "Inspiration"}
        {step === 7 && "Timeline & Wedding Party"}
        {step === 8 && "Final Details"}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div>
          <SectionHeader>Client Information</SectionHeader>
          <FormField label="Full Name" required>
            <TextInput
              value={data.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Your full name"
            />
          </FormField>
          <FormField label="Age" required>
            <TextInput
              value={data.age}
              onChange={(e) => set("age", e.target.value)}
              placeholder="Your age"
            />
          </FormField>
          <FormField label="Gender" required>
            <RadioGroup
              name="gender"
              options={["Male", "Female", "Prefer not to say", "Other"]}
              value={data.gender}
              onChange={(v) => set("gender", v)}
            />
            {data.gender === "Other" && (
              <div className="mt-3">
                <TextInput
                  value={data.genderOther}
                  onChange={(e) => set("genderOther", e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </FormField>
          <FormField label="Contact Number / WhatsApp" required>
            <TextInput
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234 ..."
              type="tel"
            />
          </FormField>
          <FormField label="Email" required>
            <TextInput
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
          </FormField>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <SectionHeader>Wedding Style Preferences</SectionHeader>
          <FormField
            label="How would you describe the overall style you envision for your wedding?"
            required
          >
            <TextArea
              value={data.weddingStyle}
              onChange={(e) => set("weddingStyle", e.target.value)}
              placeholder="Describe your wedding style vision..."
            />
          </FormField>
          <FormField label="Are there specific themes or colour palettes you are drawn to?">
            <TextArea
              value={data.colourPalette}
              onChange={(e) => set("colourPalette", e.target.value)}
              placeholder="Themes, colours, moods..."
              rows={3}
            />
          </FormField>
          <FormField label="Do you have a preference for sleeve length or neckline style?">
            <RadioGroup
              name="necklinePref"
              options={["Yes", "No"]}
              value={data.hasNecklinePreference}
              onChange={(v) => set("hasNecklinePreference", v)}
            />
            {data.hasNecklinePreference === "Yes" && (
              <div className="mt-3">
                <TextInput
                  value={data.necklinePreference}
                  onChange={(e) => set("necklinePreference", e.target.value)}
                  placeholder="Describe your preference..."
                />
              </div>
            )}
          </FormField>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <SectionHeader>Dress Style</SectionHeader>
          <FormField label="What silhouette are you considering for your wedding gown?">
            <SelectInput
              options={[
                "Ball gown",
                "Mermaid",
                "A-line",
                "Sheath",
                "Empire",
                "Other",
              ]}
              value={data.silhouette}
              onChange={(e) => set("silhouette", e.target.value)}
              placeholder="Select a silhouette"
            />
            {data.silhouette === "Other" && (
              <div className="mt-3">
                <TextInput
                  value={data.silhouetteOther}
                  onChange={(e) => set("silhouetteOther", e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </FormField>
          <FormField label="Do you have a preference for sleeve length or neckline style?">
            <TextArea
              value={data.necklineDetail}
              onChange={(e) => set("necklineDetail", e.target.value)}
              placeholder="Describe your preferences..."
              rows={3}
            />
          </FormField>

          <SectionHeader>Comfort Level</SectionHeader>
          <FormField label="Are there any fabrics or materials you prefer or dislike?">
            <TextArea
              value={data.fabricPreference}
              onChange={(e) => set("fabricPreference", e.target.value)}
              placeholder="Fabrics, materials..."
              rows={3}
            />
          </FormField>
          <FormField label="Do you have any specific comfort requirements for your wedding attire?">
            <TextArea
              value={data.comfortRequirements}
              onChange={(e) => set("comfortRequirements", e.target.value)}
              placeholder="Comfort considerations..."
              rows={3}
            />
          </FormField>
          <FormField label="Are you comfortable wearing heels? If so, how high?">
            <RadioGroup
              name="heels"
              options={["Not at all", "2–3 inches", "3–4 inches", "4–5 inches"]}
              value={data.heelPreference}
              onChange={(v) => set("heelPreference", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <SectionHeader>Accessories</SectionHeader>
          <FormField label="What accessories are you considering?">
            <CheckboxGroup
              name="accessories"
              options={[
                "Veil",
                "Tiara/Crown",
                "Jewellery",
                "Gloves",
                "Belt",
                "Shoes",
                "Bag",
                "Other",
              ]}
              values={data.accessories}
              onChange={(v) => set("accessories", v)}
            />
            {data.accessories.includes("Other") && (
              <div className="mt-3">
                <TextInput
                  value={data.accessoriesOther}
                  onChange={(e) => set("accessoriesOther", e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </FormField>
          <FormField label="Are there any accessories you definitely do NOT want?">
            <TextArea
              value={data.noAccessories}
              onChange={(e) => set("noAccessories", e.target.value)}
              placeholder="Accessories to avoid..."
              rows={3}
            />
          </FormField>

          <SectionHeader>Venue and Season</SectionHeader>
          <FormField
            label="Where will the wedding take place and what season?"
            required
          >
            <TextArea
              value={data.venueAndSeason}
              onChange={(e) => set("venueAndSeason", e.target.value)}
              placeholder="Venue, city, season..."
              rows={3}
            />
          </FormField>
          <FormField label="Are there any climate considerations for your wedding attire?">
            <TextArea
              value={data.climateConsiderations}
              onChange={(e) => set("climateConsiderations", e.target.value)}
              placeholder="Climate, weather notes..."
              rows={3}
            />
          </FormField>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div>
          <SectionHeader>Budget</SectionHeader>
          <FormField label="What is your budget range for the wedding dress and accessories?">
            <SelectInput
              options={[
                "Under ₦500k",
                "₦500k–₦1M",
                "₦1M–₦2M",
                "₦2M–₦5M",
                "Above ₦5M",
                "Open to discussion",
              ]}
              value={data.budgetRange}
              onChange={(e) => set("budgetRange", e.target.value)}
              placeholder="Select budget range"
            />
          </FormField>
          <FormField label="Are alterations and customisation included in your budget?">
            <RadioGroup
              name="alterations"
              options={["Yes", "No", "Open to discussion"]}
              value={data.alterationsIncluded}
              onChange={(v) => set("alterationsIncluded", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div>
          <SectionHeader>Body Shape and Preferences</SectionHeader>
          <FormField label="How would you describe your body?">
            <TextArea
              value={data.bodyDescription}
              onChange={(e) => set("bodyDescription", e.target.value)}
              placeholder="Body shape, features..."
              rows={3}
            />
          </FormField>
          <FormField label="Are there any specific elements you prefer or dislike?">
            <TextArea
              value={data.elementsPreference}
              onChange={(e) => set("elementsPreference", e.target.value)}
              placeholder="Preferences, dislikes..."
              rows={3}
            />
          </FormField>
          <FormField label="Skin Tone">
            <RadioGroup
              name="skinTone"
              options={["Light", "Medium", "Dark", "Other"]}
              value={data.skinTone}
              onChange={(v) => set("skinTone", v)}
            />
            {data.skinTone === "Other" && (
              <div className="mt-3">
                <TextInput
                  value={data.skinToneOther}
                  onChange={(e) => set("skinToneOther", e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </FormField>
          <FormField label="Can you provide your current and preferred measurements for the dress fitting?">
            <TextArea
              value={data.measurements}
              onChange={(e) => set("measurements", e.target.value)}
              placeholder="Measurements, sizing notes..."
              rows={3}
            />
          </FormField>
        </div>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <div>
          <SectionHeader>Inspiration</SectionHeader>
          <FormField label="Do you have any photos or mood board that showcase your desired bridal look?">
            <RadioGroup
              name="hasMoodBoard"
              options={["Yes", "No"]}
              value={data.hasMoodBoard}
              onChange={(v) => set("hasMoodBoard", v)}
            />
            {data.hasMoodBoard === "Yes" && (
              <div className="mt-3">
                <TextInput
                  value={data.moodBoardLink}
                  onChange={(e) => set("moodBoardLink", e.target.value)}
                  placeholder="Link to folder/board"
                />
              </div>
            )}
          </FormField>
          <FormField label="Are there celebrity wedding styles that you find inspiring?">
            <RadioGroup
              name="hasCelebInspo"
              options={["Yes", "No", "Maybe"]}
              value={data.hasCelebInspo}
              onChange={(v) => set("hasCelebInspo", v)}
            />
            {data.hasCelebInspo === "Yes" && (
              <div className="mt-3">
                <TextInput
                  value={data.celebInspoLink}
                  onChange={(e) => set("celebInspoLink", e.target.value)}
                  placeholder="Link to photos"
                />
              </div>
            )}
          </FormField>
        </div>
      )}

      {/* STEP 7 */}
      {step === 7 && (
        <div>
          <SectionHeader>Timeline</SectionHeader>
          <FormField label="When is your wedding date?">
            <TextInput
              type="date"
              value={data.weddingDate}
              onChange={(e) => set("weddingDate", e.target.value)}
              placeholder="DD / MM / YYYY"
            />
          </FormField>
          <FormField label="What is your preferred timeline for selecting and finalising your bridal attire?">
            <SelectInput
              options={[
                "6+ months",
                "3–6 months",
                "1–3 months",
                "Less than 1 month",
              ]}
              value={data.attireTimeline}
              onChange={(e) => set("attireTimeline", e.target.value)}
              placeholder="Select timeline"
            />
          </FormField>

          <SectionHeader>Wedding Party Attire</SectionHeader>
          <FormField label="Will there be a specific dress code for the bridal party?">
            <RadioGroup
              name="dresscode"
              options={["Yes", "No", "Other"]}
              value={data.dresscode}
              onChange={(v) => set("dresscode", v)}
            />
            {data.dresscode === "Other" && (
              <div className="mt-3">
                <TextInput
                  value={data.drescodeOther}
                  onChange={(e) => set("drescodeOther", e.target.value)}
                  placeholder="Please specify"
                />
              </div>
            )}
          </FormField>
          <FormField label="Are you interested in coordinating the style of your attire with the bridesmaids and groomsmen?">
            <RadioGroup
              name="coordinateParty"
              options={["Yes", "No"]}
              value={data.coordinateParty}
              onChange={(v) => set("coordinateParty", v)}
            />
          </FormField>
        </div>
      )}

      {/* STEP 8 */}
      {step === 8 && (
        <div>
          <SectionHeader>Cultural / Traditional Considerations</SectionHeader>
          <FormField label="Are there any cultural or traditional requirements for your attire?">
            <RadioGroup
              name="culturalReq"
              options={["Yes", "No", "Maybe"]}
              value={data.culturalRequirements}
              onChange={(v) => set("culturalRequirements", v)}
            />
            {data.culturalRequirements === "Yes" && (
              <div className="mt-3">
                <TextArea
                  value={data.culturalDetails}
                  onChange={(e) => set("culturalDetails", e.target.value)}
                  placeholder="Please share considerations..."
                  rows={3}
                />
              </div>
            )}
          </FormField>
          <FormField label="Do you have any specific traditions or symbols you'd like to incorporate?">
            <RadioGroup
              name="hasSymbols"
              options={["Yes", "No"]}
              value={data.hasSymbols}
              onChange={(v) => set("hasSymbols", v)}
            />
            {data.hasSymbols === "Yes" && (
              <div className="mt-3">
                <TextInput
                  value={data.symbolImages}
                  onChange={(e) => set("symbolImages", e.target.value)}
                  placeholder="Link to images"
                />
              </div>
            )}
          </FormField>

          <SectionHeader>Final Fitting &amp; Alterations</SectionHeader>
          <FormField label="How many fittings are you comfortable attending?">
            <CheckboxGroup
              name="fittingsCount"
              options={["1", "2", "3", "4", "5"]}
              values={data.fittingsCount}
              onChange={(v) => set("fittingsCount", v)}
            />
          </FormField>

          <SectionHeader>Additional Details</SectionHeader>
          <FormField label="Is there anything else you'd like to share or specific concerns about your wedding attire?">
            <TextArea
              value={data.additionalDetails}
              onChange={(e) => set("additionalDetails", e.target.value)}
              placeholder="Any other details..."
              rows={4}
            />
          </FormField>

          <SectionHeader>Confirmation</SectionHeader>
          <div className="space-y-4 mb-8">
            {[
              {
                key: "confirmAccurate",
                label: "I confirm all details provided are accurate",
              },
              {
                key: "confirmTimeline",
                label:
                  "I understand ABÁNITÚNRASE recommends a 3–6 month styling timeline",
              },
              {
                key: "confirmFees",
                label:
                  "I understand styling fees do not include garment purchases or tailoring",
              },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => set(key, !data[key])}
              >
                <div
                  className={cn(
                    "mt-0.5 w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors",
                    data[key]
                      ? "border-[#1a1706] bg-[#1a1706]"
                      : "border-[#1a1706]/30 group-hover:border-[#1a1706]/60",
                  )}
                >
                  {data[key] && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="#f5f0e6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#1a1706]/75 group-hover:text-[#1a1706] transition-colors">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-xs font-mono mb-4">{error}</p>}

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
              "bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white",
            )}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={cn(
              "font-mono text-xs tracking-[0.2em] uppercase py-3 px-6 transition-all",
              "bg-[#f5f0e6] text-[#0a0a0a] hover:bg-white",
            )}
          >
            Proceed to Payment →
          </button>
        )}
      </div>
    </div>
  );
}
