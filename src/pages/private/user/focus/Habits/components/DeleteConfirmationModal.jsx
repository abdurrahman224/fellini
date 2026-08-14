import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, habitName, loading }) => {
    if (!open) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 animate-fadeIn">
            {/* Modal Container */}
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">

                {/* Body */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Trash2 size={28} className="text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Delete Habit
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {habitName || 'this habit'}
                        </span>
                        ?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        This cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-zinc-600 rounded-xl text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

