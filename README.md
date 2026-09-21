# ABÁNÍTÚNRASE

Styling house site — React + Vite frontend, Firebase (Firestore + Auth) as
the database/auth backend, Vercel serverless functions under `api/` for
anything that needs a secret (Paystack, Resend, WhatsApp, Cloudinary,
Firebase Admin).

## Stack

- **Frontend**: React 19 + Vite, React Router, Tailwind. Deployed to Vercel.
- **Database**: Firestore (`bookings`, `contacts`, `looks`, `pricing`,
  `settings`, `gallery`, `reviews` collections). Client SDK reads/writes
  directly from the browser for public data; admin-only collections are
  gated by `firestore.rules` (see below).
- **Auth**: Firebase Auth (email/password), one admin account. Admin access
  is gated by a custom claim (`admin: true`), not just "signed in" — see
  `firestore.rules`.
- **API routes** (`api/*`, deployed as Vercel Functions):
  - `grant-admin.cjs` — one-off endpoint to grant the `admin` custom claim.
  - `confirm-payment.cjs` — re-verifies a Paystack reference server-side
    before marking a booking paid (never trust the client's claim of a
    successful payment).
  - `track-booking.cjs`, `booked-consultation-times.cjs` — Firestore reads
    via the Admin SDK (bypasses client rules, used for things like
    "look up my booking by email" that shouldn't require admin auth).
  - `send-email.js`, `cloudinary-sign.js`, `verify-payment.js` — don't touch
    Firebase Admin, kept as plain `.js` ESM (see the `.cjs` note below).
  - `_firebaseAdmin.cjs` — shared Firebase Admin SDK init, used by the
    routes above that need Firestore/Auth Admin access.
- **DNS/CDN**: `abanitunrase.com` is proxied through **Cloudflare** in front
  of Vercel (orange-cloud DNS, not just an A/CNAME record) — see the gotcha
  below, this matters when debugging anything that looks like a
  routing/caching problem rather than an app bug.
- **Payments**: Paystack, client-initiated checkout + mandatory server-side
  re-verification (`api/confirm-payment.cjs`) before a booking is trusted
  as paid.
- **Email**: Resend. **WhatsApp**: Meta Cloud API (admin notifications only).
- **Images**: Cloudinary, signed uploads via `api/cloudinary-sign.js`.

## Local development

```bash
npm install
npm run dev      # Vite only — the frontend, at localhost:5173
```

`npm run dev` does **not** serve `api/*` — those are Vercel Functions and
only run under an actual Vercel deployment (or `vercel dev`, untested in
this repo). Expect `/api/*` calls to 404 locally; that's expected, not a bug.

```bash
npm run build     # production build -> dist/
npm run preview   # serve the built dist/ locally
```

## Environment variables

See `.env.example` for the full list and where each one is used. Broadly:
Paystack keys, Resend (email), WhatsApp Cloud API, Cloudinary, and the
Firebase **Admin SDK** service account (`FIREBASE_PROJECT_ID` /
`FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — server-side only, used by
the `.cjs` routes). These are all set in Vercel's project env vars, not in
a committed `.env` file. The Firebase **client** config (the public web
API key etc.) is hardcoded in `src/firebase/config.js` — that's normal and
safe for Firebase web apps, it's not a secret.

## Admin access setup

Admin access requires the `admin` custom claim on the Firebase Auth user,
not just being signed in — `firestore.rules` checks
`request.auth.token.admin == true` for every admin-only collection.

To grant it to an account:

```bash
curl -X POST https://abanitunrase.com/api/grant-admin \
  -H "Authorization: Bearer $SETUP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@abanitunrase.com"}'
```

`SETUP_SECRET` is set in Vercel's env vars. After a successful grant, the
admin **must sign out and back in** — the claim only lands in a fresh ID
token, an already-open session keeps the old one until it re-authenticates.

`firestore.rules` changes are **not** deployed by pushing to GitHub/Vercel —
that's a separate step (`firebase deploy --only firestore:rules`, or paste
+ publish in Firebase Console → Firestore → Rules).

Admin sessions also force-sign-out once per local calendar day (midnight,
admin's own browser timezone) — see `useMidnightLogout` in
`src/components/ProtectedRoute.jsx`.

## Known gotchas (read before debugging "it broke in prod but not locally")

- **`firebase-admin` + `"type": "module"`**: this project's `package.json`
  has `"type": "module"` (Vite needs it for the frontend). But
  `firebase-admin`'s Auth code path pulls in `jwks-rsa`, which does a plain
  CommonJS `require()` internally — that crashes under pure ESM with
  `ERR_REQUIRE_ESM` when Vercel runs the function. Any `api/*` file that
  imports `_firebaseAdmin` must be `.cjs` (Node always treats `.cjs` as
  CommonJS regardless of the root `package.json`), written with
  `require`/`module.exports`, not `import`/`export`. Files that don't touch
  `firebase-admin` (`send-email.js`, `cloudinary-sign.js`,
  `verify-payment.js`) are fine as plain ESM `.js`.
- **Cloudflare sits in front of Vercel** for `abanitunrase.com` (proxied
  DNS). If an `/api/*` route behaves differently on the custom domain than
  it does on the raw `*.vercel.app` deployment URL, or you see stale/cached
  responses that don't match what the code actually does, check Cloudflare
  (Caching config, Page Rules, Redirect Rules, Cache Rules) before assuming
  it's an application or Vercel bug. Hitting the `*.vercel.app` URL
  directly bypasses Cloudflare and is a fast way to isolate which layer a
  problem is in.
- **A silently-swallowed `.catch()` on a Firestore read looks identical to
  "no data exists."** `getBookings()`/`getContacts()` failing with
  `permission-denied` (e.g. a session that lost/never had the `admin`
  claim) used to render as an empty "0 records" table with no visible
  error — very easy to mistake for a data problem. `AdminBookings.jsx` now
  surfaces a visible error banner on a failed load instead of swallowing it
  — if you see that banner, it's a permissions/session issue, not missing
  data.
- **When a deployed endpoint misbehaves, check the raw response body/status
  first**, before reasoning about auth/claims/session logic inside it.
  `index.html` coming back from a POST to `/api/whatever` means the request
  never reached the function at all (routing/CDN layer) — no amount of
  fixing the function's own code will change that.
