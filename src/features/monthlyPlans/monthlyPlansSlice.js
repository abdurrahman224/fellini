import { createSlice } from '@reduxjs/toolkit';
import { fetchMonthlyPlans, generateMonthlyPlanWithAI } from './monthlyPlansAPI';

const initialState = {
  plans: [],
  loading: false,
  error: null,
  currentConversationId: null,
  generating: false,
  generateError: null,
};

const monthlyPlansSlice = createSlice({
  name: 'monthlyPlans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.generateError = null;
    },
    clearConversationId: (state) => {
      state.currentConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Monthly Plans
      .addCase(fetchMonthlyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchMonthlyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate Monthly Plan with AI
      .addCase(generateMonthlyPlanWithAI.pending, (state) => {
        state.generating = true;
        state.generateError = null;
      })
      .addCase(generateMonthlyPlanWithAI.fulfilled, (state, action) => {
        state.generating = false;
        state.currentConversationId = action.payload.conversationId;
        // Add the new plan to the beginning of the array
        if (action.payload.plan) {
          state.plans = [action.payload.plan, ...state.plans];
        }
      })
      .addCase(generateMonthlyPlanWithAI.rejected, (state, action) => {
        state.generating = false;
        state.generateError = action.payload;
      });
  },
});

export const { clearError, clearConversationId } = monthlyPlansSlice.actions;

export default monthlyPlansSlice.reducer;
