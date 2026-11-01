'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hash } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  image: string;
  description: string;
  userName?: string;
  userEmail?: string;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:5000/books');
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load books from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-white">
        <p className="text-lg">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase mb-2">
            ALL BOOKS
          </h1>
          <p className="text-sm text-slate-400">
            Explore and borrow books from the community library
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No books found in the library.</p>
          </div>
        )}

        {/* 4 Columns Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between transition hover:border-slate-700"
            >
              <div>
                {/* Book Cover Image (Full Cover style) */}
                <div className="h-64 w-full bg-slate-800 overflow-hidden relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition hover:scale-105"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow">
                    {book.category}
                  </span>
                </div>

                {/* Book Title & Author */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-white mb-1 truncate">{book.title}</h2>
                  <p className="text-sm text-slate-400">by {book.author}</p>
                </div>
              </div>

              {/* Card Footer: Available Copies & View Details Button */}
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
      </div>
    </div>
  );
}