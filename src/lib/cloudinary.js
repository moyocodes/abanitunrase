const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY    = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

async function sha1(str) {
  const buf = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      "Missing Cloudinary config — set VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, VITE_CLOUDINARY_API_SECRET in .env"
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Signature = SHA1("timestamp=<ts><api_secret>")
  const signature = await sha1(`timestamp=${timestamp}${API_SECRET}`);

  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", API_KEY);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "Cloudinary upload failed");
  }

  return (await res.json()).secure_url;
}
