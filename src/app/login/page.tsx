"use client";

import { BookOpen, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe: true,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
        return;
      }

      if (!data) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      // Login successful
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Unable to connect to the authentication server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <BookOpen className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back to BookNook
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Please sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {errorMessage}
          </div>
        )}

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-slate-300"
            >
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </span>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
