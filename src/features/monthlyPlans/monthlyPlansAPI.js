import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Fetch all monthly plans
export const fetchMonthlyPlans = createAsyncThunk(
  'monthlyPlans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/ai/monthly');
      if (response?.data?.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response?.data?.message || 'Failed to fetch monthly plans');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred while fetching plans'
      );
    }
  }
);

// Generate monthly plan with AI
export const generateMonthlyPlanWithAI = createAsyncThunk(
  'monthlyPlans/generateWithAI',
  async ({ userInput, monthStartDate, conversationId = null }, { rejectWithValue }) => {
    try {
      const payload = {
        userInput,
        monthStartDate
      };

      if (conversationId) {
        payload.conversationId = conversationId;
      }

      const response = await axiosInstance.post('/api/v1/ai/generate/monthly', payload);

      if (response?.data?.success && response?.data?.data?.monthlyPlan) {
        return {
          plan: response.data.data.monthlyPlan,
          conversationId: response.data.data.conversationId
        };
      } else {
        return rejectWithValue(response?.data?.message || 'Failed to generate plan');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred while generating plan'
      );
    }
  }
);
