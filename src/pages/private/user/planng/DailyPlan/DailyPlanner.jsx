import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Trash,
  Edit3,
  SquarePen,
  RefreshCw,
} from 'lucide-react';
import ResetMyDayModal from '../../../../../components/ui/ResetDayModal';
import DailyPlanModal from './components/DailyPlanModal';

import { useDispatch /*, useSelector */ } from 'react-redux';
import { /* fetchDailyPlans, */ updatePlan } from '../../../../../features/plans/plansSlice';
import axiosInstance from '../../../../../services/axiosInstance';
import { toast } from 'react-toastify';

export default function DailyPlanner() {
  const [modle, setModle] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    // Insert created plan into list so UI updates immediately
    if (!data) return;
  };
  // Current visible date (start of day)
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const changeDate = (days) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  };
  // toggle task by updating the plans array (API-backed)
  const dispatch = useDispatch();
  // previous Redux-based daily plans are commented out per request
  // const { dailyItems: plans } = useSelector((state) => state.plans || { dailyItems: [], loading: false, error: null });
  // provide a safe fallback so legacy references to `plans` don't crash the UI
  const plans = [];

  // Fetch today's plan directly from API and show it in the UI
  const [todayPlan, setTodayPlan] = useState(null);
  const [loadingTodayPlan, setLoadingTodayPlan] = useState(true);

  const fetchToday = async () => {
    try {
      setLoadingTodayPlan(true);
      const res = await axiosInstance.get('/api/v1/daily-plans/today');
      // API shape: { success: true, data: { ... } }
      const data = res?.data?.data ?? res?.data;
      console.log('GET /api/v1/daily-plans/today full response ->', res);
      console.log('GET /api/v1/daily-plans/today data ->', res?.data ?? res);
      setTodayPlan(data || null);
    } catch (err) {
      console.error('fetch today plan error', err);
      // console.log('GET /api/v1/daily-plans/today error response ->', err?.response ?? err);
      // console.log('GET /api/v1/daily-plans/today error data ->', err?.response?.data ?? null);

      // Don't show error toast for 404 (no plan found) - this is normal for new users
      if (err?.response?.status !== 404) {
        toast.error('Failed to load today plan');
      }

      // Set todayPlan to null when no plan exists
      setTodayPlan(null);
    } finally {
      setLoadingTodayPlan(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  // Plans that fall on the selected currentDate
  const plansForDate = plans.filter((p) => {
    if (!p?.startDate) return false;
    const pd = new Date(p.startDate);
    return (
      pd.getFullYear() === currentDate.getFullYear() &&
      pd.getMonth() === currentDate.getMonth() &&
      pd.getDate() === currentDate.getDate()
    );
  });

  const toggleTask = (id) => {
    if (!plans?.length) return;
    const plan = plans.find((p) => p.id === id || p._id === id);
    if (!plan) {
      console.debug('toggleTask: plan not found for id', id, {
        availableIds: plans.map((p) => p.id ?? p._id),
      });
      return;
    }
    const newStatus = plan.status === 'TODO' ? 'DONE' : 'TODO';
    const targetId = plan.id ?? plan._id ?? id;
    console.debug('toggleTask:', { targetId, newStatus });
    dispatch(updatePlan({ id: targetId, payload: { status: newStatus } }));
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      // DELETE daily plan endpoint
      const res = await axiosInstance.delete(`/api/v1/daily-plans/${id}`);
      toast.success(res?.data?.message || 'Deleted successfully');
      // Refresh plans to reflect server-side changes
      dispatch(fetchDailyPlans());
    } catch (err) {
      console.error('handleDeleteImage error', err);
      const msg = err?.response?.data?.message || 'Failed to delete plan';
      toast.error(msg);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const openEditModal = (id) => {
    const plan = plans.find((p) => (p.id ?? p._id) === id || p._id === id || p.id === id);
    if (!plan) return;
    setEditInitial(plan);
    setEditOpen(true);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setConfirmOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await handleDelete(deleteTarget);
    } finally {
      setDeleteTarget(null);
      setConfirmOpen(false);
    }
  };

  // Map API plans to scheduleItems and tasks
  const scheduleFromPlans = plansForDate
    .slice()
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      time: p.startDate
        ? new Date(p.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      tag: p.category,
      priority: p.priority,
    }));

  const tasksFromPlans = plansForDate.map((p, idx) => ({
    id: p.id ?? p._id ?? idx,
    title: p.title,
    time: p.startDate
      ? new Date(p.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    done: p.status && p.status !== 'TODO',
    tag: p.category || 'GENERAL',
    tagStyle:
      p.category === 'HEALTH'
        ? 'bg-green-100 text-green-600'
        : p.category === 'WORK'
          ? 'bg-blue-100 text-blue-600'
          : 'bg-gray-100 text-gray-600',
  }));

  // By default render from API's todayPlan if available; otherwise fall back to previous mapping
  let scheduleItemsToRender = [];
  let tasksToRender = [];

  if (todayPlan) {
    // Parse content to extract time-based schedule items
    const parseScheduleFromContent = (content) => {
      if (!content) return [];

      // Match patterns like "07:00 - 08:30: Activity" with proper capture groups
      const timePattern = /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})\s*:\s*([^\n]+)/g;
      const matches = [];
      let match;

      while ((match = timePattern.exec(content)) !== null) {
        const startTime = match[1];
        const endTime = match[2];
        const activity = match[3].trim();

        if (activity) {
          matches.push({
            id: `schedule-${matches.length}`,
            time: startTime,
            endTime: endTime,
            title: activity,
            description: `${startTime} - ${endTime}`,
            tag: '',
            priority: '',
          });
        }
      }

      return matches;
    };

    scheduleItemsToRender = parseScheduleFromContent(todayPlan.content);

    // If parsing failed or no items found, show the plan as a single item
    if (scheduleItemsToRender.length === 0) {
      scheduleItemsToRender = [
        {
          id: todayPlan.id || todayPlan._id,
          title: todayPlan.title || `Daily Plan - ${currentDate.toLocaleDateString()}`,
          description: todayPlan.content || '',
          time: '07:00',
          tag: '',
          priority: '',
        },
      ];
    }

    // build tasks list from morning/afternoon/evening fields if present
    const makeTasks = (label, text) => {
      if (!text) return [];

      // Return single task for each time period
      return [
        {
          id: `${label}-0`,
          title: String(text),
          time: '',
          done: false,
          tag: label,
          tagStyle:
            label === 'Morning'
              ? 'bg-blue-100 text-blue-600'
              : label === 'Afternoon'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-indigo-100 text-indigo-600',
        },
      ];
    };

    tasksToRender = [
      ...makeTasks(
        'Morning',
        todayPlan.morningRoutine || todayPlan.morningTasks || todayPlan.morning
      ),
      ...makeTasks('Afternoon', todayPlan.afternoonTasks || todayPlan.afternoon),
      ...makeTasks('Evening', todayPlan.eveningRoutine || todayPlan.evening),
    ];
  } else {
    scheduleItemsToRender = scheduleFromPlans;
    tasksToRender = tasksFromPlans;
  }

  // log processed data for debugging (shows in browser console)
  React.useEffect(() => {
    console.log('todayPlan processed ->', todayPlan);
    console.log('scheduleItemsToRender ->', scheduleItemsToRender);
    console.log('tasksToRender ->', tasksToRender);
  }, [todayPlan]);

  return (
    <div className="min-h-screen bg-[#EEEEEE] p-4 font-sans sm:p-6 lg:p-8 dark:bg-zinc-900">
      <div className="">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between md:mb-4">
          <h1 className="text-xl font-semibold sm:text-4xl dark:text-gray-100">Daily</h1>
          <div>
            <button
              onClick={() => setResetOpen(true)}
              aria-label="Reset My Day"
              className="flex items-center gap-2 rounded-lg border border-transparent bg-[#7C3AED] px-3 py-2 text-sm text-white dark:bg-sky-900/30"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="">Reset My Day</span>
            </button>
          </div>
        </div>

        {/* Date Bar */}
        {/* <div className="flex flex-col items-start justify-between gap-6 py-4 lg:flex-row lg:py-7.5">
          <div className="flex w-full items-center justify-center gap-4 lg:justify-start">
            <ChevronLeft onClick={() => changeDate(-1)} className="cursor-pointer text-[#141B34] dark:text-gray-300" />
            <div className="text-center">
              <h3 className="text-lg font-semibold sm:text-xl dark:text-gray-200">
                {plansForDate.length} Plans Scheduled
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <ChevronRight onClick={() => changeDate(1)} className="cursor-pointer text-[#141B34] dark:text-gray-100" />
          </div>

          <div className="flex w-full items-center justify-end gap-4">
            <button className="w-full rounded-lg border border-[#868686] px-5 py-3 text-sm font-semibold sm:w-auto dark:text-gray-100">
              Today
            </button>
            <button
              onClick={handleOpenModal}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-3.5 text-sm font-semibold text-white sm:w-auto"
            >
              <Plus size={18} /> Add Plan
            </button>
          </div>
        </div> */}

        {/* Body */}
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Schedule */}
          <div className="h-[640px] flex-1 overflow-hidden rounded-3xl bg-white p-4 shadow-sm sm:p-6 dark:bg-zinc-800">
            <div className="h-full space-y-6 overflow-y-auto pr-2">
              {scheduleItemsToRender.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">No plans for this day.</p>
                </div>
              )}

              {scheduleItemsToRender.map((item, i) => (
                <div
                  key={item.id || i}
                  className="flex flex-col gap-2 border-t-2 border-dashed border-gray-300 pt-6 sm:flex-row sm:items-center sm:gap-16 dark:border-gray-700"
                >
                  <span className="w-20 text-sm text-gray-600 dark:text-gray-300">{item.time}</span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between rounded-lg border-l-4 border-violet-600 bg-[#F0E6FF] p-4 dark:bg-[#5D5669]">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold dark:text-gray-100">{item.title}</h4>
                        {item.endTime && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                            {item.time} - {item.endTime}
                          </p>
                        )}
                      </div>
                      {item.endTime && (
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {item.endTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="flex h-[640px] w-full flex-col rounded-2xl bg-white p-4 shadow-sm sm:p-6 xl:w-120 dark:bg-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold sm:text-xl dark:text-gray-100">Tasks List</h3>
              <span className="rounded-lg bg-[#ece9ff] px-3 py-1 text-xs font-bold text-violet-600">
                {tasksToRender.length.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasksToRender.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">No plans</p>
                </div>
              )}

              {tasksToRender.map((t) => (
                <div
                  key={t.id}
                  className={`flex gap-3 rounded-xl p-4 transition-all ${
                    t.done ? 'bg-[#ece9ff] dark:bg-[#61585e]' : 'bg-pink-50 dark:bg-[#5d5669]'
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    onClick={() => toggleTask(t.id)}
                    className={`mt-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 transition-colors ${
                      t.done
                        ? 'border-[#5415a1] dark:border-[#6b0edd]'
                        : 'border-gray-300 dark:border-[#5d05c9]'
                    } `}
                  >
                    {t.done && (
                      <Check
                        size={14}
                        className="stroke-[3px] text-[#5415a1] dark:text-[#653a99]"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4
                      className={`text-base font-bold sm:text-lg ${
                        t.done
                          ? 'text-gray-600 line-through dark:text-gray-100 '
                          : 'text-slate-800 dark:text-gray-100'
                      }`}
                    >
                      {t.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-sm font-bold text-gray-400 dark:text-gray-600">
                        {t.time}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-sm font-bold ${t.tagStyle}`}>
                        {t.tag}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  {/* <div className="flex items-start gap-2">
                    {!t.done && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(t.id);
                        }}
                        title="Edit plan"
                        className="ml-2 rounded p-1 dark:text-white  text-gray-500 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-100"
                      >
                        <SquarePen size={18} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirm(t.id);
                      }}
                      title="Delete plan"
                      className="ml-2 rounded p-1 text-red-600 dark:text-white hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                    >
                      <Trash size={18} />
                    </button>
                  </div> */}
                </div>
              ))}
            </div>

            {/* AI prompt footer */}
            <div className="mt-4">
              <label className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-200">
                Generate with AI
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your monthly goal and let AI plan it."
                className="mb-3 h-20 w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300 dark:bg-zinc-700 dark:text-gray-100"
              />
              <button
                onClick={async () => {
                  if (!aiPrompt.trim()) {
                    toast.warning('Please enter a prompt');
                    return;
                  }
                  setIsGenerating(true);
                  try {
                    const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                    const response = await axiosInstance.post('/api/v1/ai/generate/daily', {
                      userInput: aiPrompt,
                      date: todayDate,
                    });
                    toast.success('AI plan generated successfully!');
                    console.log('AI Response:', response.data);
                    // Refresh today's plan after generation
                    const res = await axiosInstance.get('/api/v1/daily-plans/today');
                    setTodayPlan(res?.data?.data ?? res?.data);
                    setAiPrompt(''); // Clear the input
                  } catch (error) {
                    console.error('AI generation error:', error);
                    toast.error(error?.response?.data?.message || 'Failed to generate AI plan');
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#7C3AED] px-4 py-3 text-base text-white transition-colors hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <DailyPlanModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />
      <DailyPlanModal open={editOpen} mode="edit" initialData={editInitial} onClose={() => setEditOpen(false)} onSave={(data) => {
        // after edit, close and refresh UI
        setEditOpen(false);
        dispatch(fetchDailyPlans());
      }} /> */}
      <ResetMyDayModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onSuccess={() => {
          // Refresh today's plan after successful reset
          fetchToday();
        }}
      />
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
            <h3 className="text-lg font-bold dark:text-gray-100">Confirm delete</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this plan? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-md border border-gray-400 px-4 py-2 text-sm dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
