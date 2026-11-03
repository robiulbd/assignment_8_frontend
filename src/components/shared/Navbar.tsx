"use client";

import { BookOpen, ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; // আপনার পাথ ঠিক করে নেবেন

export default function Navbar() {
  const router = useRouter();

  // Better Auth এর বিল্ট-ইন হুক দিয়ে সেশন ও ইউজার ডেটা আনা
  const { data: session, isPending } = authClient.useSession();

  // ড্রপডাউন মেনু টগল করার স্টেট
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            BookNook
          </span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-400">
            Home
          </Link>
          <Link href="/books" className="transition-colors hover:text-blue-400">
            All Books
          </Link>

          {/* সেশন বা ইউজার থাকলে মাঝখানের মেনুগুলো দেখাবে */}
          {session && (
            <>
              <Link
                href="/add-book"
                className="transition-colors hover:text-blue-400"
              >
                Add Book
              </Link>
              <Link
                href="/my-books"
                className="transition-colors hover:text-blue-400"
              >
                My Books
              </Link>
              <Link
                href="/my-borrows"
                className="transition-colors hover:text-blue-400"
              >
                My Borrows
              </Link>
            </>
          )}
        </nav>

        {/* Right: Auth Buttons or User Dropdown */}
        <div className="flex items-center space-x-3">
          {isPending ? (
            <div className="text-sm text-slate-400">Loading...</div>
          ) : session ? (
            /* ইউজার লগইন করা থাকলে এই সেクションটি দেখাবে */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 rounded-full bg-slate-800 p-1.5 pr-3 border border-slate-700 hover:bg-slate-700 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase() || (
                      <User className="h-4 w-4" />
                    )
                  )}
                </div>
                <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                  {session.user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {/* ড্রপডাউন বক্স */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile View
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ইউজার লগইন না করা থাকলে Login & Register বাটন দেখাবে */
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-slate-800 text-white border border-slate-600 hover:bg-slate-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
