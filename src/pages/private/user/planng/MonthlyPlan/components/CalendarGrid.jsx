import React from 'react';

export default function CalendarGrid({ days, weekDays, handleDateClick }) {
    return (
        <>
            {/* Headers */}
            <div className="grid grid-cols-7 mb-2 sm:mb-4">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border-t border-l border-gray-100 dark:border-zinc-700">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={`
                            /* Base Styles */
                            relative border-r border-b border-gray-100 dark:border-zinc-700
                            transition-colors
                            
                            /* Mobile Specific: Square Aspect Ratio & Small Padding */
                            aspect-square p-1

                            /* Tablet & Desktop: Auto Aspect Ratio & Fixed Height */
                            sm:aspect-auto sm:min-h-[100px] lg:min-h-[130px] sm:p-3

                            ${!day.date
                                ? 'bg-gray-50/30 dark:bg-zinc-900/30'
                                : 'bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer'}
                        `}
                        // onClick={() => handleDateClick(day.date)}
                    >
                        {day.date && (
                            <span className="text-[10px] sm:text-sm font-bold text-gray-800 dark:text-gray-200 block">
                                {String(day.date).padStart(2, '0')}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
