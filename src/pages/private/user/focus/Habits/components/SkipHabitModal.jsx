import React, { useState } from 'react';
import { X, SkipForward } from 'lucide-react';
import { toast } from 'react-toastify';

const SkipHabitModal = ({ open, onClose, onSkip, habitName }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSkip = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for skipping', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            setLoading(true);
            const skipData = {
                reason: reason.trim(),
            };
            await onSkip(skipData);
            // Reset form
            setReason('');
            onClose();
        } catch (error) {
            console.error('Error skipping habit:', error);
            toast.error('Failed to skip habit. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setReason('');
        onClose();
    };

    return (
        <div onClick={handleCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 animate-fadeIn">
            {/* Modal Container */}
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-500 overflow-hidden animate-scaleIn">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-500">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <SkipForward size={20} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skip Habit</h2>
                    </div>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {habitName && (
                        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Skipping habit:</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{habitName}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Reason */}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reason"
                                placeholder="e.g., Was sick today, couldn't exercise"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400 text-gray-700 dark:bg-zinc-700 dark:placeholder:text-gray-400 dark:text-white resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 justify-end px-6 py-4 border-t border-gray-200 dark:border-zinc-500">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-2.5 border border-gray-400 dark:border-zinc-500 rounded-lg text-gray-600 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSkip}
                        disabled={loading}
                        className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            'Skipping...'
                        ) : (
                            <>
                                <SkipForward size={18} />
                                Skip
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkipHabitModal;
