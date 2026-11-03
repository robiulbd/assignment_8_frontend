import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL, // আপনার ব্যাকএন্ড সার্ভারের বেস ইউআরএল
});
export const { signIn, signUp, useSession } = createAuthClient()