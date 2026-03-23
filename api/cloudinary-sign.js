async function sha1Hex(str) {
  const { createHash } = await import("node:crypto");
  return createHash("sha1").update(str).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName) {
    return res.status(500).json({ error: "Cloudinary is not configured on the server" });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = await sha1Hex(`timestamp=${timestamp}${apiSecret}`);

  return res.status(200).json({ timestamp, signature, apiKey, cloudName });
}
