import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Loader2, X, Calendar } from 'lucide-react';

export default function AIPlanModal({ open, onClose, prompt, setPrompt, isGenerating, onGenerate }) {
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !isGenerating) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, isGenerating, onClose]);

  if (!open) return null;

  return (
    <div onClick={() => { if (!isGenerating) onClose(); }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl ring-1 ring-gray-200 dark:ring-zinc-700 overflow-hidden scale-100 opacity-100 transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 inset-x-0 h-32  opacity-10 dark:opacity-20 pointer-events-none"></div>

        <div className="relative p-6 flex items-center justify-between border-b border-gray-100 dark:border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED] text-white shadow-md">
              <Sparkles size={24} className={isGenerating ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Plan Assistant</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Describe your week, let AI organize it.</p>
            </div>
          </div>
          {!isGenerating && (
            <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700 dark:hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 relative">
          <label htmlFor="week-start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Week Start Date
          </label>
          <div className="relative mb-4">
            <input
              type="date"
              id="week-start-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isGenerating}
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7C3AED] dark:focus:ring-violet-500 sm:text-sm bg-white dark:bg-zinc-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your instructions</label>
          <div className="relative group">
            <textarea
              id="ai-prompt"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}

              className="relative block w-full rounded-xl border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7C3AED] dark:focus:ring-violet-500 sm:text-sm sm:leading-6 bg-white dark:bg-zinc-900/50"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 bg-gray-50 dark:bg-zinc-700/30 p-4 border-t border-gray-100 dark:border-zinc-700">
          <button type="button" onClick={onClose} disabled={isGenerating} className="rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50">Cancel</button>
          <button
            type="button"
            onClick={() => onGenerate(selectedDate)}
            disabled={!prompt.trim() || !selectedDate || isGenerating}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all ${!prompt.trim() || !selectedDate || isGenerating ? 'bg-gray-400 dark:bg-zinc-600 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-[#7C3AED] to-indigo-600 hover:from-[#6D28D9] hover:to-indigo-700 hover:shadow-md'}`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Magic in progress...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
