import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "ABÁNÍTÚNRASE";
const SITE_URL = "https://abanitunrase.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

const DEFAULT_DESCRIPTION =
  "ABÁNÍTÚNRASE is a Lagos styling house for bridal styling, occasion looks, and Kájáyelo travel wardrobe curation. Dressed with intention.";

const STYLING_META = {
  bridal: {
    title: "Bridal Styling Lagos | ABÁNÍTÚNRASE",
    description:
      "Expert bridal styling for traditional ceremonies, court weddings, white weddings, and full wedding wardrobes in Lagos and beyond. Book your bridal consultation.",
    keywords: "bridal styling Lagos, aso-oke styling, Nigerian wedding stylist, traditional wedding styling, Iyawo styling",
  },
  occasion: {
    title: "Occasion Styling Lagos | ABÁNÍTÚNRASE",
    description:
      "Occasion styling for owambe, birthdays, corporate events, portraits, and standout Lagos entrances. Look your best every time.",
    keywords: "occasion stylist Lagos, owambe styling, event styling Nigeria, birthday outfit styling Lagos",
  },
  travel: {
    title: "Kájáyelo Travel Styling | ABÁNÍTÚNRASE",
    description:
      "Travel wardrobe curation for destination trips and holidays. Kájáyelo — because you should look exactly right wherever you land.",
    keywords: "travel wardrobe curation, destination styling, Kajayelo, travel stylist Lagos, vacation wardrobe Nigeria",
  },
};

const PAGE_META = {
  "/": {
    title: "ABÁNÍTÚNRASE | Lagos Styling House — Bridal, Occasion & Travel",
    description: DEFAULT_DESCRIPTION,
    keywords: "Lagos styling house, bridal stylist Nigeria, occasion stylist Lagos, travel wardrobe, ABÁNÍTÚNRASE, Fiponmileoluwa",
  },
  "/rates": {
    title: "Rates & Styling Packages | ABÁNÍTÚNRASE Lagos",
    description:
      "Explore ABÁNÍTÚNRASE bridal styling, occasion styling, Kájáyelo travel wardrobe, and consultation packages. Transparent pricing.",
    keywords: "stylist rates Lagos, bridal styling price Nigeria, occasion stylist cost, consultation fee stylist",
  },
  "/stories": {
    title: "Styling Stories | ABÁNÍTÚNRASE",
    description:
      "Explore ABÁNÍTÚNRASE styling stories across bridal, occasion, and travel wardrobes. Looks built with intention.",
    keywords: "styling lookbook Lagos, bridal looks Nigeria, occasion looks, travel outfits Africa",
  },
};

const BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  areaServed: ["Lagos", "Ibadan", "Abuja", "International"],
  serviceType: ["Bridal Styling", "Occasion Styling", "Travel Wardrobe Curation"],
  sameAs: ["https://instagram.com/Abanitunrase"],
};

function setMeta(selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }
  Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v));
}

function setLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function setJsonLd(data) {
  const id = "site-schema-ld";
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement("script");
    tag.id = id;
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

function pageMeta(pathname) {
  if (pathname.startsWith("/admin")) {
    return { title: "Admin | ABÁNÍTÚNRASE", description: "Admin area.", robots: "noindex,nofollow", keywords: "" };
  }
  if (pathname.startsWith("/styling/")) {
    const type = pathname.split("/")[2];
    return STYLING_META[type] ?? { title: `Styling | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, keywords: "" };
  }
  if (pathname.startsWith("/stories")) {
    return PAGE_META["/stories"];
  }
  return PAGE_META[pathname] ?? { title: `${SITE_NAME} | Lagos Styling House`, description: DEFAULT_DESCRIPTION, keywords: "" };
}

export default function SeoMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta(pathname);
    const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = meta.title;

    setMeta('meta[name="description"]', { name: "description", content: meta.description });
    setMeta('meta[name="keywords"]', { name: "keywords", content: meta.keywords ?? "" });
    setMeta('meta[name="robots"]', { name: "robots", content: meta.robots ?? "index,follow,max-image-preview:large" });

    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_IMAGE });
    setMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: `${SITE_NAME} — Lagos Styling House` });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_NG" });

    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:site"]', { name: "twitter:site", content: "@Abanitunrase" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_IMAGE });

    setLink("canonical", canonical);

    if (!pathname.startsWith("/admin")) setJsonLd(BUSINESS_SCHEMA);
  }, [pathname]);

  return null;
}
