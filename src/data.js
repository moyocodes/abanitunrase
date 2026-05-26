export const SITE_IMAGES = {
  ctaBackground: "",
  contactBackground: "",
};

export const LOOKS = [];
export const CATEGORIES = [];
export const BRIDAL = [];
export const OCCASION = [];
export const TRAVEL = [];

export const HERO_IMGS = [];
export const HERO_LABELS = [];
export const HERO_ROWS = [[], []];
export const HERO_DIRS = ["left", "right"];

export const INTRO_STEPS = 4;
export const INTRO_TRIGGER = 300;

export const SHOWCASED = [];
export const PLACEHOLDER_MEDIA = [];

export const fmt = (n) => "₦" + n.toLocaleString("en-NG");

export function ytEmbedUrl(url) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/|vimeo\.com\/)([a-zA-Z0-9_-]{5,15})/);
  if (!m) return url;
  if (url.includes("vimeo"))
    return "https://player.vimeo.com/video/" + m[1] + "?autoplay=1";
  return "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1";
}
