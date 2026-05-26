import { createContext, useContext, useEffect, useState } from "react";
import { getLooks, getPricing, getSettings, getGallery, addGalleryItem, removeGalleryItem } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { SITE_IMAGES } from "@/data";

const DataContext = createContext(null);

const GALLERY_TYPES = ["image/png","image/jpeg","image/jpg","image/gif","image/webp","video/mp4","video/quicktime"];

const DEFAULT_ATELIER = {
  quote1: "",
  quote2: "",
  body1: "",
  body2: "",
  sigName: "",
  sigRole: "",
  estYear: "",
  specializations: [],
  sectionLabel: "",
};

const DEFAULT_BRIDAL = [
  { package: "Aso Àsìkò",  tier: "IV",   includes: ["Engagement", "White Wedding"],                                             price: 2500000 },
  { package: "Aso Ìgbáfè", tier: "V",    includes: ["Engagement", "White Wedding", "After Party"],                              price: 3000000, featured: true },
  { package: "Aso Ojúdé",  tier: "VII",  includes: ["Pre-Wedding", "Engagement", "White Wedding", "After Party"],               price: 4000000 },
  { package: "Aso Àrìyá",  tier: "VIII", includes: ["Pre-Wedding", "Civil Wedding", "Engagement", "White Wedding", "After Party"], price: 4800000 },
];

const DEFAULT_OCCASION = [
  { package: "Káseré Jáde",   tier: "I",   includes: ["Party guest", "Special outing", "One look"],                        price: 300000 },
  { package: "Káyáworán",     tier: "II",  includes: ["Birthday", "Corporate", "Head-shot", "One look"],                   price: 500000, featured: true },
  { package: "Káànkò",        tier: "III", includes: ["Family photoshoot up to 3 people", "One look"],                     price: 1000000 },
  { package: "Kábosagbo",     tier: "IV",  includes: ["Red carpet", "Premieres", "Themed events"],                         price: 1000000 },
];

const DEFAULT_TRAVEL = [
  { package: "The Weekend Escape",   looks: 3, price: 500000 },
  { package: "The Mid-Week Venture", looks: 4, price: 700000 },
  { package: "The Grand Tour",       looks: 5, price: 900000, featured: true },
  { package: "The Elite Collection", looks: 6, price: 1000000 },
];

const DEFAULT_RATES = {
  heading: "",
  sectionLabel: "",
  note: "",
  consultations: [],
  extrasVisibleOnTabs: ["bridal"],
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
};

const DEFAULT_HERO_META = {
  tagline: "",
  subTagline: "",
};

const DEFAULT_CATEGORIES_HDR = {
  sectionLabel: "",
  heading: "",
  sub: "",
};

const DEFAULT_BEFORE = {
  sectionLabel: "",
  heading: "",
  sub: "",
  faqs: [],
};

const DEFAULT_LOOKBOOK = {
  heading: "",
  season: "",
  sub: "",
  items: [],
};

const DEFAULT_CTA = {
  heading: "",
  sub: "",
  btn: "",
  contactHeading: "",
  contactBody: "",
};

const DEFAULT_GALLERY = {
  heading: "",
  sub: "",
  tagline: "",
};

const DEFAULT_FOOTER = {
  tagline: "",
  location: "",
  locationSub: "",
  instagramUrl: "",
  instagramHandle: "",
  whatsappUrl: "",
  whatsappNumber: "",
  email: "",
  copyrightYear: "",
  estYear: "",
};

export function DataProvider({ children }) {
  const [looks, setLooks] = useState([]);
  const [pricing, setPricing] = useState({ bridal: [], occasion: [], travel: [] });
  const [settings, setSettings] = useState({});
  const [galleryItems, setGalleryItems] = useState([]);
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
        bridal:  pricingData.bridal?.length  ? pricingData.bridal  : DEFAULT_BRIDAL,
        occasion: pricingData.occasion?.length ? pricingData.occasion : DEFAULT_OCCASION,
        travel:  pricingData.travel?.length  ? pricingData.travel  : DEFAULT_TRAVEL,
      });

      if (Object.keys(settingsData).length > 0) setSettings(settingsData);
      if (galleryData.length > 0) setGalleryItems(galleryData);
    } catch {
      // keep empty defaults
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
  const categories = settings.categories?.items ?? [];
  const ctaBackground = settings.site?.ctaBackground ?? SITE_IMAGES.ctaBackground;
  const contactBackground = settings.site?.contactBackground ?? SITE_IMAGES.contactBackground;
  const showcased = [0, 1, 2].map((catIdx) => looks.find((l) => l.catIdx === catIdx)).filter(Boolean);

  const storedHeroImages = settings.hero?.images?.filter(i => i.url);
  const heroItems = storedHeroImages?.length > 0 ? storedHeroImages : [];

  const atelier = { ...DEFAULT_ATELIER, ...(settings.atelier ?? {}) };
  const ctaData = { ...DEFAULT_CTA, ...(settings.site ?? {}) };
  const introVideo = settings.site?.introVideo ?? "";
  const archiveData = { ...DEFAULT_GALLERY, ...(settings.gallery ?? {}) };
  const footerData = { ...DEFAULT_FOOTER, ...(settings.footer ?? {}) };
  const ratesData = {
    ...DEFAULT_RATES,
    ...(settings.rates ?? {}),
    consultations: settings.rates?.consultations ?? [],
    extrasVisibleOnTabs: settings.rates?.extrasVisibleOnTabs ?? ["bridal"],
    singlePackages: settings.rates?.singlePackages ?? DEFAULT_RATES.singlePackages,
    otherPackages:  settings.rates?.otherPackages  ?? DEFAULT_RATES.otherPackages,
  };
  const lookbookData = {
    ...DEFAULT_LOOKBOOK,
    ...(settings.lookbook ?? {}),
    items: settings.lookbook?.items ?? [],
  };
  const heroMeta = { ...DEFAULT_HERO_META, ...(settings.heroMeta ?? {}) };
  const categoriesHdr = { ...DEFAULT_CATEGORIES_HDR, ...(settings.categoriesHdr ?? {}) };
  const beforeData = { ...DEFAULT_BEFORE, ...(settings.before ?? {}), faqs: settings.before?.faqs ?? [] };

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
