interface BookDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  // ব্যাকএন্ড সার্ভার থেকে নির্দিষ্ট বইয়ের ডেটা ফেচ করা
  const res = await fetch(`http://localhost:5000/books/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 p-8 text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">Book details not found or server error!</p>
      </div>
    );
  }

  const book = await res.json();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12 px-4 text-white">
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Grid Layout: বামে কভার পেজ, ডানে তথ্য */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* বাম দিক: বইয়ের কভার পেজ */}
          <div className="md:col-span-1">
            {book.image ? (
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-80 object-cover rounded-xl border border-slate-700 shadow-md" 
              />
            ) : (
              <div className="w-full h-80 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                No Image Available
              </div>
            )}
          </div>

          {/* ডান দিক: সমস্ত বিস্তারিত তথ্য */}
          <div className="md:col-span-2 flex flex-col justify-between h-full">
            <div>
              {/* ক্যাটাগরি ব্যাজ */}
              <span className="inline-block bg-blue-600/90 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                {book.category}
              </span>

              {/* বইয়ের নাম ও লেখক */}
              <h1 className="text-3xl font-extrabold text-white mb-2">{book.title}</h1>
              <p className="text-slate-400 text-base mb-4">Author: <span className="text-slate-200 font-medium">{book.author}</span></p>

              {/* বিস্তারিত বিবরণ */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{book.description}</p>
              </div>

              {/* ইনক্লুডকারী বা ইউজারের তথ্য */}
              <div className="border-t border-slate-800 pt-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Added By:</p>
                  <p className="font-medium text-slate-200">{book.userName || 'Community Member'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Contact Email:</p>
                  <p className="font-medium text-slate-200">{book.userEmail || 'N/A'}</p>
                </div>
              </div>

              {/* এভেইলেবল কপি */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  Available Copies: {book.copies}
                </span>
              </div>
            </div>

            {/* বড় করার বা বরো করার বাটন */}
            <div className="pt-4 border-t border-slate-800 flex gap-4">
              <button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-6 rounded-xl transition shadow-lg text-center"
              >
                Borrow Book
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}