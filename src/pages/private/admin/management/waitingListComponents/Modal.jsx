import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, setOpen, user, currentUsers, onConfirm }) => {
  if (!isOpen) return null;

  // Determine display name whether `user` is an object or an id
  let displayName = '';
  let userId = null;

  if (user && typeof user === 'object') {
    displayName = user.name || user.fullName || user.email || 'Username';
    userId = user.id;
  } else if (user) {
    userId = user;
    const found = (currentUsers || []).find((u) => u.id === userId);
    displayName = found ? found.name : String(userId);
  }

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm(userId);
    }
    if (setOpen) setOpen(false);
    if (onClose) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (setOpen) setOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, setOpen]);

  const handleOverlayClick = () => {
    if (setOpen) setOpen(false);
    if (onClose) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 "
      >
        {/* Header with title and close */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-transparent px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Send an Invitation</h3>
          <button
            onClick={handleOverlayClick}
            className="-mr-2 rounded-full p-2 text-gray-600 dark:text-gray-100 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-base text-gray-700 dark:text-gray-300 text-center">
            Do you really want to send an invitation to{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-300">{displayName}</span>?
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleOverlayClick}
              className="rounded-md border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="rounded-md bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
