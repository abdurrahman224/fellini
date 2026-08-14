import React from 'react';
import { Activity, MessageSquare, Zap, Calendar, Users } from 'lucide-react';

const AdminActivityStatsCards = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'AI Conversations',
      value: stats?.aiChats || 0,
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Tokens',
      value: (stats?.totalTokens || 0).toLocaleString(),
      icon: Zap,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Plans Created',
      value: stats?.plansCreated || 0,
      icon: Calendar,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className="mb-4 h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-2 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className={`mb-4 inline-flex rounded-lg p-3 ${card.bgColor}`}>
              <Icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminActivityStatsCards;
