'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BorrowButton from '@/components/BorrowButton';
import { Book } from '@/types';
import { authClient } from '@/lib/auth-client';

import { API_URL } from "@/lib/api";

type Status = 'loading' | 'success' | 'not-found' | 'error';

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading book details"
      className="min-h-screen bg-[#101512] flex items-center justify-center"
    >
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[#101512] p-8 text-white flex flex-col items-center justify-center">
      <p className="text-red-400 text-lg mb-4">{text}</p>
      <Link
        href="/books"
        className="px-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg"
      >
        Back to all books
      </Link>
    </div>
  );
}

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (!id) return;

    const controller = new AbortController();

    async function fetchBook() {
      setStatus('loading');
      try {
        const res = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (res.status === 404) {
          setStatus('not-found');
          return;
        }
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        setBook(await res.json());
        setStatus('success');
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        console.error('Failed to fetch book details:', error);
        setStatus('error');
      }
    }

    fetchBook();
    return () => controller.abort();
  }, [id, session, isPending, router]);

  if (isPending || status === 'loading') return <Spinner />;

  if (!session) return null;

  if (status === 'not-found') return <Message text="This book could not be found." />;
  if (status === 'error' || !book) {
    return <Message text="Something went wrong while loading this book. Please try again." />;
  }

  return (
    <article className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#161d18] border border-gray-800 p-8 rounded-2xl shadow-xl">
      <div className="h-96 w-full rounded-xl overflow-hidden bg-[#101512] border border-gray-800 flex items-center justify-center p-2">
        <img
          src={book.image}
          alt={book.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div>
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          {book.category}
        </span>
        <h1 className="text-3xl font-bold mt-1 mb-2 font-serif">{book.title}</h1>
        <p className="text-gray-400 text-sm mb-4">by {book.author}</p>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{book.description}</p>

        <dl className="bg-[#101512] p-4 rounded-xl border border-gray-800 mb-6 flex justify-between items-center text-sm">
          <div>
            <dt className="text-gray-400 text-xs">Added by</dt>
            <dd className="text-white font-medium">{book.userName}</dd>
          </div>
        </dl>

        <div className="flex flex-col sm:flex-row gap-4">
          <BorrowButton book={book} />
          <Link
            href="/books"
            className="px-6 py-3 border border-gray-700 hover:border-emerald-500 rounded-xl transition text-center text-sm font-medium flex items-center justify-center"
          >
            Back to all books
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BookDetailsPage() {
  return (
    <main className="min-h-screen bg-[#101512] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <Suspense fallback={<Spinner />}>
        <BookDetailsContent />
      </Suspense>
    </main>
  );
}