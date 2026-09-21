// Admin-only test data generators — lets an admin blast through a booking
// form without hand-typing every field while testing. Never imported or
// shown outside isAdmin mode.

function todayPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function mockWeddingData() {
  const suffix = randomSuffix();
  return {
    fullName: `Test Bride ${suffix}`,
    age: "29",
    gender: "Female",
    genderOther: "",
    phone: "+2348012345678",
    email: `test.bride.${suffix.toLowerCase()}@example.com`,
    weddingStyle: "Modern minimalist with traditional Yoruba accents, ivory and gold palette.",
    colourPalette: "Ivory, gold, sage green",
    hasNecklinePreference: "Yes",
    necklinePreference: "Off-shoulder sweetheart neckline",
    silhouette: "A-line",
    silhouetteOther: "",
    necklineDetail: "Sweetheart with delicate lace sleeves",
    fabricPreference: "Silk and lace, no tulle",
    comfortRequirements: "Needs to sit comfortably for a 6-hour reception",
    heelPreference: "2–3 inches",
    accessories: ["Veil", "Jewellery"],
    accessoriesOther: "",
    noAccessories: "No feathers or oversized headpieces",
    venueAndSeason: "Lagos, dry season (December)",
    climateConsiderations: "Hot and humid, breathable fabric needed",
    budgetRange: "₦1M–₦2M",
    alterationsIncluded: "Yes",
    bodyDescription: "Hourglass, 5'6\"",
    elementsPreference: "Prefers structured bodice, dislikes puffy sleeves",
    skinTone: "Medium",
    skinToneOther: "",
    measurements: "Bust 36, Waist 28, Hips 40 (test data)",
    hasMoodBoard: "Yes",
    moodBoardLink: "https://pinterest.com/example-moodboard",
    hasCelebInspo: "Yes",
    celebInspoLink: "https://example.com/celeb-look",
    weddingDate: todayPlusDays(120),
    attireTimeline: "3–6 months",
    dresscode: "Yes",
    drescodeOther: "",
    coordinateParty: "Yes",
    culturalRequirements: "Yes",
    culturalDetails: "Aso oke for the traditional engagement",
    hasSymbols: "No",
    symbolImages: "",
    fittingsCount: ["3"],
    additionalDetails: "This is test data entered by an admin for QA purposes.",
    confirmAccurate: true,
    confirmTimeline: true,
    confirmFees: true,
  };
}

export function mockOccasionData() {
  const suffix = randomSuffix();
  return {
    fullName: `Test Client ${suffix}`,
    email: `test.client.${suffix.toLowerCase()}@example.com`,
    phone: "+2348012345678",
    contactMethod: "WhatsApp",
    stylingTypes: ["Event styling", "Photoshoot/Editorial"],
    stylingTypesOther: "",
    eventDate: todayPlusDays(45),
    eventLocation: "Lagos, Landmark Event Centre",
    duration: "One day",
    stylingStart: "As soon as possible",
    dateConfirmed: "Yes",
    numberOfLooks: "3 looks",
    onDayStyling: "Yes",
    outfitChanges: "2 changes",
    personalStyle: "Bold, structured, statement pieces",
    designerRefs: "Test reference designers",
    avoidStyles: "No sequins",
    comfortableFees: "Yes",
    pricingExpectations: "Open to discussion",
    workStyle: "Collaborative",
    creativeImportance: "Very important",
    communicationStyle: "WhatsApp preferred",
    collaborators: ["Makeup artist", "Photographer"],
    otherDetails: "This is test data entered by an admin for QA purposes.",
    confirmTimeline: true,
    confirmRushFees: true,
    confirmFees: true,
  };
}

export function mockTravelData() {
  const suffix = randomSuffix();
  return {
    fullName: `Test Traveller ${suffix}`,
    email: `test.traveller.${suffix.toLowerCase()}@example.com`,
    phone: "+2348012345678",
    destinations: "Dubai, UAE",
    travelDates: todayPlusDays(60),
    travelDateReturn: todayPlusDays(67),
    lengthOfStay: "7 days",
    tripNature: ["Leisure", "Celebration"],
    tripNatureOther: "",
    plannedActivities: "Dinners, desert safari, brunches (test data)",
    numberOfLooks: "5 looks",
    inPersonStyling: "No",
    personalStyle: "Resort chic, relaxed elegance",
    avoidStyles: "No neon colours",
    designerRefs: "Test reference designers",
    comfortableFees: "Yes",
    stylistWorkStyle: "Remote styling with video calls",
    acknowledge: true,
  };
}
