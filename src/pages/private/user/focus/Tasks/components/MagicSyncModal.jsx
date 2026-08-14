import { useState } from 'react';
import { X, Zap, Loader2, Flame, Smile, Meh, Moon, Frown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { magicSync, selectAILoading } from '../../../../../../features/tasks/tasksSlice';

const MOODS = [
  { icon: Flame, label: 'Energized', color: 'text-orange-500' },
  { icon: Smile, label: 'Good', color: 'text-emerald-500' },
  { icon: Meh, label: 'Okay', color: 'text-gray-500' },
  { icon: Moon, label: 'Tired', color: 'text-indigo-500' },
  { icon: Frown, label: 'Stressed', color: 'text-red-500' },
];

const MagicSyncModal = ({ open, onClose, onSynced }) => {
  const dispatch = useDispatch();
  const aiLoading = useSelector(selectAILoading);
  const [userInput, setUserInput] = useState('');
  const [mood, setMood] = useState('');

  const handleSync = async () => {
    const context = [mood && `Feeling: ${mood}`, userInput].filter(Boolean).join('. ');
    await dispatch(magicSync({ userInput: context || undefined }));
    setUserInput('');
    setMood('');
    if (onSynced) onSynced();
    onClose();
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800 animate-scale-in">
        {/* Gradient icon header */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-500">
          <Zap size={28} className="text-white" />
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"><X size={18} /></button>

        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Magic Sync</h3>
        <p className="mt-1.5 text-center text-base text-gray-500 dark:text-gray-400">
          AI will rebalance all your pending tasks based on priority and context
        </p>

        {/* Mood selector */}
        <div className="mt-5">
          <label className="mb-2 block text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">How are you feeling?</label>
          <div className="flex gap-2">
            {MOODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.label}
                  onClick={() => setMood(mood === m.label ? '' : m.label)}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-base font-medium transition-all ${mood === m.label
                      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:ring-violet-700'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:hover:bg-zinc-600'
                    }`}
                >
                  <Icon size={18} className={mood === m.label ? '' : m.color} />
                  <span className="text-[10px]">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Additional Context (optional)</label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={2}
            placeholder="e.g. I have a meeting at 3pm, focus on urgent items..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-violet-900"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
          <button onClick={handleSync} disabled={aiLoading} className="flex-1 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-base font-medium text-white shadow-sm shadow-violet-200 transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-50 dark:shadow-none">
            {aiLoading ? <><Loader2 size={16} className="inline animate-spin mr-1" />Syncing...</> : 'Sync Tasks'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagicSyncModal;
