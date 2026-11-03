"use client";

import { BookOpen, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; // আপনার প্রজেক্টের পাথ অনুযায়ী এটি মিলিয়ে নেবেন

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // পাসওয়ার্ড মিলছে কি না তা চেক করা
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Better Auth দিয়ে সাইন-আপ রিকোয়েস্ট পাঠানো
      const { data, error: authError } = await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: () => {
            router.push("/"); // রেজিস্ট্রেশন সফল হলে হোমপেজে রিডাইরেক্ট করবে
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );

      if (authError) {
        setError(authError.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google sign up error:", err);
      setError("Google sign up failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-900 p-8 border border-slate-800 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create a BookNook Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join our library community
          </p>
        </div>

        {/* Google Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.4l3.7 2.9C6.4 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.5 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.8 6.4C.7 8.6 0 10.2 0 12s.7 3.4 1.8 5.6l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.3-6.5-5.3L1.8 15C3.7 18.8 7.5 23 12 23z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase">
            Or register with email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Email Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
