'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BorrowButton from '@/components/BorrowButton';
import { Book } from '@/types';

// ১. মূল সমস্ত লজিক ও ইউআই এই কম্পোনেন্টের ভেতরে থাকবে
function BookDetailsPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/books/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101512] flex items-center justify-center text-emerald-400">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#101512] p-8 text-white flex flex-col items-center justify-center">
        <p className="text-red-400 text-lg mb-4">Book details not found or server error!</p>
        <Link href="/books" className="px-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg">
          Back to All Books
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101512] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#161d18] border border-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="h-96 w-full rounded-xl overflow-hidden bg-[#101512] border border-gray-800 flex items-center justify-center p-2">
          <img src={book.image} alt={book.title} className="max-h-full max-w-full object-contain" />
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{book.category}</span>
          <h1 className="text-3xl font-bold mt-1 mb-2 font-serif">{book.title}</h1>
          <p className="text-gray-400 text-sm mb-4">by {book.author}</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{book.description}</p>
          
          <div className="bg-[#101512] p-4 rounded-xl border border-gray-800 mb-6 flex justify-between items-center text-sm">
            <div>
              <p className="text-gray-400 text-xs">Added by</p>
              <p className="text-white font-medium">{book.userName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Copies left</p>
              <p className="text-emerald-400 font-bold text-base">{book.copies}</p> 
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {book.copies > 0 ? (
              <BorrowButton book={book} />
            ) : (
              <button disabled className="px-6 py-3 bg-gray-800 text-gray-500 font-semibold rounded-xl cursor-not-allowed text-sm">
                Not Available
              </button>
            )}
            <Link href="/books" className="px-6 py-3 border border-gray-700 hover:border-emerald-500 rounded-xl transition text-center text-sm font-medium flex items-center justify-center">
              Back to all books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ২. মূল পেজ যা Suspense দিয়ে র‍্যাপ করা থাকবে (বিল্ড বা ডিপ্লয়ের সময় কোনো এরর দিবে না)
export default function BookDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#101512] flex items-center justify-center text-emerald-400">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BookDetailsPageContent />
    </Suspense>
  );
}