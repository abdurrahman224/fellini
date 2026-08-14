import React from 'react';
import { CircleAlert } from 'lucide-react';

export default function AIInsight() {
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 mb-8 shadow-sm border-l-[6px] border-[#8B5CF6] flex items-start gap-4">
            <CircleAlert size={24} className="text-[#8B5CF6] mt-0.5 shrink-0" />
            <div>
                <h3 className="text-[#8B5CF6] font-bold text-sm uppercase mb-1 tracking-wide">AI Strategic Insight</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "Overall a highly productive week with strong alignment to quarterly goals, though energy levels fluctuated due to irregular sleep patterns."
                </p>
            </div>
        </div>
    );
}
