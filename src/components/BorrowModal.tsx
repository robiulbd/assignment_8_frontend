'use client';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  userName: string;
  userEmail: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function BorrowModal({ 
  isOpen, 
  onClose, 
  bookTitle, 
  userName, 
  userEmail, 
  onConfirm,
  loading = false
}: BorrowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#161d18] border border-gray-800 p-6 rounded-2xl max-w-md w-full text-white">
        <h3 className="text-xl font-bold mb-4">Confirm Borrow</h3>
        <p className="text-sm text-gray-400 mb-4">
          You are about to borrow: <span className="text-white font-semibold">{bookTitle}</span>
        </p>
        
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs text-gray-400">User Name</label>
            <input 
              type="text" 
              readOnly 
              value={userName} 
              className="w-full bg-[#101512] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400">User Email</label>
            <input 
              type="text" 
              readOnly 
              value={userEmail} 
              className="w-full bg-[#101512] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition text-sm disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {loading ? 'Processing...' : 'Confirm Borrow'}
          </button>
          <button 
            onClick={onClose}
            disabled={loading} 
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition text-sm disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}