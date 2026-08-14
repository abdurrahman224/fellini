import {
  Plus, Edit2, Trash2, Clock, Sparkles, Wand2, CheckCircle2,
  SkipForward, Loader2, Bot, Filter, ListChecks,
  AlertTriangle, RefreshCw, TrendingUp, CalendarClock,
  CircleCheckBig, ListTodo, ChevronDown, X, Zap,
  Calendar, Target, ArrowRight, Play, ChevronLeft, ChevronRight, CornerDownRight,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewTaskModal from './components/NewTaskModal';
import CompleteTaskModal from './components/CompleteTaskModal';
import SkipTaskModal from './components/SkipTaskModal';
import MagicSyncModal from './components/MagicSyncModal';
import {
  fetchTasks,
  fetchTodayTasks,
  fetchOverdueTasks,
  deleteTask,
  updateTask,
  generateTasksFromGoals,
  generateDailyTasks,
  breakdownTask,
  fetchTaskStats,
  selectTasks,
  selectTodayTasks,
  selectOverdueTasks,
  selectTasksLoading,
  selectAILoading,
  selectTaskStats,
  selectTaskFilters,
  setTaskFilter,
  clearTaskFilters,
} from '../../../../../features/tasks/tasksSlice';
import { fetchGoals } from '../../../../../features/goals/goalsSlice';

// ─── Helpers ──────────────────────────────────────────────────
const relativeDate = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - now) / 86400000);
  if (diff < -1) return { text: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === -1) return { text: 'Yesterday', overdue: true };
  if (diff === 0) return { text: 'Today', overdue: false };
  if (diff === 1) return { text: 'Tomorrow', overdue: false };
  if (diff <= 7) return { text: `${diff}d left`, overdue: false };
  return { text: new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), overdue: false };
};

// ─── Priority config ──────────────────────────────────────────
const PRIORITY_CONFIG = {
  URGENT: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  HIGH: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  MEDIUM: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  LOW: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

const STATUS_BADGE = {
  TODO: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  SKIPPED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const COLUMN_CONFIG = {
  todo: { accent: 'from-slate-400 to-slate-500', icon: <ListTodo size={16} /> },
  in_progress: { accent: 'from-blue-500 to-indigo-500', icon: <TrendingUp size={16} /> },
  done: { accent: 'from-emerald-500 to-teal-500', icon: <CircleCheckBig size={16} /> },
};

const VIEWS = ['board', 'list', 'today', 'overdue'];
const VIEW_ICONS = { board: <ListTodo size={15} />, list: <ListChecks size={15} />, today: <Calendar size={15} />, overdue: <AlertTriangle size={15} /> };
const VIEW_LABELS = { board: 'Board', list: 'List', today: 'Today', overdue: 'Overdue' };


const TaskCard = ({ task, onEdit, onDelete, onComplete, onSkip, onStartProgress, onBreakdown, breakdownTaskId, parentTask, index = 0 }) => {
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
  const due = relativeDate(task.dueDate);
  const isSubtask = !!task.parentTaskId;

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-800/80 animate-fade-in-up ${isSubtask
        ? 'ml-6 border-l-2 border-l-violet-300 border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-l-violet-700 dark:border-t-zinc-700 dark:border-r-zinc-700 dark:border-b-zinc-700'
        : 'border-gray-100 dark:border-zinc-700'
        }`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Subtask indicator */}
      {isSubtask && (
        <div className="absolute -left-6 top-1/2 flex items-center">
          <CornerDownRight size={12} className="text-violet-400 dark:text-violet-600" />
        </div>
      )}

      {/* Priority accent strip */}
      <div className={`absolute ${isSubtask ? 'left-0' : 'left-0'} top-3 h-8 w-1 rounded-r-full ${p.dot}`} />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 pl-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {isSubtask && parentTask && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <CornerDownRight size={9} /> Subtask of: {parentTask.title?.substring(0, 20)}{parentTask.title?.length > 20 ? '...' : ''}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-base font-semibold uppercase tracking-wider ${p.bg} ${p.text}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.dot}`} />{task.priority}
          </span>
          {task.aiGenerated && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-1.5 py-0.5 text-base font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              <Sparkles size={10} />AI
            </span>
          )}
        </div>
        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {task.status === 'TODO' && (
            <button onClick={() => onStartProgress(task)} title="Start Progress" className="rounded-md p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"><Play size={18} /></button>
          )}
          <button onClick={() => onComplete(task)} title="Complete" className="rounded-md p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"><CheckCircle2 size={18} /></button>
          <button onClick={() => onSkip(task)} title="Skip" className="rounded-md p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30"><SkipForward size={18} /></button>
          <button onClick={() => onEdit(task)} title="Edit" className="rounded-md p-2 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30"><Edit2 size={18} /></button>
          <button onClick={() => onDelete(task)} title="Delete" className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* Title & description */}
      <h3 className="mt-2.5 pl-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">{task.title}</h3>
      {task.description && (
        <p className="mt-1 pl-2 text-base leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      )}

      {/* Meta tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-2">
        {task.category && (
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-base font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">{task.category.charAt(0) + task.category.slice(1).toLowerCase()}</span>
        )}
        {task.estimatedMinutes && (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-base text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
            <Clock size={10} />{task.estimatedMinutes}m
          </span>
        )}
        {task.goalId && (
          <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-base text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Target size={10} />Goal
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 pl-2 dark:border-zinc-700">
        {due ? (
          <span className={`flex items-center gap-1 text-base font-medium ${due.overdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
            <CalendarClock size={12} />{due.text}
          </span>
        ) : (
          <span className="text-base text-gray-300 dark:text-gray-600">No due date</span>
        )}
        {task.status !== 'COMPLETED' && task.status !== 'SKIPPED' && (
          <button
            onClick={() => onBreakdown(task.id || task._id)}
            disabled={breakdownTaskId === (task.id || task._id)}
            title="AI Breakdown"
            className="flex items-center gap-1 rounded-lg bg-violet-50 px-2 py-1 text-base font-medium text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50 disabled:opacity-40"
          >
            <Wand2 size={11} className={breakdownTaskId === (task.id || task._id) ? 'animate-spin' : ''} /> Breakdown
          </button>
        )}
      </div>
    </div>
  );
};


// COLUMN

const Column = ({ title, tasks, colKey, onAddCard, currentPage, onPageChange, pageSize = 5, cardPropsBuilder }) => {
  const cfg = COLUMN_CONFIG[colKey] || COLUMN_CONFIG.todo;
  const totalPages = Math.ceil(tasks.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedTasks = tasks.slice(startIdx, startIdx + pageSize);

  return (
    <div className="flex flex-col rounded-xl bg-gray-50/80 dark:bg-zinc-800/50 overflow-hidden">
      {/* Colored header accent */}
      <div className={`h-1 bg-linear-to-r ${cfg.accent}`} />
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">{cfg.icon}</span>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-base font-bold text-gray-600 dark:bg-zinc-600 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-2.5 px-3 pb-3 pt-1">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-200 py-8 dark:border-zinc-700">
            <ListChecks className="mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-base text-gray-400 dark:text-gray-500">No tasks here</p>
          </div>
        )}
        {paginatedTasks.map((t, i) => <TaskCard key={t.id || t._id} task={t} index={i} {...cardPropsBuilder(t)} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mx-3 mb-2 flex items-center justify-between rounded-lg bg-white px-2 py-1.5 shadow-sm dark:bg-zinc-700">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-zinc-600"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-zinc-600"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      <button
        onClick={() => onAddCard && onAddCard()}
        className="mx-3 mb-3 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-200 py-2.5 text-base font-medium text-gray-400 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-zinc-600 dark:hover:border-violet-500 dark:hover:bg-violet-900/20 dark:hover:text-violet-300"
      >
        <Plus size={16} /> Add Task
      </button>
    </div>
  );
};

// STATS BAR
const StatsBar = ({ stats, tasks = [] }) => {
  if (!stats) return null;
  // Compute accurate counts from actual task list so stats match the board columns
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const items = [
    { label: 'Total Tasks', value: stats.total ?? tasks.length, icon: <ListTodo size={18} />, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/30', ring: 'ring-violet-100 dark:ring-violet-800' },
    { label: 'Completed', value: stats.completed ?? 0, icon: <CircleCheckBig size={18} />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', ring: 'ring-emerald-100 dark:ring-emerald-800' },
    { label: 'In Progress', value: inProgressCount, icon: <TrendingUp size={18} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', ring: 'ring-blue-100 dark:ring-blue-800' },
    { label: 'Overdue', value: stats.overdue ?? 0, icon: <AlertTriangle size={18} />, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', ring: 'ring-red-100 dark:ring-red-800' },
  ];
  const total = stats.total || 1;
  const pct = Math.round(((stats.completed ?? 0) / total) * 100);

  return (
    <div className="mb-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className={`flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ${s.ring} dark:bg-zinc-800 transition-shadow hover:shadow-md`}>
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>{s.icon}</div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-base font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Completion progress bar */}
      <div className="mt-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-zinc-800 dark:ring-zinc-700">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">Overall Completion</span>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
          <div className="h-full rounded-full bg-linear-to-r from-violet-500 to-emerald-500 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};


// MAIN COMPONENT

export default function TasksBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const todayTasks = useSelector(selectTodayTasks);
  const overdueTasks = useSelector(selectOverdueTasks);
  const loading = useSelector(selectTasksLoading);
  const aiLoading = useSelector(selectAILoading);
  const stats = useSelector(selectTaskStats);
  const filters = useSelector(selectTaskFilters);

  const [view, setView] = useState('board');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [magicSyncOpen, setMagicSyncOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // AI action loading states
  const [activeAIAction, setActiveAIAction] = useState(null);
  const [breakdownTaskId, setBreakdownTaskId] = useState(null);

  // Pagination state
  const [todoPage, setTodoPage] = useState(1);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);
  const PAGE_SIZE = 5;

  // ── Load data ──
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchGoals());
    dispatch(fetchTaskStats());
  }, [dispatch]);

  useEffect(() => {
    if (view === 'today') dispatch(fetchTodayTasks());
    if (view === 'overdue') dispatch(fetchOverdueTasks());
  }, [view, dispatch]);

  useEffect(() => {
    const activeFilters = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) activeFilters[k] = v; });
    dispatch(fetchTasks(activeFilters));
  }, [filters, dispatch]);

  const refreshAll = () => {
    dispatch(fetchTasks());
    dispatch(fetchTaskStats());
    if (view === 'today') dispatch(fetchTodayTasks());
    if (view === 'overdue') dispatch(fetchOverdueTasks());
  };

  const handleCreate = () => { setEditTask(null); setModalOpen(true); };
  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditTask(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await dispatch(deleteTask(deleteTarget.id));
    setDeleteLoading(false);
    setDeleteTarget(null);
    refreshAll();
  };

  const handleGenerateFromGoals = async () => {
    setActiveAIAction('fromGoals');
    await dispatch(generateTasksFromGoals());
    setActiveAIAction(null);
    refreshAll();
  };

  const handleGenerateDaily = async () => {
    setActiveAIAction('daily');
    await dispatch(generateDailyTasks());
    setActiveAIAction(null);
    refreshAll();
  };

  const handleBreakdown = async (taskId) => {
    setBreakdownTaskId(taskId);
    await dispatch(breakdownTask(taskId));
    setBreakdownTaskId(null);
    refreshAll();
  };

  const handleStartProgress = async (task) => {
    await dispatch(updateTask({ taskId: task.id || task._id, data: { status: 'IN_PROGRESS' } }));
    refreshAll();
  };

  // ── Board columns ──
  // Build parent task lookup map for subtasks
  const taskMap = useMemo(() => {
    const map = {};
    tasks.forEach(t => { map[t.id || t._id] = t; });
    return map;
  }, [tasks]);

  const todoTasks = useMemo(() => tasks.filter((t) => t.status === 'TODO'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === 'IN_PROGRESS'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED'), [tasks]);

  const displayTasks = view === 'today' ? todayTasks : view === 'overdue' ? overdueTasks : tasks;

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const cardPropsBuilder = (task) => ({
    onEdit: handleEdit,
    onDelete: setDeleteTarget,
    onComplete: setCompleteTarget,
    onSkip: setSkipTarget,
    onStartProgress: handleStartProgress,
    onBreakdown: handleBreakdown,
    breakdownTaskId,
    parentTask: task.parentTaskId ? taskMap[task.parentTaskId] : null,
  });

  return (
    <div className="bg-[#F5F5F7] dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 font-sans min-h-screen">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white tracking-tight">Tasks Board</h1>
          <p className="mt-0.5 text-base text-gray-500 dark:text-gray-400">Organize, prioritize, and conquer your tasks</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Actions — grouped */}
          <div className="flex items-center rounded-lg border border-violet-200 bg-violet-50/50 p-1 dark:border-violet-800 dark:bg-violet-900/20">
            <button onClick={handleGenerateFromGoals} disabled={activeAIAction !== null} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-base font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-800/40 disabled:opacity-50" title="Generate tasks from your goals">
              <Sparkles size={14} className={activeAIAction === 'fromGoals' ? 'animate-spin' : ''} /> From Goals
            </button>
            <div className="mx-0.5 h-4 w-px bg-violet-200 dark:bg-violet-700" />
            <button onClick={handleGenerateDaily} disabled={activeAIAction !== null} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-base font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-800/40 disabled:opacity-50" title="Generate daily tasks with AI">
              <Bot size={14} className={activeAIAction === 'daily' ? 'animate-spin' : ''} /> Daily
            </button>
            <div className="mx-0.5 h-4 w-px bg-violet-200 dark:bg-violet-700" />
            <button onClick={() => setMagicSyncOpen(true)} disabled={aiLoading} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-base font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-800/40 disabled:opacity-50" title="AI rebalance all tasks">
              <Zap size={14} /> Magic Sync
            </button>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-base font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.97] dark:shadow-none">
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsBar stats={stats} tasks={tasks} />

      {/* ── View Tabs & Filters ── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100 dark:bg-zinc-800 dark:ring-zinc-700">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-base font-medium transition-all duration-200 ${view === v
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-200'
                }`}
            >
              {VIEW_ICONS[v]} {VIEW_LABELS[v]}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-base font-medium ring-1 transition-all ${showFilters || activeFilterCount > 0
            ? 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-700'
            : 'bg-white text-gray-600 ring-gray-200 hover:ring-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:ring-zinc-600'
            }`}
        >
          <Filter size={15} /> Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* ── Filter Panel ── */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'mb-5 max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-zinc-800 dark:ring-zinc-700">
          {[
            { name: 'status', options: [['', 'All Status'], ['TODO', 'To Do'], ['IN_PROGRESS', 'In Progress'], ['COMPLETED', 'Completed'], ['SKIPPED', 'Skipped'], ['CANCELED', 'Canceled']] },
            { name: 'priority', options: [['', 'All Priority'], ['LOW', 'Low'], ['MEDIUM', 'Medium'], ['HIGH', 'High'], ['URGENT', 'Urgent']] },
            { name: 'category', options: [['', 'All Category'], ['FITNESS', 'Fitness'], ['CAREER', 'Career'], ['HEALTH', 'Health'], ['PERSONAL', 'Personal'], ['FINANCE', 'Finance'], ['EDUCATION', 'Education']] },
            { name: 'source', options: [['', 'All Source'], ['AI_GENERATED', 'AI Generated'], ['MANUAL', 'Manual']] },
          ].map((f) => (
            <div key={f.name} className="relative">
              <select
                value={filters[f.name] || ''}
                onChange={(e) => dispatch(setTaskFilter({ [f.name]: e.target.value }))}
                className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-base font-medium text-gray-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-200 dark:focus:ring-violet-800"
              >
                {f.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button onClick={() => dispatch(clearTaskFilters())} className="flex items-center gap-1 rounded-lg px-3 py-2 text-base font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="mt-3 text-base text-gray-400 dark:text-gray-500">Loading tasks...</p>
        </div>
      ) : view === 'board' ? (
        /* ── Board View ── */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          <Column title="To Do" tasks={todoTasks} colKey="todo" onAddCard={handleCreate} currentPage={todoPage} onPageChange={setTodoPage} pageSize={PAGE_SIZE} cardPropsBuilder={cardPropsBuilder} />
          <Column title="In Progress" tasks={inProgressTasks} colKey="in_progress" onAddCard={handleCreate} currentPage={inProgressPage} onPageChange={setInProgressPage} pageSize={PAGE_SIZE} cardPropsBuilder={cardPropsBuilder} />
          <Column title="Done" tasks={completedTasks} colKey="done" onAddCard={handleCreate} currentPage={donePage} onPageChange={setDonePage} pageSize={PAGE_SIZE} cardPropsBuilder={cardPropsBuilder} />
        </div>
      ) : (
        /* ── List / Today / Overdue View ── */
        <div className="space-y-2.5 animate-fade-in">
          {displayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm ring-1 ring-gray-100 dark:bg-zinc-800 dark:ring-zinc-700">
              {view === 'overdue' ? <AlertTriangle className="h-12 w-12 text-red-200 dark:text-red-800 mb-3" /> : <ListChecks className="h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />}
              <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400">
                {view === 'today' ? 'No tasks for today' : view === 'overdue' ? 'No overdue tasks — great job!' : 'No tasks found'}
              </h3>
              <p className="mt-1 max-w-xs text-center text-base text-gray-400 dark:text-gray-500">
                {view === 'today' ? 'Use AI to generate your daily tasks' : view === 'overdue' ? 'You\'re all caught up' : 'Create a new task or generate from your goals'}
              </p>
              {view !== 'overdue' && (
                <button onClick={view === 'today' ? handleGenerateDaily : handleCreate} className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-base font-medium text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.97]">
                  {view === 'today' ? <><Bot size={16} /> Generate Daily Tasks</> : <><Plus size={16} /> Create Task</>}
                </button>
              )}
            </div>
          ) : (
            displayTasks.map((task, i) => {
              const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
              const due = relativeDate(task.dueDate);
              const isSubtask = !!task.parentTaskId;
              const parentTask = task.parentTaskId ? taskMap[task.parentTaskId] : null;

              return (
                <div
                  key={task.id || task._id}
                  className={`group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 transition-all duration-200 hover:shadow-md dark:bg-zinc-800 animate-fade-in-up ${due?.overdue ? 'ring-red-200 dark:ring-red-800' : 'ring-gray-100 dark:ring-zinc-700'
                    } ${isSubtask ? 'ml-8 border-l-2 border-l-violet-300 dark:border-l-violet-700' : ''}`}
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                >
                  {/* Subtask indicator */}
                  {isSubtask && (
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2">
                      <CornerDownRight size={14} className="text-violet-400 dark:text-violet-600" />
                    </div>
                  )}

                  {/* Priority dot */}
                  <div className={`hidden sm:block h-10 w-1 shrink-0 rounded-full ${p.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {isSubtask && parentTask && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                          <CornerDownRight size={8} /> Subtask of: {parentTask.title?.substring(0, 15)}{parentTask.title?.length > 15 ? '...' : ''}
                        </span>
                      )}
                      <span className={`rounded-md px-2 py-0.5 text-base font-semibold uppercase ${p.bg} ${p.text}`}>{task.priority}</span>
                      <span className={`rounded-md px-2 py-0.5 text-base font-medium ${STATUS_BADGE[task.status] || STATUS_BADGE.TODO}`}>{task.status?.replace('_', ' ')}</span>
                      {task.category && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-base text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">{task.category.charAt(0) + task.category.slice(1).toLowerCase()}</span>}
                      {task.aiGenerated && <span className="flex items-center gap-0.5 rounded-md bg-violet-100 px-1.5 py-0.5 text-base text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"><Sparkles size={9} />AI</span>}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{task.title}</h3>
                    {task.description && <p className="text-base text-gray-500 dark:text-gray-400 truncate mt-0.5">{task.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      {due && (
                        <span className={`flex items-center gap-1 text-base font-medium ${due.overdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                          <CalendarClock size={11} />{due.text}
                        </span>
                      )}
                      {task.estimatedMinutes && <span className="flex items-center gap-1 text-base text-gray-400"><Clock size={10} />{task.estimatedMinutes}m</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-60 transition-opacity group-hover:opacity-100">
                    {task.status !== 'COMPLETED' && task.status !== 'SKIPPED' && (
                      <>
                        {task.status === 'TODO' && (
                          <button onClick={() => handleStartProgress(task)} title="Start Progress" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"><Play size={17} /></button>
                        )}
                        <button onClick={() => setCompleteTarget(task)} title="Complete" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"><CheckCircle2 size={17} /></button>
                        <button onClick={() => setSkipTarget(task)} title="Skip" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30"><SkipForward size={17} /></button>
                      </>
                    )}
                    <button onClick={() => handleEdit(task)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30"><Edit2 size={17} /></button>
                    <button onClick={() => setDeleteTarget(task)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"><Trash2 size={17} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <NewTaskModal open={modalOpen} onClose={handleCloseModal} initial={editTask} />
      <CompleteTaskModal open={!!completeTarget} onClose={() => { setCompleteTarget(null); refreshAll(); }} task={completeTarget} />
      <SkipTaskModal open={!!skipTarget} onClose={() => { setSkipTarget(null); refreshAll(); }} task={skipTarget} />
      <MagicSyncModal open={magicSyncOpen} onClose={() => setMagicSyncOpen(false)} onSynced={refreshAll} />

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div onClick={() => setDeleteTarget(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800 animate-scale-in">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Delete Task</h3>
            <p className="mt-2 text-center text-base text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong className="text-gray-700 dark:text-gray-200">{deleteTarget.title}</strong>? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-base font-medium text-white transition-all hover:bg-red-700 active:scale-[0.97] disabled:opacity-50">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
