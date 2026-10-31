import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000", // আপনার ব্যাকএন্ড সার্ভারের বেস ইউআরএল
});