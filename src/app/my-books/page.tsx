export default function MyBooksPage() {
  return (
    <div className="min-h-screen bg-[#101512] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">My Books</h1>
          <p className="text-gray-400 text-sm mt-2">Books you added to the library.</p>
        </div>
        <div className="bg-[#161d18] border border-gray-800 rounded-2xl overflow-hidden p-6 text-center text-gray-400">
          No books added by you yet.
        </div>
      </div>
    </div>
  );
}