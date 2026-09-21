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
- **Auth**: Firebase Auth (email/password) for login. Admin *authorization*
  is separate from login — it's a Firestore `admins` collection (doc id =
  lowercased email), not a custom claim. See "Admin access setup" below.
- **API routes** (`api/*`, deployed as Vercel Functions):
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

Admin access requires a document in the Firestore `admins` collection whose
**id is the person's lowercased email** — not just being signed in, and not
a Firebase Auth custom claim (that approach was tried and scrapped; see the
git history around this README's rewrite if you want the story). This
avoids the "must sign out and back in for it to apply" problem custom
claims have, since `firestore.rules`' `isAdmin()` does a live lookup on
every request instead of reading a cached token claim:

```
firestore.rules:
  function isAdmin() {
    return request.auth != null &&
      exists(/databases/$(database)/documents/admins/$(request.auth.token.email.lower()));
  }
```

**Managing admins day-to-day**: use the dashboard's **Admin Users** page
(`/admin/users`) — list, grant, and revoke access by email, changes apply
immediately (no re-login needed). Backed by `src/lib/admins.js`, plain
client-side Firestore reads/writes, no API endpoint involved.

**Bootstrapping the very first admin** (chicken-and-egg: `isAdmin()`
requires an existing `admins` doc to grant a new one, so nobody can grant
the first one through the app): create it directly in **Firebase Console →
Firestore Database → `admins` collection → Add document**, with the
document id set to the person's lowercased email, and any field (e.g.
`addedAt`) inside it.

`firestore.rules` changes are **not** deployed by pushing to GitHub/Vercel —
that's a separate step (`firebase deploy --only firestore:rules`, or paste
+ publish in Firebase Console → Firestore → Rules).

Admin sessions also force-sign-out once per local calendar day (midnight,
admin's own browser timezone) — see `useMidnightLogout` in
`src/components/ProtectedRoute.jsx`. This is unrelated to the admin-access
check above; it's just a standing "don't leave a tab logged in forever"
policy.

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
- **Admin access was originally a Firebase Auth custom claim** (`admin:
  true`, granted via `api/grant-admin.cjs`). That approach was abandoned —
  granting it required a Bearer-token API call from outside the app
  (Postman/curl) with no in-app UI, changes needed a full sign-out/sign-in
  to take effect, and a suspected Cloudflare-caching interaction made that
  API call unreliable to even verify. Don't reintroduce a custom-claim
  check in `firestore.rules` — admin status is a plain Firestore lookup now
  (see "Admin access setup" above), which sidesteps all of that.
