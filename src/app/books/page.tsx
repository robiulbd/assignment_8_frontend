"use client";

import { BookMarked, BookOpen, Hash, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { API_URL} from "@/lib/api";

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

const borrowingSteps = [
  {
    step: "Step 1",
    title: "Find a book",
    description: "Browse the shelf and open any book you like.",
    icon: Search,
  },
  {
    step: "Step 2",
    title: "Borrow it",
    description: "Confirm the borrow. The book is yours for 7 days.",
    icon: BookOpen,
  },
  {
    step: "Step 3",
    title: "Return it",
    description: "Done reading? Return it from My Borrows in one click.",
    icon: RotateCcw,
  },
];

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Poetry",
  "Religion",
  "Technology",
  "Others",
];

function AllBooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books`);
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load books from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#101512] text-emerald-400">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ক্যাটাগরি ফিল্টার করা (যদি কোনো ক্যাটাগরিতে ক্লিক করা হয়)
  const filteredBooks = selectedCategory
    ? books.filter(
        (book) =>
          book.category?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase(),
      )
    : books;

  // ১. নিউ অ্যারাইভালস: সর্বশেষ এন্ট্রি করা মাত্র প্রথম ৮টি বই
  const newArrivals = filteredBooks.slice(0, 8);

  // ২. অল বুকস: ৮টির পরের বাকি সমস্ত বই মূল ক্যাটাগরিতে চলে যাবে
  const remainingBooks = filteredBooks.slice(8);

  const renderBookGrid = (bookList: Book[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {bookList.map((book) => (
        <div
          key={book._id}
          className="rounded-xl bg-[#161d18] border border-gray-800 shadow-xl overflow-hidden flex flex-col justify-between transition hover:border-emerald-500/40"
        >
          <div>
            <div className="h-64 w-full bg-[#101512] overflow-hidden relative">
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover transition hover:scale-105"
              />
              <span className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                {book.category}
              </span>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-white mb-1 truncate">
                {book.title}
              </h2>
              <p className="text-sm text-gray-400">by {book.author}</p>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 border-t border-gray-800/60 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" /> Available: {book.copies}
              </span>
            </div>
            <Link
              href={`/books/${book._id}`}
              className="w-full text-center rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-medium py-2 text-xs transition"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#101512] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ক্যাটাগরি ফিল্টার করা থাকলে নোটিশ ও রিসেট বাটন */}
        {selectedCategory && (
          <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/30 px-6 py-3 rounded-xl">
            <p className="text-sm text-emerald-400 font-medium">
              Filtering by Category:{" "}
              <span className="font-bold underline">{selectedCategory}</span>
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs bg-emerald-500 text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-400 transition"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ১. New Arrivals Section (সর্বশেষ ৮টি বই) */}
        <section>
          <div className="mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">
              {selectedCategory
                ? `${selectedCategory} - New Arrivals`
                : "New Arrivals"}
            </h1>
            <p className="text-sm text-gray-400">
              Explore our latest 8 books recently added to the library.
            </p>
          </div>

          {newArrivals.length === 0 ? (
            <p className="text-gray-400 py-6">
              No new arrivals found in this category.
            </p>
          ) : (
            renderBookGrid(newArrivals)
          )}
        </section>

        {/* ২. All Books Section (৮টির পরের বাকি সমস্ত বই) */}
        {remainingBooks.length > 0 && (
          <section className="pt-8 border-t border-gray-800">
            <div className="mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">
                {selectedCategory
                  ? `${selectedCategory} - All Books`
                  : "All Books"}
              </h2>
              <p className="text-sm text-gray-400">
                Explore and borrow more books from the community library
              </p>
            </div>

            {renderBookGrid(remainingBooks)}
          </section>
        )}
      </div>

      {/* ৩. How Borrowing Works Section */}
      <section className="bg-[#141c17] border-y border-gray-800/80 py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-white mb-2">
              How Borrowing Works
            </h2>
            <p className="text-sm text-gray-400">
              Three steps. No library card needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {borrowingSteps.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-[#18221c] border border-gray-800 rounded-xl p-8 text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-400/90 text-black flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-amber-500 mb-1">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ৪. Top Categories Section (ক্লিক ইভেন্ট সহ ৮টি ক্যাটাগরি) */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-white mb-2">
              Top Categories
            </h2>
            <p className="text-sm text-gray-400">
              Pick a shelf and start reading. Click any category to filter
              books.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <div
                  key={category}
                  onClick={() => {
                    setSelectedCategory(isSelected ? null : category);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`bg-[#161d18] border rounded-xl p-8 text-center flex flex-col items-center cursor-pointer transition duration-200 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10 scale-105"
                      : "border-gray-800 hover:border-emerald-500/40 hover:bg-[#1a231d]"
                  }`}
                >
                  <div className="text-emerald-400 mb-3">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {category}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Explore {category} books
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// সাসপেন্স বাউন্ডারি সহ ডিফল্ট এক্সপোর্ট (ডিপ্লয়মেন্ট ও বিল্ড এরর রোধ করার জন্য)
export default function AllBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101512] flex items-center justify-center text-emerald-400">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AllBooksContent />
    </Suspense>
  );
}
