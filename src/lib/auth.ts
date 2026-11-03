import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  // ১. MongoDB Database Adapter সেটআপ
  database: mongodbAdapter(db, {
    client,
  }),

  // ২. Email & Password লগইন অপশন
  emailAndPassword: {
    enabled: true,
  },

  // ৩. Trusted Origins (Cross-Origin Request সফল করতে)
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

  // ৪. Advanced Settings (যদি Origin Check বন্ধ রাখতে চান)
  advanced: {
    disableOriginCheck: true,
  },
});