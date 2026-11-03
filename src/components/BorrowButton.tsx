'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BorrowModal from '@/components/BorrowModal';
import { authClient } from '@/lib/auth-client';

interface BorrowButtonProps {
  book: {
    _id: string;
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
  const [borrowerName, setBorrowerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // সেশন লোড হলে লগইন করা ইউজারের নাম ডিফল্ট হিসেবে সেট হবে
  useEffect(() => {
    if (session?.user?.name) {
      setBorrowerName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleConfirmBorrow = async () => {
    const userEmail = session?.user?.email;

    if (!userEmail) {
      setErrorMessage('Please log in before borrowing a book.');
      return;
    }

    if (!borrowerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (availableCopies <= 0) {
      setErrorMessage('No copies are currently available.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + 7);

    try {
      const response = await fetch('http://localhost:5000/borrows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image || '',
          userName: borrowerName.trim(),
          userEmail,
          borrowDate: borrowDate.toISOString(),
          returnDate: returnDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to borrow the book.');
      }

      setAvailableCopies((previous) => previous - 1);
      setIsModalOpen(false);

      alert(
        `Successfully borrowed: ${book.title}\nReturn date: ${returnDate.toLocaleDateString()}`
      );
      router.push('/my-borrows');
    } catch (error) {
      console.error('Borrow error:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while borrowing the book.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
          Available Copies: {availableCopies}
        </span>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-4 border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={() => {
            setErrorMessage('');

            if (!session?.user?.email) {
              setErrorMessage('Please log in before borrowing a book.');
              return;
            }

            setIsModalOpen(true);
          }}
          disabled={isPending || availableCopies <= 0 || loading}
          className="flex-1 rounded-xl bg-emerald-600 px-6 py-2.5 text-center font-medium text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {availableCopies > 0 ? 'Borrow Book' : 'Out of Stock'}
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
        onUserNameChange={setBorrowerName}
        userEmail={session?.user?.email || ''}
        onConfirm={handleConfirmBorrow}
        loading={loading}
      />
    </div>
  );
}