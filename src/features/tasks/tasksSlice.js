import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTasksAPI,
  fetchTodayTasksAPI,
  fetchOverdueTasksAPI,
  fetchTaskByIdAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  generateTasksFromGoalsAPI,
  generateDailyTasksAPI,
  magicSyncAPI,
  breakdownTaskAPI,
  completeTaskAPI,
  skipTaskAPI,
  fetchTaskStatsAPI,
  fetchProductivityAPI,
  fetchPatternsAPI,
} from './tasksAPI';
import { toast } from 'react-toastify';

// ─── Async Thunks ──────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchTasksAPI(params);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tasks');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTodayTasks = createAsyncThunk(
  'tasks/fetchTodayTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTodayTasksAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today tasks');
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  'tasks/fetchOverdueTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOverdueTasksAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      return await fetchTaskByIdAPI(taskId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await createTaskAPI(taskData);
      toast.success(res.message || 'Task created successfully');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const res = await updateTaskAPI(taskId, data);
      toast.success(res.message || 'Task updated');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await deleteTaskAPI(taskId);
      toast.success(res.message || 'Task deleted');
      return { taskId, ...res };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const generateTasksFromGoals = createAsyncThunk(
  'tasks/generateFromGoals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await generateTasksFromGoalsAPI();
      toast.success(res.message || 'Tasks generated from goals');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate tasks');
      return rejectWithValue(error.response?.data?.message || 'Failed to generate tasks');
    }
  }
);

export const generateDailyTasks = createAsyncThunk(
  'tasks/generateDaily',
  async (_, { rejectWithValue }) => {
    try {
      const res = await generateDailyTasksAPI();
      toast.success(res.message || 'Daily tasks generated');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate daily tasks');
      return rejectWithValue(error.response?.data?.message || 'Failed to generate daily tasks');
    }
  }
);

export const magicSync = createAsyncThunk(
  'tasks/magicSync',
  async (data = {}, { rejectWithValue }) => {
    try {
      const res = await magicSyncAPI(data);
      toast.success(res.message || 'Tasks rebalanced successfully');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Magic sync failed');
      return rejectWithValue(error.response?.data?.message || 'Magic sync failed');
    }
  }
);

export const breakdownTask = createAsyncThunk(
  'tasks/breakdown',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await breakdownTaskAPI(taskId);
      toast.success(res.message || 'Task broken down into subtasks');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to breakdown task');
      return rejectWithValue(error.response?.data?.message || 'Failed to breakdown task');
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/complete',
  async ({ taskId, data = {} }, { rejectWithValue }) => {
    try {
      const res = await completeTaskAPI(taskId, data);
      toast.success(res.message || 'Task completed!');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete task');
      return rejectWithValue(error.response?.data?.message || 'Failed to complete task');
    }
  }
);

export const skipTask = createAsyncThunk(
  'tasks/skip',
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const res = await skipTaskAPI(taskId, data);
      toast.success(res.message || 'Task skipped');
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to skip task');
      return rejectWithValue(error.response?.data?.message || 'Failed to skip task');
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchTaskStatsAPI(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchProductivity = createAsyncThunk(
  'tasks/fetchProductivity',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchProductivityAPI(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch productivity');
    }
  }
);

export const fetchPatterns = createAsyncThunk(
  'tasks/fetchPatterns',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPatternsAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patterns');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  tasks: [],
  todayTasks: [],
  overdueTasks: [],
  selectedTask: null,
  stats: null,
  productivity: null,
  patterns: [],
  // filters
  filters: {
    status: '',
    priority: '',
    category: '',
    source: '',
    goalId: '',
  },
  // loading states
  loading: false,
  todayLoading: false,
  overdueLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  aiLoading: false,        // for generate/magic-sync/breakdown
  statsLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTaskFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    resetTasks: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all tasks ──
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || action.payload.data || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Today tasks ──
      .addCase(fetchTodayTasks.pending, (state) => {
        state.todayLoading = true;
      })
      .addCase(fetchTodayTasks.fulfilled, (state, action) => {
        state.todayLoading = false;
        state.todayTasks = action.payload.tasks || action.payload.data || [];
      })
      .addCase(fetchTodayTasks.rejected, (state) => {
        state.todayLoading = false;
      })

      // ── Overdue tasks ──
      .addCase(fetchOverdueTasks.pending, (state) => {
        state.overdueLoading = true;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
        state.overdueLoading = false;
        state.overdueTasks = action.payload.tasks || action.payload.data || [];
      })
      .addCase(fetchOverdueTasks.rejected, (state) => {
        state.overdueLoading = false;
      })

      // ── Fetch by id ──
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload.task || action.payload.data || null;
      })

      // ── Create task ──
      .addCase(createTask.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createLoading = false;
        const newTask = action.payload.task || action.payload.data;
        if (newTask) state.tasks.push(newTask);
      })
      .addCase(createTask.rejected, (state) => {
        state.createLoading = false;
      })

      // ── Update task ──
      .addCase(updateTask.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload.task || action.payload.data;
        if (updated) {
          const idx = state.tasks.findIndex((t) => t.id === updated.id);
          if (idx !== -1) state.tasks[idx] = updated;
        }
      })
      .addCase(updateTask.rejected, (state) => {
        state.updateLoading = false;
      })

      // ── Delete task ──
      .addCase(deleteTask.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload.taskId);
      })
      .addCase(deleteTask.rejected, (state) => {
        state.deleteLoading = false;
      })

      // ── AI: Generate from goals ──
      .addCase(generateTasksFromGoals.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(generateTasksFromGoals.fulfilled, (state, action) => {
        state.aiLoading = false;
        const generated = action.payload.tasks || action.payload.data || [];
        state.tasks = [...state.tasks, ...generated];
      })
      .addCase(generateTasksFromGoals.rejected, (state) => {
        state.aiLoading = false;
      })

      // ── AI: Generate daily ──
      .addCase(generateDailyTasks.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(generateDailyTasks.fulfilled, (state, action) => {
        state.aiLoading = false;
        const generated = action.payload.tasks || action.payload.data || [];
        state.tasks = [...state.tasks, ...generated];
      })
      .addCase(generateDailyTasks.rejected, (state) => {
        state.aiLoading = false;
      })

      // ── AI: Magic Sync ──
      .addCase(magicSync.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(magicSync.fulfilled, (state) => {
        state.aiLoading = false;
        // tasks need full re-fetch after sync
      })
      .addCase(magicSync.rejected, (state) => {
        state.aiLoading = false;
      })

      // ── AI: Breakdown ──
      .addCase(breakdownTask.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(breakdownTask.fulfilled, (state, action) => {
        state.aiLoading = false;
        const subtasks = action.payload.subtasks || action.payload.data || [];
        state.tasks = [...state.tasks, ...subtasks];
      })
      .addCase(breakdownTask.rejected, (state) => {
        state.aiLoading = false;
      })

      // ── Complete task ──
      .addCase(completeTask.fulfilled, (state, action) => {
        const completed = action.payload.task || action.payload.data;
        if (completed) {
          const idx = state.tasks.findIndex((t) => t.id === completed.id);
          if (idx !== -1) state.tasks[idx] = completed;
        }
      })

      // ── Skip task ──
      .addCase(skipTask.fulfilled, (state, action) => {
        const skipped = action.payload.task || action.payload.data;
        if (skipped) {
          const idx = state.tasks.findIndex((t) => t.id === skipped.id);
          if (idx !== -1) state.tasks[idx] = skipped;
        }
      })

      // ── Stats ──
      .addCase(fetchTaskStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats || action.payload.data || null;
      })
      .addCase(fetchTaskStats.rejected, (state) => {
        state.statsLoading = false;
      })

      // ── Productivity ──
      .addCase(fetchProductivity.fulfilled, (state, action) => {
        state.productivity = action.payload.analytics || action.payload.data || null;
      })

      // ── Patterns ──
      .addCase(fetchPatterns.fulfilled, (state, action) => {
        state.patterns = action.payload.patterns || action.payload.data || [];
      });
  },
});

export const { setTaskFilter, clearTaskFilters, clearSelectedTask, resetTasks } = tasksSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectTodayTasks = (state) => state.tasks.todayTasks;
export const selectOverdueTasks = (state) => state.tasks.overdueTasks;
export const selectSelectedTask = (state) => state.tasks.selectedTask;
export const selectTaskStats = (state) => state.tasks.stats;
export const selectProductivity = (state) => state.tasks.productivity;
export const selectPatterns = (state) => state.tasks.patterns;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectAILoading = (state) => state.tasks.aiLoading;
export const selectCreateTaskLoading = (state) => state.tasks.createLoading;
export const selectTaskFilters = (state) => state.tasks.filters;

export default tasksSlice.reducer;
