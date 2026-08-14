

import React, { useEffect } from 'react';
import { X, Flame, Target, Bell, Gift, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { PATCH } from '../../services/httpMethods';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications } from '../../features/notifications/notificationsSlice';

const NotificationPanel = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { items: notifications = [], loading = false, error = null } = useSelector((s) => s.notifications || {});

    // Show only first 6 notifications in the panel
    const displayNotifications = Array.isArray(notifications) ? notifications.slice(0, 5) : [];

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    }, [isOpen, dispatch]);

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'streak': return Flame;
            case 'session':
            case 'focus': return Target;
            case 'reward':
            case 'achievement': return Gift;
            case 'alert':
            case 'warning': return AlertCircle;
            case 'progress': return TrendingUp;
            default: return Bell;
        }
    };

    const getNotificationStyles = (type) => {
        switch (type?.toLowerCase()) {
            case 'streak': return { iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400' };
            case 'session':
            case 'focus': return { iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' };
            case 'reward':
            case 'achievement': return { iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' };
            case 'alert':
            case 'warning': return { iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' };
            case 'progress': return { iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' };
            default: return { iconBg: 'bg-gray-100 dark:bg-gray-900/30', iconColor: 'text-gray-600 dark:text-gray-400' };
        }
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const time = new Date(timestamp);
        const seconds = Math.floor((now - time) / 1000);
        if (seconds < 60) return `${seconds} secs ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return time.toLocaleDateString();
    };

    const navigate = useNavigate();

    const handleViewAll = () => {
        onClose?.();
        navigate('/user/notifications');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Notification Panel */}
            <div
                className={`
                    fixed top-16 
                    left-4 right-4 sm:left-auto sm:right-8 sm:w-96  
                    h-[calc(100vh-10rem)] 
                    sm:h-auto sm:max-h-[500px]
                    
                    bg-white dark:bg-gray-900
                    rounded-md shadow-2xl z-50 
                    flex flex-col
                    overflow-hidden
                    transform transition-all duration-200 ease-out origin-top-right
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
            >
                {/* Header (Fixed at top) */}
                <div className="flex-none flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-[#7C3AED]/80  dark:bg-gray-900 z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                        Notifications
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg transition"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-gray-300" />
                    </button>
                </div>

                {/* Notifications List (Scrollable Area) */}

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 min-h-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
                        </div>
                    ) : displayNotifications.length > 0 ? (
                        displayNotifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            const styles = getNotificationStyles(notification.type);

                            return (
                                <div
                                    key={notification.id}
                                    className={`
                                        bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 
                                        shadow-sm hover:shadow-md transition cursor-pointer 
                                        border ${notification.readAt
                                            ? 'border-gray-200 dark:border-gray-600'
                                            : 'border-violet-200 dark:border-violet-600 bg-violet-50/50 dark:bg-violet-900/10'
                                        }
                                    `}
                                >
                                    <div className="flex gap-3 sm:gap-4">


                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                                                    {notification.title}
                                                </h3>
                                                <span className="text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            {/* <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {notification.message}
                                            </p> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 text-gray-500">
                            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p>No notifications yet</p>
                        </div>
                    )}
                </div>

                {/* Footer (Fixed at bottom via Flexbox) */}
                {/* No 'absolute' positioning needed. It naturally sits at the bottom of the flex column */}
                {notifications.length > 0 && (
                    <div className="flex-none p-4  border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <button
                            onClick={handleViewAll}
                            className="w-full bg-[#7C3AED]/80  hover:bg-violet-700 text-white font-medium py-3 sm:py-3.5 px-4 rounded-lg  text-sm sm:text-base"
                        >
                            View all
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPanel;