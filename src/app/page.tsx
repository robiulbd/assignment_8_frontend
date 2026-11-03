"use client";

import { Hash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeroSlider from "@/components/shared/HeroSlider";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  image: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/books?limit=8")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* New Arrivals Section (৮টি বই) */}
      <section className="py-12 px-4 container mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 uppercase tracking-wider">
            New Arrivals
          </h2>
          <p className="text-slate-400 text-sm">
            Explore our latest 8 books recently added to the library.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-400 py-8">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-slate-400 py-8">No books found in the library.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between transition hover:border-slate-700"
              >
                <div>
                  <div className="h-64 w-full bg-slate-800 overflow-hidden relative">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow">
                      {book.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-400">by {book.author}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" /> Available: {book.copies}
                    </span>
                  </div>
                  <Link
                    href={`/books/${book._id}`}
                    className="w-full text-center rounded-lg bg-emerald-400/20 hover:bg-emerald-400 text-emerald-300 hover:text-black font-medium py-2 text-xs transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
