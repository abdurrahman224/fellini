import { Calendar, Clock, TrendingUp, Edit2, Trash2, Sparkles } from 'lucide-react';

export default function WeeklyPlanCard({ plan, onView, onEdit, onDelete, formatDateRange }) {
    return (
        <div
            onClick={() => onView(plan)}
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
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(plan);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(plan);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
