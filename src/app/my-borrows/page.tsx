"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Defined here so the page does not depend on a '@/types' file that may not exist.
// If you already have IBorrow in '@/types' with these fields, you can import it instead.
interface IBorrow {
  _id: string;
  bookId: string;
  userEmail: string;
  bookTitle?: string;
  bookImage?: string;
  borrowDate?: string;
  returnDate?: string;
}

// Shows "-" instead of "Invalid Date" when a date is missing or malformed
const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    // Wait until the session check finishes
    if (isPending) return;

    // Not logged in: nothing to fetch
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchMyBorrows = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}/borrows?email=${encodeURIComponent(userEmail)}`,
          {
            cache: "no-store",
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from server");
        }

        setBorrows(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Failed to fetch borrowed books:", err);
        setError("Failed to load your borrowed books. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchMyBorrows();
    return () => controller.abort();
  }, [isPending, userEmail]);

  const handleReturnBook = async (id: string) => {
    setReturningId(id);
    setError("");

    try {
      const res = await fetch(`${API_URL}/borrows/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message || `Server responded with status ${res.status}`,
        );
      }

      // Remove the returned book from the list
      setBorrows((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to return book:", err);
      setError("Could not return the book. Please try again.");
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#101512] flex items-center justify-center text-emerald-400">
        <div
          role="status"
          aria-label="Loading"
          className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#101512] flex items-center justify-center px-4 text-center text-white">
        <div>
          <p className="mb-4 text-gray-300">
            Please log in to see your borrowed books.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101512] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-serif tracking-tight">
            My Borrows
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Books you are reading right now.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {borrows.length === 0 && !error ? (
          <div className="bg-[#161d18] border border-gray-800/80 rounded-2xl p-12 text-center text-gray-400">
            You have not borrowed any books yet.
          </div>
        ) : (
          borrows.length > 0 && (
            <div className="bg-[#161d18] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800/80 text-gray-400 text-xs uppercase tracking-wider bg-[#121814]">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Borrow Date</th>
                      <th className="py-4 px-6">Return Date</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-sm">
                    {borrows.map((borrow) => (
                      <tr
                        key={borrow._id}
                        className="hover:bg-emerald-950/10 transition"
                      >
                        <td className="py-4 px-6">
                          {borrow.bookImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={borrow.bookImage}
                              alt={borrow.bookTitle || "Book cover"}
                              className="w-12 h-16 object-cover rounded-md border border-gray-800"
                            />
                          ) : (
                            <div className="w-12 h-16 rounded-md border border-gray-800 bg-gray-800/50" />
                          )}
                        </td>
                        <td className="py-4 px-6 font-medium text-white">
                          {borrow.bookTitle || "Untitled book"}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {formatDate(borrow.borrowDate)}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {formatDate(borrow.returnDate)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleReturnBook(borrow._id)}
                            disabled={returningId === borrow._id}
                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-medium text-xs rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {returningId === borrow._id
                              ? "Returning..."
                              : "Return Book"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
