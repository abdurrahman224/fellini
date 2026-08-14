import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/tasks';

// ─── CRUD ──────────────────────────────────────────────────────

/** GET /tasks — list with optional filters */
export const fetchTasksAPI = async (params = {}) => {
  const response = await axiosInstance.get(BASE, { params });
  return response.data;
};

/** GET /tasks/special/today */
export const fetchTodayTasksAPI = async () => {
  const response = await axiosInstance.get(`${BASE}/special/today`);
  return response.data;
};

/** GET /tasks/special/overdue */
export const fetchOverdueTasksAPI = async () => {
  const response = await axiosInstance.get(`${BASE}/special/overdue`);
  return response.data;
};

/** GET /tasks/:id */
export const fetchTaskByIdAPI = async (taskId) => {
  const response = await axiosInstance.get(`${BASE}/${taskId}`);
  return response.data;
};

/** POST /tasks — manual task creation */
export const createTaskAPI = async (taskData) => {
  const response = await axiosInstance.post(BASE, taskData);
  return response.data;
};

/** PATCH /tasks/:id */
export const updateTaskAPI = async (taskId, data) => {
  const response = await axiosInstance.patch(`${BASE}/${taskId}`, data);
  return response.data;
};

/** DELETE /tasks/:id */
export const deleteTaskAPI = async (taskId) => {
  const response = await axiosInstance.delete(`${BASE}/${taskId}`);
  return response.data;
};

// ─── AI-Powered ────────────────────────────────────────────────

/** POST /tasks/ai/generate-from-goals */
export const generateTasksFromGoalsAPI = async () => {
  const response = await axiosInstance.post(`${BASE}/ai/generate-from-goals`);
  return response.data;
};

/** POST /tasks/ai/generate-daily */
export const generateDailyTasksAPI = async () => {
  const response = await axiosInstance.post(`${BASE}/ai/generate-daily`);
  return response.data;
};

/** POST /tasks/ai/magic-sync */
export const magicSyncAPI = async (data = {}) => {
  const response = await axiosInstance.post(`${BASE}/ai/magic-sync`, data);
  return response.data;
};

/** POST /tasks/:id/breakdown */
export const breakdownTaskAPI = async (taskId) => {
  const response = await axiosInstance.post(`${BASE}/${taskId}/breakdown`);
  return response.data;
};

// ─── Status Actions ────────────────────────────────────────────

/** POST /tasks/:id/complete */
export const completeTaskAPI = async (taskId, data = {}) => {
  const response = await axiosInstance.post(`${BASE}/${taskId}/complete`, data);
  return response.data;
};

/** POST /tasks/:id/skip */
export const skipTaskAPI = async (taskId, data) => {
  const response = await axiosInstance.post(`${BASE}/${taskId}/skip`, data);
  return response.data;
};

// ─── Analytics ─────────────────────────────────────────────────

/** GET /tasks/analytics/stats */
export const fetchTaskStatsAPI = async (params = {}) => {
  const response = await axiosInstance.get(`${BASE}/analytics/stats`, { params });
  return response.data;
};

/** GET /tasks/analytics/productivity */
export const fetchProductivityAPI = async (params = {}) => {
  const response = await axiosInstance.get(`${BASE}/analytics/productivity`, { params });
  return response.data;
};

/** GET /tasks/analytics/patterns */
export const fetchPatternsAPI = async () => {
  const response = await axiosInstance.get(`${BASE}/analytics/patterns`);
  return response.data;
};
