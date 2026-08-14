import { useState } from 'react';
import { Calendar, Clock, TrendingUp, Edit2, Trash2, Sparkles, Target, Zap, Check } from 'lucide-react';

export default function WeeklyPlanDetailModal({
    isOpen,
    plan,
    onClose,
    onEdit,
    onDelete,
    formatDateRange
}) {
    const [completedTasks, setCompletedTasks] = useState({});

    if (!isOpen || !plan) return null;

    // Toggle task completion
    const toggleTaskCompletion = (taskId) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
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

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity animate-in fade-in">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
                {/* Modal Header */}
                <div className="bg-violet-600 p-4 md:p-6">
                    <div className="flex items-start justify-between gap-2 md:gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <h2 className="text-lg md:text-xl font-bold text-white">{plan.title}</h2>
                                {/* {plan.aiGenerated && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                                        <Sparkles size={12} />
                                        AI Generated
                                    </span>
                                )} */}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar size={16} />
                                    {formatDateRange(plan.weekStartDate, plan.weekEndDate)}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                                    <TrendingUp size={14} />
                                    {plan.status}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock size={16} />
                                    {plan.completionRate || 0}% Complete
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-280px)] md:max-h-[calc(90vh-240px)] p-4 md:p-6">
                    <div className="max-w-none">
                        {renderContentWithTasks(plan.content, plan.id)}
                    </div>

                    {/* Footer Info */}
                    {(plan.weeklyGoals || plan.focusAreas?.length > 0) && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {plan.weeklyGoals && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Target size={16} className="text-violet-500" />
                                            Weekly Goals
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{plan.weeklyGoals}</p>
                                    </div>
                                )}
                                {plan.focusAreas?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Zap size={16} className="text-violet-500" />
                                            Focus Areas
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {plan.focusAreas.map((area, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block rounded-full bg-violet-100 dark:bg-violet-900/30 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300"
                                                >
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2 md:gap-3 p-3 md:p-6 bg-gray-50 dark:bg-zinc-700/50 border-t border-gray-200 dark:border-zinc-700">
                    {/* <button
                        onClick={() => {
                            onClose();
                            onEdit(plan);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                    >
                        <Edit2 size={16} />
                        Edit Plan
                    </button> */}
                    <button
                        onClick={() => {
                            onClose();
                            onDelete(plan);
                        }}
                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <Trash2 size={14} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Delete Plan</span>
                        <span className="sm:hidden">Delete</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
