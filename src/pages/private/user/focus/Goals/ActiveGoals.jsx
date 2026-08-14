import { Plus, Edit2, Trash2, Target, Loader2, Star, Calendar, ArrowRight, TrendingUp, Dumbbell, Briefcase, Heart, Sparkles, DollarSign, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewGoalModal from './components/NewGoalModal';
import {
  fetchGoals,
  deleteGoal,
  selectGoals,
  selectGoalsLoading,
  selectDeleteGoalLoading,
} from '../../../../../features/goals/goalsSlice';

const CATEGORY_CONFIG = {
  FITNESS: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', accent: 'from-emerald-400 to-teal-500', icon: Dumbbell },
  CAREER: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', accent: 'from-blue-400 to-indigo-500', icon: Briefcase },
  HEALTH: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', accent: 'from-rose-400 to-pink-500', icon: Heart },
  PERSONAL: { bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', accent: 'from-violet-400 to-purple-500', icon: Sparkles },
  FINANCE: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', accent: 'from-amber-400 to-orange-500', icon: DollarSign },
  EDUCATION: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', accent: 'from-indigo-400 to-blue-500', icon: BookOpen },
  OTHER: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-300', accent: 'from-gray-400 to-slate-500', icon: Target },
};

const STATUS_CONFIG = {
  ACTIVE: { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  COMPLETED: { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  DEFAULT: { cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' },
};

const relativeDeadline = (dateStr) => {
  if (!dateStr) return { text: 'No deadline', urgent: false };
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - now) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, urgent: true };
  if (diff === 0) return { text: 'Due today', urgent: true };
  if (diff === 1) return { text: 'Due tomorrow', urgent: false };
  if (diff <= 7) return { text: `${diff} days left`, urgent: false };
  if (diff <= 30) return { text: `${Math.ceil(diff / 7)} weeks left`, urgent: false };
  return { text: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }), urgent: false };
};

export default function ActiveGoals() {
  const dispatch = useDispatch();
  const goals = useSelector(selectGoals);
  const loading = useSelector(selectGoalsLoading);
  const deleteLoading = useSelector(selectDeleteGoalLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { dispatch(fetchGoals()); }, [dispatch]);

  const handleOpenCreate = () => { setEditGoal(null); setModalOpen(true); };
  const handleOpenEdit = (goal) => { setEditGoal(goal); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditGoal(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteGoal(deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Stats summary ──
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
  const mainFocusGoal = goals.find((g) => g.isMainFocus);

  return (
    <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 font-sans min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white tracking-tight">Active Goals</h1>
          <p className="mt-0.5 text-base text-gray-500 dark:text-gray-400">
            {totalGoals === 0 ? 'Set your first goal to start your journey' : `${activeGoals} active goal${activeGoals !== 1 ? 's' : ''} in progress`}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.97] dark:shadow-none"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      {/* Main Focus Highlight */}
      {mainFocusGoal && (
        <div className="mb-6 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 p-[1px] animate-fade-in">
          <div className="flex items-center gap-4 rounded-[11px] bg-white p-4 dark:bg-zinc-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
              <Star size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">Main Focus</p>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{mainFocusGoal.title}</h3>
            </div>
            <button onClick={() => handleOpenEdit(mainFocusGoal)} className="shrink-0 flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-base font-medium text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50">
              View <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="mt-3 text-base text-gray-400 dark:text-gray-500">Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm ring-1 ring-gray-100 dark:bg-zinc-800 dark:ring-zinc-700 animate-fade-in">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/30">
            <Target className="h-10 w-10 text-violet-400 dark:text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No goals yet</h3>
          <p className="mt-1 max-w-xs text-center text-base text-gray-400 dark:text-gray-500">Create your first goal and start building momentum toward what matters most</p>
          <button onClick={handleOpenCreate} className="mt-6 flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.97]">
            <Plus size={18} /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal, i) => {
            const cfg = CATEGORY_CONFIG[goal.category] || CATEGORY_CONFIG.OTHER;
            const st = STATUS_CONFIG[goal.status] || STATUS_CONFIG.DEFAULT;
            const deadline = relativeDeadline(goal.targetDate);

            return (
              <div
                key={goal.id}
                className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-800 dark:ring-zinc-700 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                {/* Colored top accent */}
                <div className={`h-1 bg-linear-to-r ${cfg.accent}`} />

                <div className="flex flex-col flex-1 p-5">
                  {/* Top row: category + actions */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-base font-semibold ${cfg.bg} ${cfg.text}`}>
                      <cfg.icon size={14} /> {goal.category?.charAt(0) + goal.category?.slice(1).toLowerCase()}
                    </span>
                    <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button onClick={() => handleOpenEdit(goal)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30" title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(goal)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title & description */}
                  <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-white">{goal.title}</h3>
                  {goal.description && (
                    <p className="mt-1.5 text-base leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">{goal.description}</p>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Priority bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-medium text-gray-400 dark:text-gray-500">Priority</span>
                      <span className="text-base font-bold text-violet-600 dark:text-violet-400">{goal.priority}/10</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
                      <div className={`h-full rounded-full bg-linear-to-r ${cfg.accent} transition-all duration-500`} style={{ width: `${(goal.priority / 10) * 100}%` }} />
                    </div>
                  </div>

                  {/* Footer: deadline + badges */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-700">
                    <span className={`flex items-center gap-1.5 text-base font-medium ${deadline.urgent ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      <Calendar size={12} /> {deadline.text}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-base font-medium ${st.cls}`}>
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {goal.status || 'ACTIVE'}
                      </span>
                      {goal.isMainFocus && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-base font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                          <Star size={10} /> Focus
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewGoalModal open={modalOpen} onClose={handleCloseModal} initial={editGoal} />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div onClick={() => setDeleteTarget(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800 animate-scale-in">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Delete Goal</h3>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong className="text-gray-700 dark:text-gray-200">{deleteTarget.title}</strong>? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.97] disabled:opacity-50">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}