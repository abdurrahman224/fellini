import React, { useEffect, useState } from 'react';
import {
    Bell,
    Trash2,
    CheckCircle,
    CheckCheck,
    BarChart3,
} from 'lucide-react';
import DeleteConfirmationModal from './focus/Habits/components/DeleteConfirmationModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import AllPagination from '../../../components/common/AllPagination';
import {
    fetchNotifications,
    markAsRead,
    deleteNotification,
    deleteNotificationById,
    markNotificationReadById,
    markAllReadServer,
    markAllRead,
    clearAll,
    deleteAllNotifications,
} from '../../../features/notifications/notificationsSlice';

const Notifications = () => {
    const dispatch = useDispatch();
    const { items: notifications, loading, error } = useSelector((s) => s.notifications || { items: [], loading: false, error: null });
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const totalCount = notifications.length;
    const unreadCount = notifications.filter((n) => n.readAt === null).length;
    const readCount = totalCount - unreadCount;

    const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalCount, totalPages, currentPage]);

    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
    const pageItems = notifications.slice(indexOfFirstItem, indexOfLastItem);

    const handleDelete = (id) => {
        // dispatch server deletion thunk; show toast on success/failure
        dispatch(deleteNotificationById(id))
            .unwrap()
            .then(() => {
                toast.success('Notification deleted');
            })
            .catch(() => {
                toast.error('Failed to delete notification');
            });
    };
    const handleDeleteAll = () => {
        setDeleteAllModalOpen(true);
    };

    const confirmDeleteAll = () => {
        setDeleteAllModalOpen(false);
        dispatch(deleteAllNotifications())
            .unwrap()
            .then(() => toast.success('All notifications deleted'))
            .catch(() => toast.error('Failed to delete all notifications'));
    };

    const cancelDeleteAll = () => setDeleteAllModalOpen(false);
    const handleMarkAsRead = (id) => {
        dispatch(markNotificationReadById(id))
            .unwrap()
            .then(() => toast.success('Marked as read'))
            .catch(() => toast.error('Failed to mark as read'));
    };
    const handleMarkAllRead = () => {
        dispatch(markAllReadServer())
            .unwrap()
            .then(() => toast.success('All marked as read'))
            .catch(() => toast.error('Failed to mark all as read'));
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return isoString;
        }
    };

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <div className=" space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">

                            Notifications
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Stay updated with your streaks and system alerts.</p>
                    </div>

                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-purple-600 bg-white dark:bg-gray-900 border border-purple-200 dark:border-gray-800 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all as read
                            </button>
                        )}
                        {totalCount > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-2 px-4 py-2 text-base font-medium text-red-600 bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-800 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
                {/**status card  */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
                        <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600">{totalCount}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Total</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
                        <div className="flex-shrink-0 bg-violet-50 dark:bg-violet-900/10 rounded-lg p-3">
                            <Bell className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{unreadCount}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Unread</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
                        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                            <CheckCircle className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-500">{readCount}</div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Read</div>
                        </div>
                    </div>

                    <DeleteConfirmationModal
                        open={deleteAllModalOpen}
                        onClose={cancelDeleteAll}
                        onConfirm={confirmDeleteAll}
                        habitName={'all notifications'}
                        loading={false}
                    />
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            <p className="text-gray-500">Loading notifications...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            <p className="text-red-500">Failed to load notifications.</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-dashed">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No notifications found.</p>
                        </div>
                    ) : (
                        pageItems.map((n) => {
                            const isUnread = n.readAt === null;

                            return (
                                <div
                                    key={n.id}
                                    className={`group relative flex gap-4 p-5 rounded-xl border transition-all duration-200 ${isUnread
                                        ? 'bg-white dark:bg-gray-900 border-purple-500/50 shadow-sm'
                                        : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 '
                                        }`}
                                >
                                    {isUnread && <div className="absolute top-5 right-5 w-2 h-2 bg-purple-600 rounded-full animate-pulse md:hidden" />}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-base font-semibold ${isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {n.title}
                                                </h3>
                                                <p className="text-base text-gray-400 mt-0.5 mb-2 font-mono">{formatTime(n.sentAt)}</p>
                                            </div>

                                            <div className="flex items-center gap-2 pl-2">
                                                {isUnread && (
                                                    <button onClick={() => handleMarkAsRead(n.id)} title="Mark as Read" className="p-1.5 rounded-md text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(n.id)} title="Delete" className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className={`text-base leading-relaxed ${isUnread ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>{n.message}</p>

                                        {n.data && n.data.streak !== undefined && (
                                            <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-base font-medium text-gray-600 dark:text-gray-400">
                                                <BarChart3 className="w-3 h-3" />
                                                Streak: {n.data.streak} days
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {/* Pagination */}
                    {totalCount > ITEMS_PER_PAGE && (
                        <div className="mt-6">
                            <AllPagination
                                indexOfFirstItem={indexOfFirstItem}
                                indexOfLastItem={indexOfLastItem}
                                totalResults={totalCount}
                                handlePrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                currentPage={currentPage}
                                handleNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;