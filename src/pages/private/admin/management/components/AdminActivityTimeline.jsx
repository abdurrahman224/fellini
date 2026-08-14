import React from 'react';
import {
  ChevronRight,
  MessageSquare,
  Calendar,
  Target,
  RotateCcw,
  CheckSquare,
  CreditCard,
  DollarSign,
  XCircle,
  Lightbulb,
  Settings,
  Lock,
  Mail,
  LogIn,
  LogOut,
  Edit,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

const AdminActivityTimeline = ({ activities, loading, onViewUserDetails }) => {
  // Date helper functions
  const isToday = (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    return (
      activityDate.getDate() === today.getDate() &&
      activityDate.getMonth() === today.getMonth() &&
      activityDate.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activityDate = new Date(date);
    return (
      activityDate.getDate() === yesterday.getDate() &&
      activityDate.getMonth() === yesterday.getMonth() &&
      activityDate.getFullYear() === yesterday.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
    return daysDiff < 7 && daysDiff >= 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    if (isThisWeek(dateString)) return getDayName(dateString);
    return formatDate(dateString);
  };

  // Flatten activities from the new API structure
  const flattenedActivities = activities.flatMap(userGroup => 
    userGroup.activityLogs.map(activity => ({
      ...activity,
      user: userGroup.user
    }))
  );

  // Sort activities by date (newest first)
  const sortedActivities = flattenedActivities.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Group activities by date
  const groupedActivities = sortedActivities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  // Sort dates (newest first) and group by user within each date
  const sortedGroupedActivities = Object.entries(groupedActivities)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .reduce((acc, [date, activities]) => {
      // Sort activities within each date group (newest first)
      const sortedActivities = activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Group by user within this date
      const userGroups = sortedActivities.reduce((userAcc, activity) => {
        const userId = activity.user?.id || 'unknown';
        if (!userAcc[userId]) {
          userAcc[userId] = {
            user: activity.user,
            activities: []
          };
        }
        userAcc[userId].activities.push(activity);
        return userAcc;
      }, {});
      
      acc[date] = Object.values(userGroups);
      return acc;
    }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-zinc-800">
        <p className="text-gray-500 dark:text-gray-400">No activities to display</p>
      </div>
    );
  }

  if (flattenedActivities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-zinc-800">
        <p className="text-gray-500 dark:text-gray-400">No activities to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(sortedGroupedActivities).map(([date, userGroups]) => {
        const totalActivities = userGroups.reduce((sum, group) => sum + group.activities.length, 0);
        
        return (
          <div
            key={date}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getDateLabel(userGroups[0].activities[0].createdAt)}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
              </span>
            </div>

            <div className="space-y-4">
              {userGroups.map((userGroup) => (
                <AdminUserActivityGroup
                  key={userGroup.user?.id || Math.random()}
                  user={userGroup.user}
                  activities={userGroup.activities}
                  onViewUserDetails={onViewUserDetails}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Admin User Activity Group Component - Shows all activities for a user
const AdminUserActivityGroup = ({ user, activities, onViewUserDetails }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
      {/* User Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.fullName || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => onViewUserDetails && onViewUserDetails(user?.id, user)}
          className="flex items-center gap-1 text-sm font-medium text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          View User Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Admin Activity Item Component
const AdminActivityItem = ({ activity }) => {
  const formatDistanceToNow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getActivityColors = (type) => {
    const colorMap = {
      AI_CHAT: {
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
      },
      PLAN_CREATED: {
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        bg: 'bg-green-50 dark:bg-green-900/30',
        icon: 'text-green-600 dark:text-green-400',
      },
      PLAN_UPDATED: {
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        bg: 'bg-green-50 dark:bg-green-900/30',
        icon: 'text-green-600 dark:text-green-400',
      },
      PLAN_COMPLETED: {
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        bg: 'bg-green-50 dark:bg-green-900/30',
        icon: 'text-green-600 dark:text-green-400',
      },
      GOAL_CREATED: {
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
      },
      GOAL_COMPLETED: {
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
      },
      TASK_CREATED: {
        border: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        icon: 'text-orange-600 dark:text-orange-400',
      },
      TASK_COMPLETED: {
        border: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        icon: 'text-orange-600 dark:text-orange-400',
      },
      SUBSCRIPTION_STARTED: {
        border: 'border-indigo-200 dark:border-indigo-800',
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
      },
      PAYMENT_SUCCEEDED: {
        border: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
      },
      PAYMENT_FAILED: {
        border: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        bg: 'bg-red-50 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
      },
    };

    return (
      colorMap[type] || {
        border: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
        bg: 'bg-gray-50 dark:bg-gray-900/30',
        icon: 'text-gray-600 dark:text-gray-400',
      }
    );
  };

  const getActivityLabel = (type) => {
    const labels = {
      AI_CHAT: 'AI Chat',
      USER_LOGIN: 'Login',
      USER_LOGOUT: 'Logout',
      PLAN_CREATED: 'Plan Created',
      PLAN_UPDATED: 'Plan Updated',
      PLAN_COMPLETED: 'Plan Completed',
      HABIT_CREATED: 'Habit Created',
      HABIT_COMPLETED: 'Habit Completed',
      TASK_CREATED: 'Task Created',
      TASK_COMPLETED: 'Task Completed',
      GOAL_CREATED: 'Goal Created',
      GOAL_COMPLETED: 'Goal Completed',
      SUBSCRIPTION_STARTED: 'Subscription Started',
      SUBSCRIPTION_CANCELED: 'Subscription Canceled',
      SUBSCRIPTION_UPGRADED: 'Subscription Upgraded',
      SUBSCRIPTION_DOWNGRADED: 'Subscription Downgraded',
      PAYMENT_SUCCEEDED: 'Payment Success',
      PAYMENT_FAILED: 'Payment Failed',
      AI_RECOMMENDATION: 'AI Recommendation',
      SETTINGS_UPDATED: 'Settings Updated',
      PASSWORD_CHANGED: 'Password Changed',
      EMAIL_VERIFIED: 'Email Verified',
    };
    return labels[type] || type;
  };

  const renderIcon = (type, colors) => {
    const iconClass = `h-5 w-5 ${colors.icon}`;

    // Handle undefined or null type
    if (!type) return <TrendingUp className={iconClass} />;

    // Auth
    if (type === 'USER_LOGIN') return <LogIn className={iconClass} />;
    if (type === 'USER_LOGOUT') return <LogOut className={iconClass} />;

    // Plans
    if (type === 'PLAN_CREATED') return <Calendar className={iconClass} />;
    if (type === 'PLAN_UPDATED') return <Edit className={iconClass} />;
    if (type === 'PLAN_COMPLETED') return <CheckCircle className={iconClass} />;

    // Habits
    if (type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') return <RotateCcw className={iconClass} />;

    // Tasks
    if (type === 'TASK_CREATED' || type === 'TASK_COMPLETED') return <CheckSquare className={iconClass} />;

    // Goals
    if (type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') return <Target className={iconClass} />;

    // Subscriptions
    if (type.startsWith('SUBSCRIPTION_')) return <CreditCard className={iconClass} />;

    // Payments
    if (type === 'PAYMENT_SUCCEEDED') return <DollarSign className={iconClass} />;
    if (type === 'PAYMENT_FAILED') return <XCircle className={iconClass} />;

    // AI
    if (type === 'AI_CHAT') return <MessageSquare className={iconClass} />;
    if (type === 'AI_RECOMMENDATION') return <Lightbulb className={iconClass} />;

    // Settings
    if (type === 'SETTINGS_UPDATED') return <Settings className={iconClass} />;
    if (type === 'PASSWORD_CHANGED') return <Lock className={iconClass} />;
    if (type === 'EMAIL_VERIFIED') return <Mail className={iconClass} />;

    // Default
    return <TrendingUp className={iconClass} />;
  };

  const colors = getActivityColors(activity.type);

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-zinc-700/50 dark:hover:bg-zinc-700">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`shrink-0 rounded-lg ${colors.bg} p-2`}>
          {renderIcon(activity.type, colors)}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Activity Description */}
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {activity.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
            {activity.metadata?.tokensUsed && (
              <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 dark:bg-zinc-800">
                ⚡ {activity.metadata.tokensUsed.toLocaleString()} tokens
              </span>
            )}
            {activity.metadata?.conversationId && (
              <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 dark:bg-zinc-800">
                💬 ID: {activity.metadata.conversationId.slice(0, 8)}...
              </span>
            )}
            {activity.metadata?.planId && (
              <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 dark:bg-zinc-800">
                📋 Plan: {activity.metadata.planId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Badge & Time */}
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
            {getActivityLabel(activity.type)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityTimeline;
