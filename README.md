
# WedPlan — Wedding Planning Platform

WedPlan is a role-based wedding planning platform. Customers discover wedding services and request bookings, vendors publish services and manage requests (with a Premium plan), and admins review services, manage users and monitor transactions.

## Live Links

- Live site: https://wedplan-client-delta.vercel.app
- Client repo: https://github.com/Minhaz-ify/wedplan-client
- Server repo: https://github.com/Minhaz-ify/wedplan-server

## Important Features

- Browse, search, filter (category, location) and sort services by price
- Service details with multiple images and a booking request form
- Role-based dashboards for Customer, Vendor and Admin
- Vendors add, update and delete services; free plan allows 3 active services
- Admin approves or rejects services, blocks or unblocks users, views transactions
- Stripe Checkout (test mode); Premium activates only after a verified webhook
- Email/password and Google sign in with Better Auth
- JWT verification and server-side role checks on the Express API
- Image upload with ImgBB, toast notifications, loading and error states
- Responsive design with Framer Motion animations on the home page

## Technology Stack

Next.js 15 (App Router), Tailwind CSS, Better Auth, Framer Motion, react-hot-toast, Express.js, MongoDB, Stripe Checkout, ImgBB.

## Installation

git clone https://github.com/Minhaz-ify/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env   

## Run Locally

npm run dev
Open http://localhost:3000. Start wedplan-server too; both use the same MongoDB database.

## Environment Variables

BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL, BETTER_AUTH_SECRET, MONGODB_URI, MONGODB_DB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_API_URL, IMGBB_API_KEY. See .env.example. Never commit .env.

## Roles

- Customer: browse, search, request bookings, cancel pending requests
- Vendor: manage services and bookings, upgrade to Premium
- Admin: manage users and services, view transactions. Admin is assigned by a server script, not by sign up.
