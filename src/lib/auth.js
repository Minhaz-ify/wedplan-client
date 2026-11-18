import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis;
const client = (globalForMongo._wedplanMongo ||= new MongoClient(process.env.MONGODB_URI));
const db = client.db(process.env.MONGODB_DB || "wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      businessName: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Nobody can sign up as admin or pre-set privileged fields
        before: async (user) => ({
          data: {
            ...user,
            role: ["vendor", "customer"].includes(user.role) ? user.role : "customer",
            isBlocked: false,
            subscriptionPlan: "free",
          },
        }),
      },
    },
  },
  hooks: {
    // /update-user must never be able to touch privileged fields
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/update-user") {
        const b = ctx.body || {};
        if ("role" in b || "isBlocked" in b || "subscriptionPlan" in b || "subscriptionExpiresAt" in b || "email" in b)
          throw new APIError("FORBIDDEN", { message: "These fields cannot be changed" });
      }
    }),
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({ id: user.id, email: user.email, role: user.role }),
      },
    }),
  ],
});
