import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import userReducer from '../features/user/userSlice';
import paymentReducer from '../features/payments/paymentSlice';
import subscriptionReducer from '../features/users/subscriptionSlice';
import profileReducer from '../features/auth/profileSlice';
import referralReducer from './users/referralSlice';
import themeReducer from '../features/theme/themeSlice';
import plansReducer from './plans/plansSlice';
import aiChatReducer from './aiChat/aiChatSlice';
import chatReducer from './chat/chatSlice';
import monthlyPlansReducer from './monthlyPlans/monthlyPlansSlice';
import supportReducer from './support/supportSlice';
import adminSupportReducer from './adminSupport/adminSupportSlice';
import activityLogReducer from './activityLog/activityLogSlice';
import adminActivityLogReducer from './adminActivityLog/adminActivityLogSlice';
import aiSupportReducer from './aiSupport/aiSupportSlice';
import adminAiSupportReducer from './adminAiSupport/adminAiSupportSlice';
import goalsReducer from './goals/goalsSlice';
import tasksReducer from './tasks/tasksSlice';
import notificationsReducer from './notifications/notificationsSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    users: usersReducer,
    user: userReducer,
    payments: paymentReducer,
    subscription: subscriptionReducer,
    profile: profileReducer,
    referral: referralReducer,
    theme: themeReducer,
    plans: plansReducer,
    aiChat: aiChatReducer,
    chat: chatReducer,
    monthlyPlans: monthlyPlansReducer,
    support: supportReducer,
    adminSupport: adminSupportReducer,
    activityLog: activityLogReducer,
    adminActivityLog: adminActivityLogReducer,
    aiSupport: aiSupportReducer,
    adminAiSupport: adminAiSupportReducer,
    goals: goalsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
  },
});

export default store;
