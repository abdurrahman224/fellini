import React, { useState, useEffect } from 'react';
import { GET, PATCH } from '../../../services/httpMethods';
import { toast } from 'react-toastify';
import { Calendar, Clock, Pin, Info, AlertCircle, Star, CheckCircle, Circle } from 'lucide-react';

const Announcements = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, INFO, FEATURE, ALERT

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await GET('/api/v1/user/announcements');
            const notificationsData = response?.data?.notifications || [];
            setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        } catch (error) {
            toast.error('Failed to load announcements');
            console.error('Error fetching announcements:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await PATCH(`/api/v1/user/announcements/${notificationId}/read`);
            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true, readAt: new Date().toISOString() }
                        : notification
                )
            );
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to mark as read');
            console.error('Error marking as read:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'INFO':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'FEATURE':
                return <Star className="w-5 h-5 text-green-500" />;
            case 'ALERT':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'INFO':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
            case 'FEATURE':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
            case 'ALERT':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Ensure notifications is always an array before filtering
    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    const filteredNotifications = safeNotifications.filter(notification => {
        if (!notification.announcement) return false;
        if (filter === 'ALL') return true;
        return notification.announcement.type === filter;
    });

    const pinnedNotifications = filteredNotifications.filter(n => n.announcement?.isPinned);
    const regularNotifications = filteredNotifications.filter(n => !n.announcement?.isPinned);

    if (loading) {
        return (
            <div className="p-4 sm:p-6">
                <div className="animate-pulse space-y-3 sm:space-y-4">
                    <div className="h-6 sm:h-8 bg-gray-300 rounded-md w-1/2 sm:w-1/3"></div>
                    <div className="h-24 sm:h-32 bg-gray-300 rounded-lg"></div>
                    <div className="h-24 sm:h-32 bg-gray-300 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 ">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Announcements</h1>
                <p className="text-gray-600 dark:text-gray-300">Stay updated with the latest news and features</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2 flex-wrap">
                {['ALL', 'INFO', 'FEATURE', 'ALERT'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === type
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Announcements List */}
            <div className="space-y-3 sm:space-y-4">
                {/* Pinned Announcements */}
                {pinnedNotifications.map(notification => {
                    const announcement = notification.announcement;
                    return (
                        <div
                            key={notification.id}
                            className={`p-4 sm:p-6 rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 dark:bg-violet-900/10 dark:border-violet-700 relative ${notification.isRead ? 'opacity-75' : ''
                                }`}
                        >
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                                <Pin className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                                    >
                                        <Circle className="w-3 h-3" />
                                        <span className="hidden xs:inline">Mark as Read</span>
                                        <span className="xs:hidden">Read</span>
                                    </button>
                                )}
                                {notification.isRead && (
                                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md whitespace-nowrap">
                                        <CheckCircle className="w-3 h-3" />
                                        Read
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3 mb-3 pr-16 sm:pr-32">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {announcement.title}
                                        </h3>
                                        <span className={`self-start px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)} whitespace-nowrap`}>
                                            {announcement.type}
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                                        {announcement.message}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{formatDate(announcement.createdAt)}</span>
                                        </div>
                                        {announcement.expiresAt && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Expires: {formatDate(announcement.expiresAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Regular Announcements */}
                {regularNotifications.map(notification => {
                    const announcement = notification.announcement;
                    return (
                        <div
                            key={notification.id}
                            className={`p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative ${notification.isRead ? 'opacity-75' : ''
                                }`}
                        >
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                                    >
                                        <Circle className="w-3 h-3" />
                                        <span className="hidden xs:inline">Mark as Read</span>
                                        <span className="xs:hidden">Read</span>
                                    </button>
                                )}
                                {notification.isRead && (
                                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md whitespace-nowrap">
                                        <CheckCircle className="w-3 h-3" />
                                        Read
                                    </span>
                                )}
                            </div>

                            <div className="flex items-start gap-2 sm:gap-3 pr-16 sm:pr-32">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {announcement.title}
                                        </h3>
                                        <span className={`self-start px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)} whitespace-nowrap`}>
                                            {announcement.type}
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                                        {announcement.message}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{formatDate(announcement.createdAt)}</span>
                                        </div>
                                        {announcement.expiresAt && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Expires: {formatDate(announcement.expiresAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {filteredNotifications.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'ALL' ? 'No announcements available at the moment.' : `No ${filter.toLowerCase()} announcements available.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;