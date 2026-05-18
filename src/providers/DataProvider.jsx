import { createContext, useContext, useEffect, useState } from "react";
import { getLooks, getPricing, getSettings } from "@/lib/firestore";
import {
  LOOKS as STATIC_LOOKS,
  CATEGORIES as STATIC_CATEGORIES,
  BRIDAL,
  OCCASION,
  TRAVEL,
  HERO_IMGS,
  HERO_LABELS,
  SITE_IMAGES,
} from "@/data";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [looks, setLooks] = useState(STATIC_LOOKS);
  const [pricing, setPricing] = useState({ bridal: BRIDAL, occasion: OCCASION, travel: TRAVEL });
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [looksData, pricingData, settingsData] = await Promise.all([
        getLooks(),
        getPricing(),
        getSettings(),
      ]);

      if (looksData.length > 0) setLooks(looksData);

      setPricing({
        bridal: pricingData.bridal?.length ? pricingData.bridal : BRIDAL,
        occasion: pricingData.occasion?.length ? pricingData.occasion : OCCASION,
        travel: pricingData.travel?.length ? pricingData.travel : TRAVEL,
      });

      if (Object.keys(settingsData).length > 0) setSettings(settingsData);
    } catch {
      // keep static defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const categories = settings.categories?.items ?? STATIC_CATEGORIES;
  const ctaBackground = settings.site?.ctaBackground ?? SITE_IMAGES.ctaBackground;
  const contactBackground = settings.site?.contactBackground ?? SITE_IMAGES.contactBackground;
  const showcased = [0, 1, 2]
    .map((catIdx) => looks.find((l) => l.catIdx === catIdx))
    .filter(Boolean);

  const storedHeroImages = settings.hero?.images?.filter(i => i.url);
  const heroItems = storedHeroImages?.length > 0
    ? storedHeroImages
    : HERO_IMGS.map((url, i) => ({
        url,
        label: HERO_LABELS[i] ?? "",
        type: [0, 3].includes(i) ? "bridal" : [1, 4].includes(i) ? "occasion" : "travel",
      }));

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
