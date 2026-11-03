import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // ক্লায়েন্ট সাইডে অ্যাক্সেস করার জন্য NEXT_PUBLIC_ ব্যবহার করা বাধ্যতামূলক
  // baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", 
});

// দ্বিতীয়বার createAuthClient() কল না করে, উপরের authClient থেকেই ফাংশনগুলো নিতে হবে
export const { signIn, signUp, useSession, signOut } = authClient;