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
  bgVideo: "/savessss.mp4",
  specializations: ["Bridal Styling", "Occasion Styling", "Travel — Kájáyelo"],
  sectionLabel: "A Note from the Styling House",
};

const DEFAULT_RATES = {
  heading: "The Rates.",
  sectionLabel: "Investment",
  note: "All prices NGN\nNon-deductible consultation",
  consultations: [
    { label: "General Consultation", note: "One-on-one styling session", price: "₦100,000" },
    { label: "Couple's Consultation", note: "Joint styling & alignment session", price: "₦150,000" },
  ],
};

const DEFAULT_HERO_META = {
  tagline: "Lagos Styling House",
  subTagline: "Bridal · Occasion · Travel",
};

const DEFAULT_CATEGORIES_HDR = {
  sectionLabel: "What We Do",
  heading: "Three ways\nto dress well.",
  sub: "Browse stories by category\nor click See Rates to explore pricing",
};

const DEFAULT_BEFORE = {
  sectionLabel: "Before You Book",
  heading: "Good to know.",
  sub: "Questions we get asked\nbefore every booking",
  faqs: [
    {
      q: "How far in advance should I book?",
      a: "For bridal packages, we recommend booking at least 3–4 months before your first ceremony. For occasion styling, 3–6 weeks is ideal. For travel styling (Kájáyelo), we require a minimum of 2 weeks notice. Slots fill quickly — especially for Lagos owambe season.",
    },
    {
      q: "Are the prices negotiable?",
      a: "Our prices reflect the work, time, research, and relationships that go into every look. They are not negotiable. What we do offer is transparency — you know exactly what you are paying for, and we do not charge for extras that were always going to be part of the job.",
    },
    {
      q: "Do you work outside Lagos?",
      a: "Yes. We work in Lagos, Ibadan, Abuja, and abroad. Travel styling packages (Kájáyelo) are specifically designed for international trips. For local travel beyond Lagos, logistics are discussed during consultation.",
    },
  ],
};

const DEFAULT_LOOKBOOK = {
  heading: "Selected Works",
  season: "SS 2026",
  sub: "Bridal · Occasion · Travel\nLagos · Ibadan · Abroad",
  items: [
    { title: "Look 01", img: "/id.jpg", cat: "Bridal", catIdx: 0, sub: null },
    { title: "Look 02", img: "/id.jpg", cat: "Occasion", catIdx: 1, sub: null },
    { title: "Look 03", img: "/id.jpg", cat: "Travel", catIdx: 2, sub: null },
  ],
};

const DEFAULT_CTA = {
  heading: "Ready to make an entrance?",
  sub: "Let's create something unforgettable together.\nBook a consultation or reach out.",
  btn: "Get Started →",
  contactHeading: "Let's dress\nyou with\nintention.",
  contactBody: "Reach out to start a conversation about your day, your event, your trip — and what it should feel like to walk in.",
  introVideo: "/savessss.mp4",
};

const DEFAULT_GALLERY = {
  heading: "Work & Process.",
  sub: "Moments from the styling house — fittings, arrivals, and the quiet work between.",
  tagline: "The Archive",
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
  const [uploadProgress, setUploadProgress] = useState({});
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
  const setProgress = (tempId, pct) =>
    setUploadProgress(prev => ({ ...prev, [tempId]: pct }));
  const clearProgress = (tempId) =>
    setUploadProgress(prev => { const n = { ...prev }; delete n[tempId]; return n; });

  const addGallery = async (files) => {
    const valid = Array.from(files).filter(f => GALLERY_TYPES.includes(f.type));
    if (!valid.length) return { success: 0, failed: 0 };
    setGalleryUploading(true);
    let success = 0, failed = 0;
    for (const file of valid) {
      const blobUrl = URL.createObjectURL(file);
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const type = file.type.startsWith("video") ? "video" : "image";
      setGalleryItems(prev => [...prev, { id: tempId, url: blobUrl, type, name: file.name, uploading: true }]);
      setProgress(tempId, 0);
      try {
        const url = await uploadToCloudinary(file, pct => setProgress(tempId, pct));
        const item = { url, type, name: file.name };
        const savedId = await addGalleryItem(item);
        URL.revokeObjectURL(blobUrl);
        setGalleryItems(prev => prev.map(i => i.id === tempId ? { ...item, id: savedId } : i));
        success++;
      } catch {
        URL.revokeObjectURL(blobUrl);
        setGalleryItems(prev => prev.filter(i => i.id !== tempId));
        failed++;
      } finally {
        clearProgress(tempId);
      }
    }
    setGalleryUploading(false);
    return { success, failed };
  };

  const replaceGalleryItem = async (idx, file) => {
    const old = galleryItems[idx];
    if (!old) return { success: false };
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const blobUrl = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    setGalleryItems(prev => prev.map((item, i) =>
      i === idx ? { id: tempId, url: blobUrl, type, name: file.name, uploading: true } : item
    ));
    setProgress(tempId, 0);
    try {
      const url = await uploadToCloudinary(file, pct => setProgress(tempId, pct));
      const newItem = { url, type, name: file.name };
      const savedId = await addGalleryItem(newItem);
      URL.revokeObjectURL(blobUrl);
      if (old?.id && !old.id.startsWith("temp-")) {
        await removeGalleryItem(old.id).catch(() => {});
      }
      setGalleryItems(prev => prev.map(item =>
        item.id === tempId ? { ...newItem, id: savedId } : item
      ));
      return { success: true };
    } catch (err) {
      URL.revokeObjectURL(blobUrl);
      setGalleryItems(prev => prev.map(item => item.id === tempId ? old : item));
      return { success: false, error: err.message };
    } finally {
      clearProgress(tempId);
    }
  };

  const addGalleryByUrl = async (url, type = "image") => {
    if (!url) return;
    const item = { url, type, name: url.split("/").pop() };
    const savedId = await addGalleryItem(item).catch(() => `url-${Date.now()}`);
    setGalleryItems(prev => [...prev, { ...item, id: savedId }]);
  };

  const removeGallery = async (idx) => {
    const item = galleryItems[idx];
    if (item?.id && !item.id.startsWith("temp-")) {
      await removeGalleryItem(item.id);
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
  const introVideo = settings.site?.introVideo ?? DEFAULT_CTA.introVideo;
  const archiveData = { ...DEFAULT_GALLERY, ...(settings.gallery ?? {}) };
  const footerData = { ...DEFAULT_FOOTER, ...(settings.footer ?? {}) };
  const ratesData = {
    ...DEFAULT_RATES,
    ...(settings.rates ?? {}),
    consultations: settings.rates?.consultations ?? DEFAULT_RATES.consultations,
  };
  const lookbookData = {
    ...DEFAULT_LOOKBOOK,
    ...(settings.lookbook ?? {}),
    items: settings.lookbook?.items ?? DEFAULT_LOOKBOOK.items,
  };
  const heroMeta = { ...DEFAULT_HERO_META, ...(settings.heroMeta ?? {}) };
  const categoriesHdr = { ...DEFAULT_CATEGORIES_HDR, ...(settings.categoriesHdr ?? {}) };
  const beforeData = { ...DEFAULT_BEFORE, ...(settings.before ?? {}), faqs: settings.before?.faqs ?? DEFAULT_BEFORE.faqs };

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
        introVideo,
        archiveData,
        footerData,
        ratesData,
        lookbookData,
        heroMeta,
        categoriesHdr,
        beforeData,
        galleryItems,
        galleryUploading,
        uploadProgress,
        addGallery,
        addGalleryByUrl,
        replaceGalleryItem,
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
