import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationsAPI } from './notificationsAPI';
import {
  deleteNotificationAPI,
  markNotificationReadAPI,
  markAllReadAPI,
  deleteAllNotificationsAPI,
} from './notificationsAPI';

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchNotificationsAPI();
      // Expecting API response shape { success, count, total, notifications }
      return data.notifications || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Fetch failed');
    }
  }
);

// Delete notification on server and remove from store
export const deleteNotificationById = createAsyncThunk(
  'notifications/deleteNotificationById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteNotificationAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Delete failed');
    }
  }
);

// Mark single notification as read on server
export const markNotificationReadById = createAsyncThunk(
  'notifications/markNotificationReadById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await markNotificationReadAPI(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Mark read failed');
    }
  }
);

// Mark all notifications as read on server
export const markAllReadServer = createAsyncThunk(
  'notifications/markAllReadServer',
  async (_, { rejectWithValue }) => {
    try {
      const data = await markAllReadAPI();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Mark all read failed');
    }
  }
);

// Delete all notifications on server
export const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await deleteAllNotificationsAPI();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Delete all failed');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action) {
      const id = action.payload;
      const idx = state.items.findIndex((n) => n.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], readAt: new Date().toISOString() };
      }
    },
    deleteNotification(state, action) {
      const id = action.payload;
      state.items = state.items.filter((n) => n.id !== id);
    },
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, readAt: new Date().toISOString() }));
    },
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load notifications';
      });
    builder
      .addCase(deleteNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.items = state.items.filter((n) => n.id !== id);
      })
      .addCase(deleteNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete notification';
      });
    builder
      .addCase(markNotificationReadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationReadById.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        const idx = state.items.findIndex((n) => n.id === id);
        if (idx !== -1) state.items[idx].readAt = new Date().toISOString();
      })
      .addCase(markNotificationReadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark notification read';
      });

    builder
      .addCase(markAllReadServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllReadServer.fulfilled, (state) => {
        state.loading = false;
        state.items = state.items.map((n) => ({ ...n, readAt: new Date().toISOString() }));
      })
      .addCase(markAllReadServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark all read';
      });

    builder
      .addCase(deleteAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete all notifications';
      });
  },
});

export const { markAsRead, deleteNotification, markAllRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
