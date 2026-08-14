import axiosInstance from '../../services/axiosInstance';

// Get habits statistics overview
export const getHabitsStatsOverview = async () => {
  const response = await axiosInstance.get('/api/v1/habits/stats/overview');
  return response.data;
};

// Get all habits
export const getHabits = async () => {
  const response = await axiosInstance.get('/api/v1/habits');
  return response.data;
};

// Get habit by ID
export const getHabitById = async (habitId) => {
  const response = await axiosInstance.get(`/api/v1/habits/${habitId}`);
  return response.data;
};

// Create a new habit
export const createHabit = async (habitData) => {
  const response = await axiosInstance.post('/api/v1/habits', habitData);
  return response.data;
};

// Update a habit
export const updateHabit = async (habitId, habitData) => {
  const response = await axiosInstance.patch(`/api/v1/habits/${habitId}`, habitData);
  return response.data;
};

// Delete a habit
export const deleteHabit = async (habitId) => {
  const response = await axiosInstance.delete(`/api/v1/habits/${habitId}`);
  return response.data;
};

// Check in a habit
export const checkInHabit = async (habitId) => {
  const response = await axiosInstance.post(`/api/v1/habits/${habitId}/check-in`);
  return response.data;
};

// Complete a habit
export const completeHabit = async (habitId, completionData) => {
  const response = await axiosInstance.post(`/api/v1/habits/${habitId}/complete`, completionData);
  return response.data;
};

// Skip a habit
export const skipHabit = async (habitId, skipData) => {
  const response = await axiosInstance.post(`/api/v1/habits/${habitId}/skip`, skipData);
  return response.data;
};
