import React, { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { POST } from '../../../../../services/httpMethods';
import { toast } from 'react-toastify';

const AnnouncementModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO');
  const [targetType, setTargetType] = useState('ALL_USERS');
  const [scheduledAt, setScheduledAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setType('INFO');
    setTargetType('ALL_USERS');
    setScheduledAt('');
    setExpiresAt('');
    setIsPinned(false);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      type,
      targetType,
      isPinned,
    };

    if (scheduledAt) payload.scheduledAt = new Date(scheduledAt).toISOString();
    if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

    try {
      setLoading(true);
      const response = await POST('/api/v1/admin/announcements', payload);
      const created = response?.data?.announcement || response?.announcement || response?.data || response;
      toast.success(response?.message);
      if (onSave) onSave(created);
      resetForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div onClick={() => { resetForm(); onClose && onClose(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/30  p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-xl shadow-xl overflow-hidden font-sans flex flex-col max-h-[80vh]">
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white ">Create Announcement</h2>
          <button onClick={() => { resetForm(); onClose && onClose(); }} className="text-gray-400 hover:text-gray-600  dark:text-gray-200 dark:hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-auto flex-1">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g New feature launch"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-300">Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Announcement Details"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Status </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none text-gray-600 dark:text-gray-300 pr-10"
              >
                <option value="INFO">INFO</option>
                <option value="FEATURE">FEATURE</option>
                <option value="ALERT">ALERT</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Target</label>
              <div className="relative">
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none text-gray-600 dark:text-gray-300 pr-10"
                >
                  <option value="ALL_USERS">All users</option>
                  <option value="ALL_INCLUDING_WAITLIST">All including waitlist</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Schedule</label>
              <div className="relative">
                <input
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">Expires</label>
              <div className="relative">
                <input
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400 "
                />

              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="pin"
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="pin" className="text-sm font-medium text-gray-700 dark:text-gray-200">Pin announcement</label>

            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-white dark:bg-zinc-800 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={() => { resetForm(); onClose && onClose(); }} className="px-8 py-2.5 border border-gray-400 text-gray-600 dark:text-gray-300 font-medium rounded-md  transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-[#7c3aed] text-white font-medium rounded-md hover:bg-[#6d28d9] transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;