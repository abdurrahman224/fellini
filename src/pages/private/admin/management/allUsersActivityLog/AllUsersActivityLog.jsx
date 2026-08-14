import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminActivityLogs,
  selectAdminActivities,
  selectAdminActivityStats,
  selectAdminActivityPagination,
  selectAdminActivityFilters,
  selectAdminActivityLoading,
  setAdminActivityFilter,
  clearAdminActivityFilters,
  setAdminPage,
} from '../../../../../features/adminActivityLog/adminActivityLogSlice';
import AdminActivityStatsCards from '../components/AdminActivityStatsCards';
import AdminActivityFilters from '../components/AdminActivityFilters';
import AdminActivityTimeline from '../components/AdminActivityTimeline';
import UserActivityModal from '../components/UserActivityModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AllUsersActivityLog = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectAdminActivities);
  const stats = useSelector(selectAdminActivityStats);
  const pagination = useSelector(selectAdminActivityPagination);
  const filters = useSelector(selectAdminActivityFilters);
  const loading = useSelector(selectAdminActivityLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleViewUserDetails = (userId, user) => {
    setSelectedUserId(userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    dispatch(
      getAdminActivityLogs({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type,
        userId: filters.userId,
      })
    );
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handleFilterChange = (newFilters) => {
    dispatch(setAdminActivityFilter(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearAdminActivityFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setAdminPage(newPage));
  };

  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="min-h-screen bg-[#EEEEEE] p-4 sm:p-6 lg:p-8 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          All Users Activity Logs
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Monitor all user activities and system interactions
        </p>
      </div>

      {/* Stats Cards */}
      <AdminActivityStatsCards stats={stats} loading={loading} />

      {/* Filters */}
      <AdminActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline */}
      <AdminActivityTimeline
        activities={activities}
        loading={loading}
        onViewUserDetails={handleViewUserDetails}
      />

      {/* User Activity Modal */}
      <UserActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={selectedUserId}
        user={selectedUser}
      />

      {/* Pagination */}
      {!loading && activities.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row dark:border-gray-700 dark:bg-zinc-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing page{' '}
            <span className="font-medium text-gray-900 dark:text-white">{pagination.page}</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {pagination.totalPages}
            </span>{' '}
            ({pagination.total} total activities)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      pagination.page === pageNum
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
              onClick={() => handlePageChange(pagination.page + 1)}
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
      {!loading && activities.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-zinc-800">
          <p className="text-gray-600 dark:text-gray-400">
            No activities found. {filters.type !== 'ALL' && 'Try adjusting your filters.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllUsersActivityLog;
