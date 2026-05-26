import { saveSettings, savePricing } from "@/lib/firestore";

const RATES_SETTINGS = {
  heading: "The Rates.",
  sectionLabel: "Investment",
  note: "All prices NGN\nNon-deductible consultation fee",
  consultations: [
    { label: "General Consultation",  note: "One-on-one styling session",       price: "₦100,000" },
    { label: "Couple's Consultation", note: "Joint styling & alignment session", price: "₦150,000" },
  ],
  singlePackages: [
    { service: "Court Wedding",  price: 700000 },
    { service: "White Wedding",  price: 700000 },
    { service: "Engagement",     price: 700000 },
    { service: "After Party",    price: 700000 },
    { service: "Pre-Wedding",    price: 500000 },
  ],
  otherPackages: [
    { service: "Introduction",         price: 700000 },
    { service: "Mother of the Bride",  price: 500000 },
    { service: "Mother of the Groom",  price: 500000 },
    { service: "Bridal Party Styling", price: 1000000 },
  ],
  bookingPolicy: [
    "Bookings are only confirmed subject to the availability of the team.",
    "On-the-day availability attracts extra cost, which does not include accommodation and logistics.",
    "Full package fee is required: 80% commitment fee upon booking, 20% balance one week before the event.",
    "Consultation fee is not deductible upon booking.",
    "All single package prices cover one outfit — extra charges apply for additional outfits.",
    "All package prices cover one person only — extra charges apply for couples.",
  ],
  extrasVisibleOnTabs: ["bridal"],
};

const BRIDAL_PRICING = [
  { package: "Aso Àsìkò",  tier: "IV",   includes: ["Engagement", "White Wedding"],                                                price: 2500000 },
  { package: "Aso Ìgbáfè", tier: "V",    includes: ["Engagement", "White Wedding", "After Party"],                                 price: 3000000, featured: true },
  { package: "Aso Ojúdé",  tier: "VII",  includes: ["Pre-Wedding", "Engagement", "White Wedding", "After Party"],                  price: 4000000 },
  { package: "Aso Àrìyá",  tier: "VIII", includes: ["Pre-Wedding", "Civil Wedding", "Engagement", "White Wedding", "After Party"], price: 4800000 },
];

const OCCASION_PRICING = [
  { package: "Ayẹyẹ Ìwọ̀",   tier: "I",   includes: ["1 Curated Look", "Style Brief", "Shopping Guide"],                                     price: 150000 },
  { package: "Ayẹyẹ Ìpele",  tier: "II",  includes: ["2 Curated Looks", "Style Brief", "Shopping Guide", "Day-of Coordination"],             price: 250000, featured: true },
  { package: "Ayẹyẹ Àgbàdo", tier: "III", includes: ["3 Curated Looks", "Full Wardrobe Plan", "Shopping Guide", "Day-of Coordination"],      price: 350000 },
  { package: "Ayẹyẹ Ìpàdé",  tier: "IV",  includes: ["4 Curated Looks", "Full Wardrobe Plan", "Accessories Sourcing", "Day-of Coordination"], price: 500000 },
];

const TRAVEL_PRICING = [
  { package: "Ìrìn Ìwọ̀",    tier: "I",   includes: ["Weekend Wardrobe (3 Days)", "Packing Guide", "Style Brief"],                                           price: 200000 },
  { package: "Ìrìn Àárín",   tier: "II",  includes: ["Short Trip Wardrobe (5 Days)", "Packing Guide", "Full Style Brief", "Shopping Support"],               price: 350000, featured: true },
  { package: "Ìrìn Ìpele",   tier: "III", includes: ["Extended Stay (10 Days)", "Full Wardrobe Plan", "Shopping Support", "Day-of Coordination"],            price: 500000 },
  { package: "Ìrìn Àṣà",     tier: "IV",  includes: ["Full Season Wardrobe", "Complete Packing Plan", "Shopping Support", "Destination Style Coordination"], price: 750000 },
];

export async function seedRates() {
  await Promise.all([
    saveSettings("rates", RATES_SETTINGS),
    savePricing("bridal", BRIDAL_PRICING),
    savePricing("occasion", OCCASION_PRICING),
    savePricing("travel", TRAVEL_PRICING),
  ]);
}
