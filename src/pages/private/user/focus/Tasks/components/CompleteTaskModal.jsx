import { useState } from 'react';
import { X, Clock, CheckCircle2, Timer } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { completeTask } from '../../../../../../features/tasks/tasksSlice';

const CompleteTaskModal = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  const [actualMinutes, setActualMinutes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!task) return;
    setLoading(true);
    await dispatch(completeTask({
      taskId: task.id,
      data: { actualMinutes: actualMinutes ? Number(actualMinutes) : undefined },
    }));
    setLoading(false);
    setActualMinutes('');
    onClose();
  };

  if (!open || !task) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800 animate-scale-in">
        {/* Icon header */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
          <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"><X size={18} /></button>

        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Complete Task</h3>
        <p className="mt-1.5 text-center text-base text-gray-500 dark:text-gray-400">
          Mark <strong className="text-gray-700 dark:text-gray-200">{task.title}</strong> as done
        </p>

        <div className="mt-5">
          <label className="mb-2 flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Timer size={13} /> Time Spent
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={actualMinutes}
              onChange={(e) => setActualMinutes(e.target.value)}
              placeholder={task.estimatedMinutes ? `Estimated: ${task.estimatedMinutes} min` : 'e.g. 30'}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-emerald-900"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-gray-400">min</span>
          </div>
          {task.estimatedMinutes && (
            <p className="mt-1.5 flex items-center gap-1 text-base text-gray-400 dark:text-gray-500">
              <Clock size={10} /> Estimated: {task.estimatedMinutes} minutes
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
          <button onClick={handleComplete} disabled={loading} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-base font-medium text-white shadow-sm shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50 dark:shadow-none">
            {loading ? 'Completing...' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteTaskModal;
