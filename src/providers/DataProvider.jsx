import { createContext, useContext, useEffect, useState } from "react";
import { getLooks, getPricing, getSettings, getGallery, addGalleryItem, removeGalleryItem } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  LOOKS as STATIC_LOOKS,
  CATEGORIES as STATIC_CATEGORIES,
  BRIDAL,
  OCCASION,
  TRAVEL,
  HERO_IMGS,
  HERO_LABELS,
  SITE_IMAGES,
  PLACEHOLDER_MEDIA,
} from "@/data";

const DataContext = createContext(null);

const GALLERY_TYPES = ["image/png","image/jpeg","image/jpg","image/gif","image/webp","video/mp4","video/quicktime"];

const DEFAULT_ATELIER = {
  quote1: "\u201cIyawoooo, Oko Iyawoooo!",
  quote2: "S\u00e9 d\u00e1ad\u00e1a l\u00e8 w\u00e0?\u201d",
  body1: "I am Fiponmileoluwa — Fifii, for most. Creative director of ABÁNÍTÚRASE. Lawyer by training, stylist by calling. Mostly stylist, actually.",
  body2: "Whether you are a bride stepping into ceremony, a guest arriving at owambe, or someone travelling somewhere beautiful wanting to look exactly right — this house is for you. We dress with intention, We dress well.",
  sigName: "Fiponmileoluwa",
  sigRole: "Creative Director",
  estYear: "2024",
};

const DEFAULT_RATES = {
  note: "All prices NGN\nNon-deductible consultation",
  consultations: [
    { label: "General Consultation", note: "One-on-one styling session", price: "₦100,000" },
    { label: "Couple's Consultation", note: "Joint styling & alignment session", price: "₦150,000" },
  ],
};

const DEFAULT_LOOKBOOK = {
  heading: "Selected Works",
  season: "SS 2026",
  sub: "Bridal · Occasion · Travel\nLagos · Ibadan · Abroad",
};

const DEFAULT_CTA = {
  heading: "Ready to make an entrance?",
  sub: "Let’s create something unforgettable together.\nBook a consultation or reach out.",
  btn: "Get Started →",
  contactHeading: "Let’s dress\nyou with\nintention.",
  contactBody: "Reach out to start a conversation about your day, your event, your trip — and what it should feel like to walk in.",
};

const DEFAULT_FOOTER = {
  tagline: "Dressed with\nintention.",
  brandSub: "Lagos Styling House",
  location: "Lagos, Nigeria",
  locationSub: "Available for travel worldwide",
  instagramUrl: "https://instagram.com/Abanitunrase",
  instagramHandle: "@Abanitunrase",
  whatsappUrl: "https://wa.me/2348126286593",
  whatsappNumber: "+234 812 628 6593",
  email: "Officialabanitunrase@gmail.com",
  copyrightYear: "2026",
  estYear: "2026",
};

export function DataProvider({ children }) {
  const [looks, setLooks] = useState(STATIC_LOOKS);
  const [pricing, setPricing] = useState({ bridal: BRIDAL, occasion: OCCASION, travel: TRAVEL });
  const [settings, setSettings] = useState({});
  const [galleryItems, setGalleryItems] = useState([...PLACEHOLDER_MEDIA]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [looksData, pricingData, settingsData, galleryData] = await Promise.all([
        getLooks(),
        getPricing(),
        getSettings(),
        getGallery(),
      ]);

      if (looksData.length > 0) setLooks(looksData);

      setPricing({
        bridal: pricingData.bridal?.length ? pricingData.bridal : BRIDAL,
        occasion: pricingData.occasion?.length ? pricingData.occasion : OCCASION,
        travel: pricingData.travel?.length ? pricingData.travel : TRAVEL,
      });

      if (Object.keys(settingsData).length > 0) setSettings(settingsData);
      if (galleryData.length > 0) setGalleryItems(galleryData);
    } catch {
      // keep static defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── Gallery CMS ─────────────────────────────────────── */
  const addGallery = async (files) => {
    const valid = Array.from(files).filter(f => GALLERY_TYPES.includes(f.type));
    if (!valid.length) return;
    setGalleryUploading(true);
    for (const file of valid) {
      const blobUrl = URL.createObjectURL(file);
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const placeholder = { id: tempId, url: blobUrl, type: file.type.startsWith("video") ? "video" : "image", name: file.name, uploading: true };
      setGalleryItems(prev => [...prev, placeholder]);
      try {
        const url = await uploadToCloudinary(file);
        const item = { url, type: placeholder.type, name: file.name };
        const savedId = await addGalleryItem(item).catch(() => tempId);
        URL.revokeObjectURL(blobUrl);
        setGalleryItems(prev => prev.map(i => i.id === tempId ? { ...item, id: savedId } : i));
      } catch {
        URL.revokeObjectURL(blobUrl);
        setGalleryItems(prev => prev.filter(i => i.id !== tempId));
      }
    }
    setGalleryUploading(false);
  };

  const removeGallery = async (idx) => {
    const item = galleryItems[idx];
    if (item?.id && !item.id.startsWith("temp-")) {
      await removeGalleryItem(item.id).catch(() => {});
    }
    setGalleryItems(prev => prev.filter((_, i) => i !== idx));
  };

  const clearGallery = async () => {
    for (const item of galleryItems) {
      if (item?.id && !item.id.startsWith("temp-")) {
        await removeGalleryItem(item.id).catch(() => {});
      }
    }
    setGalleryItems([]);
  };

  /* ── Derived values ─────────────────────────────────── */
  const categories = settings.categories?.items ?? STATIC_CATEGORIES;
  const ctaBackground = settings.site?.ctaBackground ?? SITE_IMAGES.ctaBackground;
  const contactBackground = settings.site?.contactBackground ?? SITE_IMAGES.contactBackground;
  const showcased = [0, 1, 2].map((catIdx) => looks.find((l) => l.catIdx === catIdx)).filter(Boolean);

  const storedHeroImages = settings.hero?.images?.filter(i => i.url);
  const heroItems = storedHeroImages?.length > 0
    ? storedHeroImages
    : HERO_IMGS.map((url, i) => ({
        url,
        label: HERO_LABELS[i] ?? "",
        type: [0, 3].includes(i) ? "bridal" : [1, 4].includes(i) ? "occasion" : "travel",
      }));

  const atelier = { ...DEFAULT_ATELIER, ...(settings.atelier ?? {}) };
  const ctaData = { ...DEFAULT_CTA, ...(settings.site ?? {}) };
  const footerData = { ...DEFAULT_FOOTER, ...(settings.footer ?? {}) };
  const ratesData = {
    ...DEFAULT_RATES,
    ...(settings.rates ?? {}),
    consultations: settings.rates?.consultations ?? DEFAULT_RATES.consultations,
  };
  const lookbookData = { ...DEFAULT_LOOKBOOK, ...(settings.lookbook ?? {}) };

  return (
    <DataContext.Provider
      value={{
        looks,
        pricing,
        settings,
        loading,
        refetch: fetchAll,
        categories,
        heroItems,
        bridal: pricing.bridal,
        occasion: pricing.occasion,
        travel: pricing.travel,
        ctaBackground,
        contactBackground,
        showcased,
        atelier,
        ctaData,
        footerData,
        ratesData,
        lookbookData,
        galleryItems,
        galleryUploading,
        addGallery,
        removeGallery,
        clearGallery,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
