import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { selectTheme, toggleTheme } from '../../../features/theme/themeSlice';
import { useState } from 'react';
import Sidebar from '../Sidebar';
import {
    LayoutDashboard,
    Calendar,
    CalendarDays,
    CalendarRange,
    CheckSquare,
    RotateCcw,
    Target,
    Bot,
    TrendingUp,
    Settings,
    User,
    CreditCard,
    Menu,
    Bell,
    UserPlus,
    Sun,
    Moon,
    Tickets,
    RefreshCw,
    Megaphone
} from 'lucide-react';
import ResetMyDayModal from '../../ui/ResetDayModal';
import NotificationPanel from '../../ui/NotificationPanel';

const UserLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const theme = useSelector(selectTheme);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
        console.log('Theme changed to:', theme === 'dark' ? 'light' : 'dark');
    };

    const menuItems = [
        {
            section: 'MAIN',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: Megaphone, label: 'Announcements', path: '/user/announcements' },
                
            ],
        },
        {
            section: 'PLANNING',
            items: [
                { icon: Calendar, label: 'Daily Plan', path: '/user/daily-plan' },
                { icon: CalendarDays, label: 'Weekly Plan', path: '/user/weekly-plan' },
                { icon: CalendarRange, label: 'Monthly Plan', path: '/user/monthly-plan' },
            ],
        },
        {
            section: 'FOCUS',
            items: [
                { icon: CheckSquare, label: 'Tasks', path: '/user/tasks' },
                { icon: RotateCcw, label: 'Habits', path: '/user/habits' },
                { icon: Target, label: 'Goals', path: '/user/goals' },
            ],
        },
        {
            section: 'GROWTH',
            items: [
                { icon: Bot, label: 'AI Coach Chat', path: '/user/ai-coach' },
                { icon: TrendingUp, label: 'Activity Log', path: '/user/activity-log' },
                // { icon: TrendingUp, label: 'Analytics', path: '/user/analytics' },
                { icon: Bell, label: 'Notifications', path: '/user/notifications',  },
            ],
        },
        {
            section: 'ACCOUNT',
            items: [
                { icon: Settings, label: 'Settings', path: '/settings' },
                { icon: User, label: 'Profile', path: '/user/profile' },
                { icon: CreditCard, label: 'Subscription', path: '/user/subscription' },
                { icon: UserPlus, label: 'Refer a Friend', path: '/user/refer' },
                { icon: Tickets, label: 'Support', path: '/user/support' },
            ],
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                menuItems={menuItems}
                user={user}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-3.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleToggleTheme}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-6 h-6 text-gray-600 dark:text-yellow-400" />
                                ) : (
                                    <Moon className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsNotificationOpen(true)}
                                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                {/* Notification Badge */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            {/* <button
                                onClick={() => setResetOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900/30 text-violet-600 dark:text-violet-400 rounded-full border text-sm"
 
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset My Day
                            </button> */}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#EEEEEE] dark:bg-gray-900">
                    <Outlet />
                </main>
            </div>
            {/* <ResetMyDayModal
                open={resetOpen}
                onClose={() => setResetOpen(false)}
            /> */}

            {/* Notification Panel */}
            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />
        </div>
    );
};

export default UserLayout;