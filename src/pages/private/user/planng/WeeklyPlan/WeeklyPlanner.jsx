
import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Target, Zap, BarChart,
  CircleAlert, Check, Edit2, Trash2, Sparkles, Send, Calendar, Clock, TrendingUp
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeeklyPlans } from '../../../../../features/plans/plansSlice';
import axiosInstance from '../../../../../services/axiosInstance';
import { toast } from 'react-toastify';

import WeeklyPlanModal from './components/WeeklyPlanModal';
import AIPlanModal from './components/AIPlanModal';
import WeeklyPlanDetailModal from './components/WeeklyPlanDetailModal';

export default function WeeklyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, title: '' });
  const [viewingPlan, setViewingPlan] = useState(null);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Lock navigation to the current month
  const [baseMonth] = useState(new Date().getMonth());
  const [baseYear] = useState(new Date().getFullYear());

  const dispatch = useDispatch();
  const { weeklyItems: plans } = useSelector((state) => state.plans || { weeklyItems: [], loading: false });

  useEffect(() => {
    dispatch(fetchWeeklyPlans());
  }, [dispatch]);

  // Standard Plan Modal Handlers
  const handleOpenModal = (date = null, plan = null) => {
    setSelectedDate(date);
    setSelectedPlan(plan || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const handleSavePlan = (data) => {
    // Redux automatically updates state; manual dispatch removed
  };

  // AI Modal Handlers
  const openAIModal = () => {
    setIsAIModalOpen(true);
    setAiPrompt('');
  };

  const closeAIModal = () => {
    if (isGenerating) return;
    setIsAIModalOpen(false);
  };

  // Detail Modal Handlers
  const openDetailModal = (plan) => {
    setViewingPlan(plan);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingPlan(null);
  };

  // Helper to check done status (case-insensitive)
  const isPlanDone = (plan) => String(plan?.status || '').toUpperCase() === 'DONE';

  // Task Toggling
  const toggleTask = async (id) => {
    const plan = plans.find((p) => (p.id ?? p._id) === id);
    if (!plan) return;
    const newStatus = plan.status === 'TODO' ? 'DONE' : 'TODO';
    try {
      const res = await axiosInstance.put(`/api/v1/weekly-plans/${plan.id ?? plan._id}`, { status: newStatus });
      const message = res?.data?.message || 'Status updated';
      toast.success(message);
      // Refresh weekly plans after status update
      dispatch(fetchWeeklyPlans());
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  // Delete Handlers
  const deletePlan = (id, title = '') => {
    setDeleteTarget({ id, title });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const id = deleteTarget.id;
    if (!id) return;
    try {
      await axiosInstance.delete(`/api/v1/ai/weekly/${id}`);
      toast.success('Plan deleted');
      setIsDeleteModalOpen(false);
      setDeleteTarget({ id: null, title: '' });
      // Refresh weekly plans after deletion
      dispatch(fetchWeeklyPlans());
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Delete failed';
      toast.error(msg);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget({ id: null, title: '' });
  };

  // AI Generation Handler
  const handleAiGenerate = async (weekStartDate) => {
    if (!aiPrompt.trim() || !weekStartDate) return;
    setIsGenerating(true);

    try {
      // Server expects `userInput` and `weekStartDate` at this endpoint
      const payload = {
        userInput: aiPrompt,
        weekStartDate,
      };

      const res = await axiosInstance.post('/api/v1/ai/generate/weekly', payload);

      // Prefer server message; fallback to generic
      const message = res?.data?.message || (res?.data?.success ? 'AI generation requested' : 'Request sent');
      toast.success(message);
      setAiPrompt('');
      setIsAIModalOpen(false);
      // Refresh weekly plans from the updated endpoint
      dispatch(fetchWeeklyPlans());
    } catch (error) {
      // Try to extract helpful server error info
      const serverData = error?.response?.data;
      console.error('AI image error:', serverData || error.message || error);
      const serverMsg = serverData?.error || serverData?.message || (typeof serverData === 'string' ? serverData : null);
      const msg = serverMsg || error?.message || 'Failed to post image request';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Week Logic Utilities
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(startOfWeek);
      dt.setDate(dt.getDate() + i);
      return dt;
    });
  }, [startOfWeek]);

  const monthName = (d) => d.toLocaleString(undefined, { month: 'short' });
  const dateRange = useMemo(() => {
    return `${monthName(weekDates[0])} ${weekDates[0].getDate()} - ${monthName(weekDates[6])} ${weekDates[6].getDate()}`;
  }, [weekDates]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    if (newDate.getMonth() !== baseMonth || newDate.getFullYear() !== baseYear) return;
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    if (newDate.getMonth() !== baseMonth || newDate.getFullYear() !== baseYear) return;
    setCurrentDate(newDate);
  };

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const getPlansForDate = (date) => {
    return plans.filter((p) => {
      const startDateField = p.startDate || p.weekStartDate;
      if (!startDateField) return false;
      const start = new Date(startDateField);
      return isSameDay(date, start);
    });
  };

  // Format date range for display
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${endDate.getFullYear()}`;
  };

  // Format markdown-style content for display
  const formatContent = (content) => {
    if (!content) return '';
    return content
      .replace(/##\s+(.+)/g, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-100">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  // Render content with interactive task checkboxes
  const renderContentWithTasks = (content, planId) => {
    if (!content) return null;

    const lines = content.split('\n');
    let taskIndex = 0;

    return lines.map((line, lineIndex) => {
      // Check if line is a task item (starts with - )
      const taskMatch = line.match(/^-\s+(.+)$/);

      if (taskMatch) {
        const taskText = taskMatch[1];
        const currentTaskIndex = taskIndex++;
        const taskId = `${planId}-task-${currentTaskIndex}`;
        const isCompleted = completedTasks[taskId] || false;

        return (
          <div key={lineIndex} className="flex items-start gap-3 my-2 group">
            <button
              onClick={() => toggleTaskCompletion(taskId)}
              className={`flex items-center justify-center h-5 w-5 mt-0.5 shrink-0 rounded border-2 transition-all ${isCompleted
                ? 'bg-violet-500 border-violet-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500'
                }`}
            >
              {isCompleted && (
                <Check size={14} className="text-white" />
              )}
            </button>
            <span
              className={`flex-1 text-sm leading-relaxed ${isCompleted
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300'
                }`}
              dangerouslySetInnerHTML={{
                __html: taskText
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
              }}
            />
          </div>
        );
      }

      // Handle headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIndex} className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100">
            {line.replace('## ', '')}
          </h2>
        );
      }

      // Handle bold text and regular paragraphs
      if (line.trim()) {
        return (
          <p
            key={lineIndex}
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed my-2"
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
            }}
          />
        );
      }

      // Empty line
      return <div key={lineIndex} className="h-2" />;
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="bg-[#EEEEEE] dark:bg-zinc-900 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Header Title */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Weekly Plan</h1>
        </div>

        {/* Navigation & Metrics Section */}
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">

          {/* 1. Date Navigation */}
          <div className="flex items-center justify-between sm:justify-start gap-2 md:gap-4 w-full xl:w-auto order-2 xl:order-1">
            {(() => {
              const startOfMonth = new Date(baseYear, baseMonth, 1);
              const endOfMonth = new Date(baseYear, baseMonth + 1, 0);
              const canPrev = weekDates[0] > startOfMonth;
              const canNext = weekDates[6] < endOfMonth;
              return (
                <>
                  <button
                    onClick={canPrev ? handlePrevWeek : undefined}
                    disabled={!canPrev}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  >
                    <ChevronLeft className={`h-5 w-5 md:h-6 md:w-6 ${canPrev ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`} />
                  </button>
                  <span className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-100 min-w-[140px] text-center">
                    {dateRange}
                  </span>
                  <button
                    onClick={canNext ? handleNextWeek : undefined}
                    disabled={!canNext}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  >
                    <ChevronRight className={`h-5 w-5 md:h-6 md:w-6 ${canNext ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`} />
                  </button>
                </>
              );
            })()}
          </div>

          {/* 2. Metrics Cards */}
          <div className="w-full xl:flex-1 xl:flex xl:justify-center order-1 xl:order-2">
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3 w-full sm:w-auto justify-center">

            </div>
          </div>

          {/* 3. Action Buttons (AI & Add Plan) */}
          <div className="w-full xl:w-auto flex items-center justify-end gap-3 order-3">
            {/* New AI Trigger Button */}
            <button
              onClick={openAIModal}
              className="group relative flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-zinc-700 px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-600 transition-all hover:shadow-md hover:text-[#7C3AED] dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
            >
              <Sparkles size={18} className="text-[#7C3AED] dark:text-violet-400 transition-transform group-hover:scale-110" />
              <span>AI Assist</span>
            </button>

            {/* Existing Add Plan Button */}
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-md transition-colors"
            >
              <Plus size={18} />
              <span>Add Plan</span>
            </button>
          </div>
        </div>

        {/* AI Strategic Insight Summary */}
        <div className="mb-6 rounded-xl bg-white dark:bg-zinc-600 p-4 shadow-sm border-l-4 border-[#7C3AED]">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-zinc-700">
              <CircleAlert size={20} className="text-[#7C3AED] dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-bold text-[#7C3AED] dark:text-violet-400 tracking-wide">AI STRATEGIC INSIGHT</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                “Overall a highly productive week with strong alignment to quarterly goals, though energy levels fluctuated due to irregular sleep patterns.”
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Plans Display - Compact Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Target size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Weekly Plans Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first weekly plan using AI assistance or manually</p>
              <button
                onClick={openAIModal}
                className="flex items-center gap-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors"
              >
                <Sparkles size={18} />
                <span>Generate with AI</span>
              </button>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => openDetailModal(plan)}
                className="group relative rounded-xl bg-white dark:bg-zinc-800 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-zinc-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-t-4 border-t-violet-500"
              >

                {/* Card Content */}
                <div className="p-5">
                  {/* Title & AI Badge */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                      {plan.title}
                    </h3>
                    {plan.aiGenerated && (
                      <span className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 p-1.5">
                        <Sparkles size={14} className="text-violet-600 dark:text-violet-400" />
                      </span>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar size={16} className="text-violet-500" />
                    <span className="font-medium">{formatDateRange(plan.weekStartDate, plan.weekEndDate)}</span>
                  </div>

                  {/* Status & Progress */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${plan.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      <TrendingUp size={12} />
                      {plan.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>{plan.completionRate || 0}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mb-4">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${plan.completionRate || 0}%` }}
                    ></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-700">
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(new Date(plan.weekStartDate), plan);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button> */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id, plan.title);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AIPlanModal
        open={isAIModalOpen}
        onClose={closeAIModal}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        isGenerating={isGenerating}
        onGenerate={handleAiGenerate}
      />



      <WeeklyPlanDetailModal
        isOpen={isDetailModalOpen}
        plan={viewingPlan}
        onClose={closeDetailModal}
        onEdit={(plan) => handleOpenModal(new Date(plan.weekStartDate), plan)}
        onDelete={(plan) => deletePlan(plan.id, plan.title)}
        formatDateRange={formatDateRange}
      />

      {/* Delete Confirmation Modal (Existing) */}
      {isDeleteModalOpen && (
        <div onClick={cancelDelete} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity animate-in fade-in">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-2xl scale-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Plan</h3>
            </div>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleteTarget.title || 'this plan'}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="rounded-lg border border-gray-300 dark:border-zinc-600 px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 shadow-sm transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <WeeklyPlanModal
        open={isModalOpen}
        initialDate={selectedDate}
        initialPlan={selectedPlan}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
      />

    </div>
  );
}