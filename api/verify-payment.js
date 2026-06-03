const PAYSTACKT_SECRET_KEY = process.env.PAYSTACKT_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: "Missing reference" });
  }

  if (!reference.startsWith("AB")) {
    return res.status(400).json({ error: "Invalid reference" });
  }

  if (!PAYSTACKT_SECRET_KEY) {
    return res.status(500).json({ error: "Payment service not configured" });
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACKT_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message ?? "Verification failed" });
    }

    const { status, amount, currency, reference: ref, customer, paid_at } = data.data ?? {};

    return res.status(200).json({
      verified: status === "success",
      status,
      amount,
      currency,
      reference: ref,
      email: customer?.email,
      paid_at,
    });
  } catch {
    return res.status(500).json({ error: "Failed to reach payment service" });
  }
}
