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

export async function uploadToCloudinary(file, onProgress) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      "Missing Cloudinary config — set VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, VITE_CLOUDINARY_API_SECRET in .env"
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = await sha1(`timestamp=${timestamp}${API_SECRET}`);
  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", API_KEY);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText || "{}");
        reject(new Error(err.error?.message ?? "Cloudinary upload failed"));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.send(form);
  });
}
