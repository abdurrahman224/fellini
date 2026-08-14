import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/goals';

/**
 * Create a new career goal
 * POST /goals
 */
export const createGoalAPI = async (goalData) => {
  const response = await axiosInstance.post(BASE, goalData);
  return response.data;
};

/**
 * Get all goals
 * GET /goals
 */
export const fetchGoalsAPI = async (params = {}) => {
  const response = await axiosInstance.get(BASE, { params });
  return response.data;
};

/**
 * Get a specific goal
 * GET /goals/:id
 */
export const fetchGoalByIdAPI = async (goalId) => {
  const response = await axiosInstance.get(`${BASE}/${goalId}`);
  return response.data;
};

/**
 * Update a goal
 * PATCH /goals/:id
 */
export const updateGoalAPI = async (goalId, data) => {
  const response = await axiosInstance.patch(`${BASE}/${goalId}`, data);
  return response.data;
};

/**
 * Delete a goal
 * DELETE /goals/:id
 */
export const deleteGoalAPI = async (goalId) => {
  const response = await axiosInstance.delete(`${BASE}/${goalId}`);
  return response.data;
};
