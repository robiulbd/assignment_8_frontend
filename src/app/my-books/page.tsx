"use client";

import { type FormEvent, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

interface Book {
  _id: string;
  title: string;
  category: string;
  copies: number;
}

const API = `${API_URL}/books`;

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Load books
  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`${API}?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load books");
        return res.json();
      })
      .then((data: Book[]) => setBooks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isPending, email]);

  // Delete book
  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");

      setBooks((currentBooks) => currentBooks.filter((book) => book._id !== id));
    } catch {
      alert("Could not delete the book.");
    }
  }

  // Save edited book
  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingBook) return;

    try {
      const res = await fetch(`${API}/${editingBook._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingBook.title,
          category: editingBook.category,
          copies: Number(editingBook.copies),
        }),
      });

      if (!res.ok) throw new Error("Failed to update book");

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book._id === editingBook._id ? editingBook : book,
        ),
      );

      setEditingBook(null);
    } catch {
      alert("Could not update the book.");
    }
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#101512] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-[#101512] flex items-center justify-center text-white">
        Please log in to view your books.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101512] px-4 py-12 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Books</h1>

        {books.length === 0 ? (
          <p className="text-center text-gray-400">
            You have not added any books yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left">
              <thead className="bg-[#121814] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Copies</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800 text-sm">
                {books.map((book) => (
                  <tr key={book._id}>
                    <td className="p-4">{book.title}</td>
                    <td className="p-4">{book.category}</td>
                    <td className="p-4 text-emerald-400">{book.copies}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditingBook({ ...book })}
                        className="mr-2 rounded bg-amber-500/20 px-3 py-2 text-amber-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(book._id)}
                        className="rounded bg-red-500/20 px-3 py-2 text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingBook && (
          <form
            onSubmit={handleUpdate}
            className="mt-8 space-y-4 rounded-xl border border-gray-800 bg-[#161d18] p-6"
          >
            <h2 className="text-xl font-bold">Edit Book</h2>

            <input
              type="text"
              value={editingBook.title}
              onChange={(e) =>
                setEditingBook({ ...editingBook, title: e.target.value })
              }
              placeholder="Book title"
              required
              className="w-full rounded bg-[#101512] border border-gray-700 p-3"
            />

            <input
              type="text"
              value={editingBook.category}
              onChange={(e) =>
                setEditingBook({ ...editingBook, category: e.target.value })
              }
              placeholder="Category"
              required
              className="w-full rounded bg-[#101512] border border-gray-700 p-3"
            />

            <input
              type="number"
              min="0"
              value={editingBook.copies}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  copies: Number(e.target.value),
                })
              }
              required
              className="w-full rounded bg-[#101512] border border-gray-700 p-3"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded bg-emerald-600 px-4 py-2"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="rounded bg-gray-700 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
