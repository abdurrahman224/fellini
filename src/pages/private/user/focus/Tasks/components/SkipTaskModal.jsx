import { useState } from 'react';
import { X, SkipForward } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { skipTask } from '../../../../../../features/tasks/tasksSlice';

const QUICK_REASONS = ['Not feeling well', 'Too busy today', 'Waiting on someone', 'Changed priorities'];

const SkipTaskModal = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSkip = async () => {
    if (!task || !reason.trim()) return;
    setLoading(true);
    await dispatch(skipTask({ taskId: task.id, data: { reason } }));
    setLoading(false);
    setReason('');
    onClose();
  };

  if (!open || !task) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800 animate-scale-in">
        {/* Icon header */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40">
          <SkipForward size={28} className="text-amber-600 dark:text-amber-400" />
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"><X size={18} /></button>

        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Skip Task</h3>
        <p className="mt-1.5 text-center text-base text-gray-500 dark:text-gray-400">
          Skip <strong className="text-gray-700 dark:text-gray-200">{task.title}</strong>?
        </p>

        {/* Quick reason chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {QUICK_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`rounded-full px-3 py-1 text-base font-medium transition-all ${reason === r
                  ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                }`}
            >{r}</button>
          ))}
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Why are you skipping this task?"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-amber-900"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
          <button onClick={handleSkip} disabled={loading || !reason.trim()} className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-base font-medium text-white shadow-sm shadow-amber-200 transition-all hover:bg-amber-600 active:scale-[0.97] disabled:opacity-50 dark:shadow-none">
            {loading ? 'Skipping...' : 'Skip Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipTaskModal;
