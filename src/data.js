/* ══════════════════════════════════════════════════════════════════════════════════════════
   SITE IMAGES — change any URL here to update the image across the whole site.
   All background/section images live in this one object.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const SITE_IMAGES = {
  // ── Hero section ──────────────────────────────────────────────────────────────────────
  // The scrolling photo grid. Each index maps to a HERO_LABELS entry below.
  // hero[0] → "The Civil Vow"   hero[1] → "The Owambe Arrival"  hero[2] → "The Weekend Escape"
  // hero[3] → "Aso Òkè Re-Read" hero[4] → "Kábosagbo"           hero[5] → "The Medina Edit"
  // (these are the same as HERO_IMGS — edit HERO_IMGS array below)

  // ── Contact / CTA section ─────────────────────────────────────────────────────────────
  ctaBackground:
    "https://res.cloudinary.com/drxxei318/image/upload/v1778719175/SaveClip.App_610684634_17922046056254973_1437657401458868204_n_n0js2z.jpg",
  contactBackground:
    "https://res.cloudinary.com/drxxei318/image/upload/v1778719606/SaveClip.App_670450798_17938323207254973_1615245445868749339_n_qrnzqg.jpg",
};

/* ══════════════════════════════════════════ DATA ══════════════════════════════════════════ */
export const LOOKS = [
  {
    id: "bridal-01",
    cat: "Bridal",
    catIdx: 0,
    title: "The Civil Vow",
    sub: "Court Wedding · Lagos",
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719605/sacs_qjgejf.jpg",
    thumbs: [
      "/sacss.jpg",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
      "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400&q=70",
    ],
    video:
      "https://res.cloudinary.com/drxxei318/video/upload/v1778719183/savess_otu5lm.mp4",
    story:
      "She walked in wearing her grandmother's coral beads and a conviction that simplicity was its own kind of luxury. We built the look around that energy — letting the fabric breathe, the silhouette stand, the woman lead.\n\nIvory brocade from Balogun market sourced at 7am. The vendor almost didn't open for us. Three bolts inspected. One chosen. That bolt became the dress.\n\nThree shoes tried. Two discarded. One pair — cream satin kitten heels — that made the whole look land perfectly. The magistrate's courtroom had never seen anything like it. Neither had we.",
  },
  {
    id: "bridal-02",
    cat: "Bridal",
    catIdx: 0,
    title: "The White Wedding",
    sub: "Church Ceremony · Victoria Island",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    thumbs: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=70",
      "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400&q=70",
    ],
    video: "",
    story:
      "The brief was simple: make her float. Six fittings, two fabric changes, one very patient bride, and one perfectionist director who counts seams.\n\nThe gown was structured where she needed support and soft where she needed to breathe. Cathedral train, custom aso-oke headpiece. She cried at the final fitting. We all did.\n\nWhen she walked down the aisle, the congregation forgot the hymn they were singing. She arrived — and the room remembered why they came.",
  },
  {
    id: "bridal-03",
    cat: "Bridal",
    catIdx: 0,
    title: "The Engagement Day",
    sub: "Traditional Ceremony · Ikoyi",
    img: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&q=85",
    thumbs: [
      "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400&q=70",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=70",
    ],
    video: "",
    story:
      "Traditional wear is its own language. Every bead, every fold, every colour carries meaning. We translated the family's story into a look that honoured history without being swallowed by it.\n\nAso-oke in gold and ivory. Gele tied with precision by hands that have tied a thousand before. Coral beads — real ones — borrowed from a grandmother who smiled when she placed them around her granddaughter's neck.\n\nThe photographs became a family heirloom before the ink dried.",
  },
  {
    id: "occasion-01",
    cat: "Occasion",
    catIdx: 1,
    title: "The Owambe Arrival",
    sub: "Party Guest · Lekki",
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719175/SaveClip.App_658322783_17934033228254973_2161621233586694312_n_lm6t64.jpg",
    thumbs: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=70",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=70",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=70",
    ],
    video: "",
    story:
      "The client said: 'I want everyone to turn and look.' We took that very seriously. The brief was not modest. The budget was not modest. The result was not modest.\n\nAnkara with architectural structure. A silhouette that moved without apology. A wide-brimmed hat at an angle the hat itself seemed unsure about — it worked.\n\nShe arrived forty minutes late. The room waited. It was worth it. The DJ paused — not on cue, just instinctively. The floor cleared without a word. Three hundred guests. Zero who didn't notice. Six bookings followed that single entrance.",
  },
  {
    id: "occasion-02",
    cat: "Occasion",
    catIdx: 1,
    title: "The Birthday Editorial",
    sub: "40th Birthday · Banana Island",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85",
    thumbs: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=70",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=70",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=70",
    ],
    video: "",
    story:
      "Forty should not look like forty is apologising for itself. We dressed her like the decade she had earned — the kind of look that says 'I know exactly who I am now.'\n\nDeep forest green, structured shoulders, hand-embroidered hem. Shoes that added four centimetres and a decade of confidence. Accessories minimal because the woman was the statement.\n\nThe birthday entrance became the most shared moment of the year on Lagos social media. She called us from the car at midnight just to say thank you.",
  },
  {
    id: "occasion-03",
    cat: "Occasion",
    catIdx: 1,
    title: "The Red Carpet",
    sub: "Film Premiere · Eko Hotel",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=85",
    thumbs: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=70",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=70",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=70",
    ],
    video: "",
    story:
      "Red carpets are unforgiving — every angle is someone's lens. You need a look that holds from twenty metres and rewards on closer inspection. We engineered both.\n\nCustom Lagos-made gown with hand-cut Adire panels. Something old, something new, something unapologetically Yoruba on an international stage.\n\nThe fashion editors called. The magazines followed. The client wore Lagos like a crown that night.",
  },
  {
    id: "travel-01",
    cat: "Travel",
    catIdx: 2,
    title: "The Weekend Escape",
    sub: "Cape Town · 48 Hours",
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719179/SaveClip.App_696190760_17942426766254973_6528501205889293125_n_htzssr.jpg",
    thumbs: [
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
    ],
    video: "",
    story:
      "Cape Town in forty-eight hours demands a wardrobe that transitions across wind, sun, fine dining, and exploration without missing a beat. Three complete looks. One carry-on. Zero compromises.\n\nPolaroid notes told her where to wear what. She sent pictures from Boulders Beach wearing look two. She cried at the penguins. The coat survived.\n\nShe called it the best-dressed trip she'd ever taken. Three different Instagram captions. None of them mentioned the clothes — which meant the clothes were doing exactly what they should.",
  },
  {
    id: "travel-02",
    cat: "Travel",
    catIdx: 2,
    title: "The Grand Tour",
    sub: "Paris · Milan · 7 Days",
    img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=85",
    thumbs: [
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
      "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_698324782_17942426784254973_429270856261881943_n_e1xw4h.jpg",
    ],
    video: "",
    story:
      "Paris and Milan in one trip is not a wardrobe challenge — it is a philosophy question. Which version of yourself walks into which room?\n\nFive complete looks. Day-to-evening transitions. Fabrics that don't crease in overhead lockers. Colours that work under European grey skies and Italian piazza light equally well.\n\nShe wore Lagos to Paris and Paris recognised it. Three street style photographers in two days. One compliment from a Milanese woman outside the Galleria — the highest honour.",
  },
  {
    id: "travel-03",
    cat: "Travel",
    catIdx: 2,
    title: "The Business Trip",
    sub: "London · 4 Days",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85",
    thumbs: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=70",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=70",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=70",
    ],
    video: "",
    story:
      "Business travel has its own uniform — and it does not have to be boring. Four days in London: boardrooms, client dinners, a gallery opening, and a morning walk along the Thames.\n\nFour looks. Two shoes. One bag. The Polaroid guide mapped each look to each day with weather notes and transport guidance.\n\nShe closed the deal. She credited the confidence of walking into every room looking exactly right.",
  },
];

export const CATEGORIES = [
  {
    title: "The Bridal Suite",
    yoruba: "Ìyàwó & Oko Ìyàwó",
    looks: 6,
    desc: "From court vows to white wedding to the after-party — every chapter dressed with intention.",
    catIdx: 0,
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719607/SaveClip.App_671815005_17938323222254973_1577166702377390262_n_djxyid.jpg",
    type: "bridal",
  },
  {
    title: "Occasion Styling",
    yoruba: "Ìgbà Ayẹyẹ",
    looks: 5,
    desc: "Birthdays, red carpets, family portraits, headshots — the party where everyone will be looking.",
    catIdx: 1,
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719175/SaveClip.App_658322783_17934033228254973_2161621233586694312_n_lm6t64.jpg",
    type: "occasion",
  },
  {
    title: "Kájáyelo",
    yoruba: "The Travel Styling Experience",
    looks: 4,
    desc: "Destination-based wardrobe curation with a physical Polaroid Guide to your trip.",
    catIdx: 2,
    img: "https://res.cloudinary.com/drxxei318/image/upload/v1778719179/SaveClip.App_696190760_17942426766254973_6528501205889293125_n_htzssr.jpg",
    type: "travel",
  },
];
export const BRIDAL = [
  {
    package: "Aso Àsìkò",
    tier: "IV",
    includes: ["Engagement", "White Wedding"],
    price: 2500000,
  },
  {
    package: "Aso Ìgbáfé",
    tier: "V",
    includes: ["Engagement", "White Wedding", "After Party"],
    price: 3000000,
    featured: true,
  },
  {
    package: "Aso Ojúdé",
    tier: "VII",
    includes: ["Pre-Wedding", "Engagement", "White", "After Party"],
    price: 4000000,
  },
  {
    package: "Aso Àrìyá",
    tier: "VIII",
    includes: ["Pre-Wedding", "Civil", "Engagement", "White", "After Party"],
    price: 4800000,
  },
];

export const OCCASION = [
  {
    package: "Káseré Jáde",
    tier: "I",
    includes: ["Party guest", "Special outing", "One look"],
    price: 300000,
  },
  {
    package: "Káyáworán",
    tier: "II",
    includes: ["Birthday", "Corporate", "Head-shot", "One look"],
    price: 500000,
    featured: true,
  },
  {
    package: "Káànkò",
    tier: "III",
    includes: ["Family photoshoot up to 3 people", "One look"],
    price: 1000000,
  },
  {
    package: "Kábosagbo",
    tier: "IV",
    includes: ["Red carpet", "Premieres", "Themed events"],
    price: 1000000,
  },
];

export const TRAVEL = [
  { package: "The Weekend Escape", looks: 3, price: 500000 },
  { package: "The Mid-Week Venture", looks: 4, price: 700000 },
  { package: "The Grand Tour", looks: 5, price: 900000, featured: true },
  { package: "The Elite Collection", looks: 6, price: 1000000 },
];

export const HERO_IMGS = [
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719179/SaveClip.App_652667926_17932293741254973_3034476260271536204_n_blzu4k.jpg",
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719176/SaveClip.App_619847706_17924066265254973_6011093925036108101_n_jb6jhs.jpg",
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719175/SaveClip.App_610542057_17922046083254973_5056702369870090432_n_e9dy1b.jpg",
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719174/SaveClip.App_580117496_17915023974254973_3257437589190981354_n_ri1bkt.jpg",
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719174/SaveClip.App_657232149_17934033264254973_4508186931635539950_n_pw0voh.jpg",
  "https://res.cloudinary.com/drxxei318/image/upload/v1778719660/idss_hy3jni.jpg",
];

export const HERO_LABELS = [
  "The Civil Vow",
  "The Owambe Arrival",
  "The Weekend Escape",
  "Aso Òkè Re-Read",
  "Kábosagbo",
  "The Medina Edit",
];
export const HERO_ROWS = [
  [0, 1, 2, 3, 4, 5],
  [3, 4, 5, 0, 1, 2],
  [1, 3, 5, 0, 2, 4],
];
export const HERO_DIRS = ["left", "right", "left"];

export const INTRO_STEPS = 4;
export const INTRO_TRIGGER = 300;

export const SHOWCASED = [
  LOOKS.find((l) => l.catIdx === 0),
  LOOKS.find((l) => l.catIdx === 1),
  LOOKS.find((l) => l.catIdx === 2),
];

export const PLACEHOLDER_MEDIA = [
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719176/SaveClip.App_619847706_17924066265254973_6011093925036108101_n_jb6jhs.jpg",
    type: "image",
    name: "Bridal · The Civil Vow",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719178/SaveClip.App_652215321_17932293732254973_818466804076617359_n_cwy3wz.jpg",
    type: "image",
    name: "Occasion · The Owambe",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719175/SaveClip.App_581728772_17915023998254973_3584508943266208942_n_cmf8uh.jpg",
    type: "image",
    name: "Occasion · The Birthday",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719659/gbossss_pffqxe.jpg",
    type: "image",
    name: "Travel · Cape Town",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719177/SaveClip.App_650378442_17932293585254973_6061943292395755391_n_gfapeu.jpg",
    type: "image",
    name: "Travel · The Grand Tour",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719607/SaveClip.App_670622992_17938323186254973_2923354159709154336_n_kdbrn2.jpg",
    type: "image",
    name: "Bridal · The White Wedding",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719176/SaveClip.App_670056046_17937929682254973_115841610841833887_n_pv0av8.jpg",
    type: "image",
    name: "Bridal · Engagement",
  },
  {
    url: "https://res.cloudinary.com/drxxei318/image/upload/v1778719660/idsss_zj4gkx.jpg",
    type: "image",
    name: "Occasion · Red Carpet",
  },
];

export const fmt = (n) => "₦" + n.toLocaleString("en-NG");

export function ytEmbedUrl(url) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/|vimeo\.com\/)([a-zA-Z0-9_-]{5,15})/);
  if (!m) return url;
  if (url.includes("vimeo"))
    return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1";
  return "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1";
}
