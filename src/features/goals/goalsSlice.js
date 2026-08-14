import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createGoalAPI,
  fetchGoalsAPI,
  fetchGoalByIdAPI,
  updateGoalAPI,
  deleteGoalAPI,
} from './goalsAPI';
import { toast } from 'react-toastify';

// ─── Async Thunks ──────────────────────────────────────────────

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchGoalsAPI(params);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load goals');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchGoalById',
  async (goalId, { rejectWithValue }) => {
    try {
      return await fetchGoalByIdAPI(goalId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goal');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const res = await createGoalAPI(goalData);
      toast.success(res.message || 'Goal created successfully');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
      return rejectWithValue(error.response?.data?.message || 'Failed to create goal');
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ goalId, data }, { rejectWithValue }) => {
    try {
      const res = await updateGoalAPI(goalId, data);
      toast.success(res.message || 'Goal updated successfully');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
      return rejectWithValue(error.response?.data?.message || 'Failed to update goal');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const res = await deleteGoalAPI(goalId);
      toast.success(res.message || 'Goal deleted successfully');
      return { goalId, ...res };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete goal');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete goal');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  goals: [],
  selectedGoal: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearSelectedGoal: (state) => {
      state.selectedGoal = null;
    },
    resetGoals: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload.goals || action.payload.data || [];
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch goal by id
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.selectedGoal = action.payload.goal || action.payload.data || null;
      })

      // Create goal
      .addCase(createGoal.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.createLoading = false;
        const newGoal = action.payload.goal || action.payload.data;
        if (newGoal) state.goals.push(newGoal);
      })
      .addCase(createGoal.rejected, (state) => {
        state.createLoading = false;
      })

      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload.goal || action.payload.data;
        if (updated) {
          const idx = state.goals.findIndex((g) => g.id === updated.id);
          if (idx !== -1) state.goals[idx] = updated;
        }
      })
      .addCase(updateGoal.rejected, (state) => {
        state.updateLoading = false;
      })

      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.goals = state.goals.filter((g) => g.id !== action.payload.goalId);
      })
      .addCase(deleteGoal.rejected, (state) => {
        state.deleteLoading = false;
      });
  },
});

export const { clearSelectedGoal, resetGoals } = goalsSlice.actions;

// Selectors
export const selectGoals = (state) => state.goals.goals;
export const selectGoalsLoading = (state) => state.goals.loading;
export const selectSelectedGoal = (state) => state.goals.selectedGoal;
export const selectCreateGoalLoading = (state) => state.goals.createLoading;
export const selectDeleteGoalLoading = (state) => state.goals.deleteLoading;

export default goalsSlice.reducer;
