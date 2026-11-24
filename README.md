
# WedPlan — Wedding Planning Platform

WedPlan is a full-stack, role-based wedding planning platform where customers can discover wedding services and request bookings, vendors can publish services and manage booking requests, and admins can review services, manage users, and monitor transactions.

The project consists of a Next.js frontend and an Express REST API backend, sharing the same MongoDB database.

## Live Links

| Resource          | Link                                         |
| ----------------- | -------------------------------------------- |
| Live Website      | https://wedplan-client-delta.vercel.app      |
| Live Backend API  | https://wedplan-server-three.vercel.app      |
| Client Repository | https://github.com/Minhaz-ify/wedplan-client |
| Server Repository | https://github.com/Minhaz-ify/wedplan-server |

## Important Features

- Browse, search, filter, and sort wedding services by category, location, and price.
- Service details with multiple images and a booking request form.
- Role-based dashboards for Customers, Vendors, and Admins.
- Vendors can add, update, and delete their own services.
- Free-plan vendors can have a maximum of 3 active services.
- Vendors can manage booking requests and accept or reject bookings.
- Customers can request bookings and cancel pending requests.
- Admins can approve or reject services.
- Admins can block or unblock users.
- Admins can manage services and monitor transactions.
- Stripe Checkout integration for Premium subscriptions.
- Premium status activates only after a verified Stripe webhook.
- Email/password and Google authentication using Better Auth.
- JWT verification and server-side role authorization through the Express API.
- Image uploads using ImgBB.
- Toast notifications with `react-hot-toast`.
- Loading and error states for a better user experience.
- Responsive user interface.
- Framer Motion animations on the home page.

## Technology Stack

### Frontend

- Next.js 15 (App Router)
- React
- Tailwind CSS 3
- ShadCN UI
- Better Auth
- Framer Motion
- react-hot-toast

### Backend

- Node.js
- Express 5
- MongoDB (Native Driver)
- `jose` (JWT verification)
- Better Auth JWT / JWKS

### Payment & Services

- Stripe Checkout
- Stripe Webhooks
- ImgBB (Image Hosting)
- Vercel (Deployment)

## Installation and Setup

### 1. Clone the Client Repository

```bash
git clone https://github.com/Minhaz-ify/wedplan-client.git
cd wedplan-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file from the example.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Configure the required environment variables in `.env`.

### 4. Start the Client Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

**Important:** Start the `wedplan-server` backend as well. Both applications use the same MongoDB database.

Backend repository: https://github.com/Minhaz-ify/wedplan-server

## Environment Variables

The client project uses the following environment variables:

| Variable                 | Purpose                         |
| ------------------------ | ------------------------------- |
| `BETTER_AUTH_URL`      | Better Auth application URL     |
| `NEXT_PUBLIC_APP_URL`  | Public frontend application URL |
| `BETTER_AUTH_SECRET`   | Better Auth secret              |
| `MONGODB_URI`          | MongoDB connection string       |
| `MONGODB_DB`           | MongoDB database name           |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID          |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret      |
| `NEXT_PUBLIC_API_URL`  | Express backend API URL         |
| `IMGBB_API_KEY`        | ImgBB image upload API key      |

See `.env.example` for the environment variable configuration.

**Security Notes:**

- Never commit your `.env` file.
- Keep authentication secrets, database credentials, and API keys private.
- The ImgBB API key is used server-side through the `/api/upload` endpoint.

### Google OAuth Configuration

Set the Google OAuth redirect URI to:

```text
<BETTER_AUTH_URL>/api/auth/callback/google
```

Configure the matching Google OAuth client ID and client secret in your environment variables.

Google sign-up creates a Customer account.

## User Roles and Permissions

### Customer

- Browse and discover wedding services.
- Search, filter, and sort services.
- View service details.
- Request service bookings.
- View personal bookings.
- Cancel pending booking requests.

### Vendor

- Create, update, and delete services.
- Manage service listings.
- View booking requests.
- Accept or reject booking requests.
- Upgrade to Premium using Stripe Checkout.
- Free plan allows a maximum of 3 active services.

### Admin

- Manage registered users.
- Block and unblock users.
- Approve or reject submitted services.
- Delete services.
- View transaction records.

**Admin accounts are not created through normal sign-up.** A user must first register, then an admin role is assigned through the backend admin script in the `wedplan-server` repository.

## Authentication and Authorization

- Better Auth handles authentication on the Next.js client.
- Email/password and Google sign-in are supported.
- The client obtains JWTs for authenticated API requests.
- The Express backend verifies JWT signatures using Better Auth JWKS.
- User roles and blocked status are checked against MongoDB.
- Protected routes use middleware and server-side authorization checks.

## Protected Routes

The following routes require authentication and authorization checks:

- `/services/[id]`
- `/dashboard/**`
- `/payment/**`

Both middleware and server-side checks are used to protect private application routes.

## Premium Subscription and Payments

- Vendors can purchase Premium subscriptions through Stripe Checkout.
- Stripe webhook events are verified before processing.
- Premium status is activated only after the backend receives and verifies the relevant Stripe webhook.
- The payment success page only polls for the subscription result; it does not activate Premium by itself.

## Related Repository

WedPlan is divided into two repositories:

| Repository                                                    | Description                  |
| ------------------------------------------------------------- | ---------------------------- |
| [wedplan-client](https://github.com/Minhaz-ify/wedplan-client) | Next.js frontend application |
| [wedplan-server](https://github.com/Minhaz-ify/wedplan-server) | Express REST API backend     |

Both repositories are required to run the complete application locally.

---

**WedPlan — Wedding Planning Platform**

Discover services, manage bookings, and plan your perfect wedding.
