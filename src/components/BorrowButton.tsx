"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BorrowModal from "@/components/BorrowModal";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

interface BorrowButtonProps {
  book: {
    _id?: string;
    title: string;
    copies: number;
    image?: string;
  };
}

export default function BorrowButton({ book }: BorrowButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableCopies, setAvailableCopies] = useState(book.copies);
  const [errorMessage, setErrorMessage] = useState("");

  const borrowerName = session?.user?.name || "Unknown User";
  const userEmail = session?.user?.email || "";

  const handleConfirmBorrow = async () => {
    if (!userEmail) {
      setErrorMessage("Please log in before borrowing a book.");
      return;
    }

    if (availableCopies <= 0) {
      setErrorMessage("No copies are currently available.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + 7);

    try {
      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image || "",
          userName: borrowerName,
          userEmail,
          borrowDate: borrowDate.toISOString(),
          returnDate: returnDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to borrow the book.");
      }

      setAvailableCopies((previous) => previous - 1);
      setIsModalOpen(false);

      alert(
        `Successfully borrowed: ${book.title}\nReturn date: ${returnDate.toLocaleDateString()}`
      );
      router.push("/my-borrows");
    } catch (error) {
      console.error("Borrow error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while borrowing the book."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex justify-between items-center bg-[#101512] p-3 rounded-lg border border-gray-800">
         <span className="text-gray-400 text-xs">Copies left</span>
         <span className={`font-bold text-base ${availableCopies > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
           {availableCopies > 0 ? availableCopies : "Out of Stock"}
         </span>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setErrorMessage("");
            if (!userEmail) {
              setErrorMessage("Please log in before borrowing a book.");
              return;
            }
            setIsModalOpen(true);
          }}
          disabled={isPending || availableCopies <= 0 || loading}
          className="flex-1 rounded-xl bg-emerald-600 px-6 py-3 text-center font-medium text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {availableCopies > 0 ? "Borrow Book" : "Not Available"}
        </button>
      </div>

      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!loading) {
            setIsModalOpen(false);
          }
        }}
        bookTitle={book.title}
        userName={borrowerName} 
        userEmail={userEmail}
        onConfirm={handleConfirmBorrow}
        loading={loading}
      />
    </div>
  );
}