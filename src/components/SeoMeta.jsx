import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "ABÁNÍTÚNRASE";
const SITE_URL = "https://abanitunrase.com";
const DEFAULT_DESCRIPTION =
  "ABÁNÍTÚNRASE is a Lagos styling house for bridal styling, occasion looks, and Kájáyelo travel wardrobe curation.";
const DEFAULT_IMAGE = "/logo.jpg";

const STYLING_META = {
  bridal: {
    title: "Bridal Styling | ABÁNÍTÚNRASE",
    description:
      "Bridal styling for traditional ceremonies, court weddings, white weddings, and full wedding wardrobes in Lagos and beyond.",
  },
  occasion: {
    title: "Occasion Styling | ABÁNÍTÚNRASE",
    description:
      "Occasion styling for owambe, birthdays, corporate events, portraits, and standout Lagos entrances.",
  },
  travel: {
    title: "Kájáyelo Travel Styling | ABÁNÍTÚNRASE",
    description:
      "Travel wardrobe curation for destination trips, holidays, and polished looks planned before you pack.",
  },
};

function setMeta(selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
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

function pageMeta(pathname) {
  if (pathname === "/rates") {
    return {
      title: "Rates & Styling Packages | ABÁNÍTÚNRASE",
      description:
        "Explore ABÁNÍTÚNRASE bridal styling, occasion styling, travel wardrobe, and consultation packages.",
    };
  }

  if (pathname.startsWith("/styling/")) {
    const type = pathname.split("/")[2];
    return STYLING_META[type] ?? {
      title: "Styling Services | ABÁNÍTÚNRASE",
      description: DEFAULT_DESCRIPTION,
    };
  }

  if (pathname.startsWith("/stories/")) {
    return {
      title: "Styling Stories | ABÁNÍTÚNRASE",
      description:
        "Explore ABÁNÍTÚNRASE styling stories across bridal, occasion, and travel wardrobes.",
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin | ABÁNÍTÚNRASE",
      description: "ABÁNÍTÚNRASE admin area.",
      robots: "noindex,nofollow",
    };
  }

  return {
    title: "ABÁNÍTÚNRASE | Lagos Styling House",
    description: DEFAULT_DESCRIPTION,
  };
}

export default function SeoMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta(pathname);
    const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    const image = `${SITE_URL}${DEFAULT_IMAGE}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', {
      name: "description",
      content: meta.description,
    });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: meta.robots ?? "index,follow,max-image-preview:large",
    });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: meta.title,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: meta.title,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: meta.description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
    setLink("canonical", canonical);
  }, [pathname]);

  return null;
}
