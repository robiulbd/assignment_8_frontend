"use client";

import {
  BookOpen,
  FileText,
  Hash,
  Image as ImageIcon,
  Layers,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // ফর্মের ফিল্ডগুলোর জন্য স্টেট
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [copies, setCopies] = useState(1);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ইউজার লগইন না থাকলে লগইন পেজে রিডাইরেক্ট করার জন্য
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const bookData = {
      title,
      author,
      category,
      copies: Number(copies),
      image,
      description,
      userName: session?.user?.name || "",
      userEmail: session?.user?.email || "",
    };

    try {
      const res = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        throw new Error("Failed to add book");
      }

      // res.ok সত্য হলেই কেবল নিচের কোডগুলো রান করবে
      alert("Book added successfully!");
      setTitle("");
      setAuthor("");
      setCategory("");
      setDescription("");
      setImage("");
      setCopies(1);

      // সফল হলে অল বুকস বা হোম পেজে রিডাইরেক্ট করবে
      router.push("/books");
    } catch (err) {
      console.error(err);
      setError("Failed to add the book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-slate-900 p-8 border border-slate-800 shadow-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase mb-2">
            ADD BOOK
          </h1>
          <p className="text-sm text-slate-400">
            Put a book from your self into the library
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Book Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Book Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <BookOpen className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Author Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Author Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grid for Category & Total Copies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 3. Category (Dropdown) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                  <Layers className="h-4 w-4" />
                </span>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Religion">Religion</option>
                  <option value="Technology">Technology</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* 4. Total Copies */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Total Copies
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Hash className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Book Image URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Book Image URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <ImageIcon className="h-4 w-4" />
              </span>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/book-cover.jpg"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 6. Short Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Short Description
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-500">
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about the book..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grid for User Name & User Email (Auto-filled from session) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 7. User Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                User Name
              </label>
              <input
                type="text"
                disabled
                value={session?.user?.name || ""}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* 8. User Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                User Email
              </label>
              <input
                type="email"
                disabled
                value={session?.user?.email || ""}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* 9. Submit Button (Add Book) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
