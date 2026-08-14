import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Target, Zap, BarChart } from 'lucide-react';

export default function MonthlyHeader({ displayedDate, setDisplayedDate, onAddPlan }) {
    return (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
                <button onClick={() => setDisplayedDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 min-w-[180px] text-center">
                    {displayedDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                </h1>
                <button onClick={() => setDisplayedDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                    <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full xl:w-auto">
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl shadow-sm min-w-[140px]">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600">
                        <Target size={18} />
                    </div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Focus</p><p className="text-lg font-bold text-gray-800 dark:text-white">82%</p></div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl shadow-sm min-w-[140px]">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-500">
                        <Zap size={18} />
                    </div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Energy</p><p className="text-lg font-bold text-gray-800 dark:text-white">65%</p></div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl shadow-sm min-w-[140px]">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-500">
                        <BarChart size={18} />
                    </div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Alignment</p><p className="text-lg font-bold text-gray-800 dark:text-white">62%</p></div>
                </div>
            </div>

            <div className="w-full xl:w-auto flex justify-end">
                <button onClick={onAddPlan} className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all w-full xl:w-auto justify-center">
                    <Plus size={20} /> Add Plan
                </button>
            </div>
        </div>
    );
}
