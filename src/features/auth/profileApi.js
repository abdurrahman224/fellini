import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, PUT, POST } from '../../services/httpMethods';

// Get user profile
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/auth/profile');

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch profile'
      );
    }
  }
);

// Get subscription status
export const getSubscriptionStatus = createAsyncThunk(
  'profile/getSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/payments/subscription-status');

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch subscription status');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch subscription status'
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      console.log('Sending PUT request to /api/v1/auth/profile with:', profileData);
      const response = await PUT('/api/v1/auth/profile', profileData);
      console.log('Update profile response:', response);

      if (response.success) {
        return response.data;
      } else {
        console.error('Update failed:', response.message);
        return rejectWithValue(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  'profile/cancelSubscription',
  async (payload = {}, { rejectWithValue }) => {
    try {
      // payload can include imageRoute or other metadata
      const response = await POST('/api/v1/payments/cancel-subscription', payload || {});
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to cancel subscription'
      );
    }
  }
);

// Reactivate subscription
export const reactivateSubscription = createAsyncThunk(
  'profile/reactivateSubscription',
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/payments/reactivate-subscription', payload || {});
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to reactivate subscription'
      );
    }
  }
);
