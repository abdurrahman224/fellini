import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Fetch plans (daily)
export const fetchDailyPlans = createAsyncThunk(
  'plans/fetchDaily',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/v1/daily-plans');
      const data = res?.data?.data || res?.data || [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new daily plan
export const createDailyPlan = createAsyncThunk(
  'plans/createDaily',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/v1/daily-plans', payload);
      const created = res?.data?.data || res?.data || null;
      const message = res?.data?.message || null;
      return { created, message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch weekly plans
export const fetchWeeklyPlans = createAsyncThunk(
  'plans/fetchWeekly',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/v1/ai/weekly');
      const data = res?.data?.data || res?.data || [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update an existing plan (partial)
export const updatePlan = createAsyncThunk(
  'plans/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/api/v1/daily-plans/${id}`, payload);
      const updated = res?.data?.data || res?.data || null;
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    dailyItems: [],
    weeklyItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyPlans.fulfilled, (state, action) => {
        state.loading = false;
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.dailyItems = list.map((it) => ({ ...it, id: it.id ?? it._id }));
      })
      .addCase(fetchDailyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDailyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDailyPlan.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (!payload) return;
        // payload may contain { created, message }
        if (payload.created) {
          const c = { ...payload.created, id: payload.created.id ?? payload.created._id };
          state.dailyItems.unshift(c);
        } else {
          const item = { ...payload, id: payload.id ?? payload._id };
          state.dailyItems.unshift(item);
        }
      })
      .addCase(createDailyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        const upd = action.payload;
        if (upd) {
          const updated = { ...upd, id: upd.id ?? upd._id };
          const targetId = updated.id ?? updated._id;
          state.dailyItems = state.dailyItems.map((i) => {
            const itemId = i.id ?? i._id;
            return itemId === targetId ? updated : i;
          });
          state.weeklyItems = state.weeklyItems.map((i) => {
            const itemId = i.id ?? i._id;
            return itemId === targetId ? updated : i;
          });
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchWeeklyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyPlans.fulfilled, (state, action) => {
        state.loading = false;
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.weeklyItems = list.map((it) => ({ ...it, id: it.id ?? it._id }));
      })
      .addCase(fetchWeeklyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default plansSlice.reducer;
