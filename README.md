# WedPlan — Client (Next.js)

Customer / Vendor / Admin wedding planning platform. Pairs with `wedplan-server`.


## Live Links

- Live site: https://wedplan-client-delta.vercel.app
- Client repo: https://github.com/Minhaz-ify/wedplan-client
- Server repo: https://github.com/Minhaz-ify/wedplan-server

## Stack

Next.js 15 (App Router), Tailwind CSS 3, Better Auth (email/password + Google, JWT plugin), Framer Motion, react-hot-toast.

## Setup

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

Start the server (`wedplan-server`) too — both share the same MongoDB database.

## Environment

See `.env.example`. Google OAuth redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`.
The ImgBB key stays server-side (uploads go through `/api/upload`).

## Roles

- **Customer:** browse, search/filter/sort, request bookings, cancel pending requests.
- **Vendor:** manage services (free plan: 3 active), accept/reject bookings, upgrade to Premium via Stripe.
- **Admin:** manage users (block/unblock), approve/reject/delete services, view transactions.
- Sign-up can only create `customer` or `vendor`; admin is promoted via the server script.

## Notes

- Private routes: `/services/[id]`, `/dashboard/**`, `/payment/**` (middleware + server-side checks).
- Premium activates only after the Stripe webhook confirms payment; the success page just polls the result.
- Google sign-up creates a Customer account.
- Components are plain Tailwind; add ShadCN/HeroUI components if your rubric requires a specific library
  (`npx shadcn@latest init`), then swap in for `Modal`, buttons, inputs.
