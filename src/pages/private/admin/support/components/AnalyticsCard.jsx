import React from 'react';

const AnalyticsCard = ({ title, value, icon: IconComponent, color, subtext, loading }) => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
        {subtext && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default AnalyticsCard;
