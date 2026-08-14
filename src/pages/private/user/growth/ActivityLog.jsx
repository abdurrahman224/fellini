import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getActivityLogs,
  selectActivities,
  selectActivityStats,
  selectActivityPagination,
  selectActivityFilters,
  selectActivityLoading,
  selectStatsLoading,
  setActivityFilter,
  clearActivityFilters,
  setPage,
} from '../../../../features/activityLog/activityLogSlice';
import ActivityStatsCards from './components/ActivityStatsCards';
import ActivityFilters from './components/ActivityFilters';
import ActivityTimeline from './components/ActivityTimeline';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ActivityLog = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectActivities);
  const stats = useSelector(selectActivityStats);
  const pagination = useSelector(selectActivityPagination);
  const filters = useSelector(selectActivityFilters);
  const loading = useSelector(selectActivityLoading);
  const statsLoading = useSelector(selectStatsLoading);

  // Calculate stats from activities if API doesn't provide them
  const calculatedStats = useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        totalActivities: 0,
        aiChats: 0,
        totalTokens: 0,
        plansCreated: 0,
      };
    }

    const aiChats = activities.filter((a) => a.type === 'AI_CHAT').length;
    const plansCreated = activities.filter((a) => a.type === 'PLAN_CREATED').length;
    const totalTokens = activities.reduce((sum, a) => {
      return sum + (a.metadata?.tokensUsed || 0);
    }, 0);

    return {
      totalActivities: pagination.total || activities.length,
      aiChats,
      totalTokens,
      plansCreated,
    };
  }, [activities, pagination.total]);

  // Use calculated stats if API stats are not available
  const displayStats = stats.totalActivities > 0 ? stats : calculatedStats;

  useEffect(() => {
    dispatch(
      getActivityLogs({
        page: pagination.currentPage,
        limit: pagination.limit,
        type: filters.type,
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
    );
  }, [dispatch, filters, pagination.currentPage, pagination.limit]);

  const handleFilterChange = (newFilters) => {
    dispatch(setActivityFilter(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearActivityFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const canGoPrevious = pagination.currentPage > 1;
  const canGoNext = pagination.currentPage < totalPages;

  return (
    <div className="min-h-screen bg-[#EEEEEE] p-4 sm:p-6 lg:p-8 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          Activity Log
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Track your productivity journey and AI usage
        </p>
      </div>

      {/* Stats Cards */}
      <ActivityStatsCards stats={displayStats} loading={statsLoading} />

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline */}
      <ActivityTimeline activities={activities} loading={loading} />

      {/* Pagination */}
      {!loading && activities.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row dark:border-gray-700 dark:bg-zinc-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {pagination.offset + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.min(pagination.offset + pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span>{' '}
            activities
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      pagination.currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!canGoNext}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && activities.length === 0 && (filters.type !== 'ALL' || filters.startDate || filters.endDate) && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-zinc-800">
          <p className="text-gray-600 dark:text-gray-400">
            No activities found matching your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
