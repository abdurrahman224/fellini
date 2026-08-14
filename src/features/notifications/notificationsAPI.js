import axiosInstance from '../../services/axiosInstance';

// Fetch notifications from backend
export const fetchNotificationsAPI = async (params = {}) => {
  const response = await axiosInstance.get('/api/v1/notifications', { params });
  return response.data;
};

export const deleteNotificationAPI = async (id) => {
  if (!id) throw new Error('Notification id required');
  const response = await axiosInstance.delete(`/api/v1/notifications/${id}`);
  return response.data;
};

export const markNotificationReadAPI = async (id) => {
  if (!id) throw new Error('Notification id required');
  const response = await axiosInstance.patch(`/api/v1/notifications/${id}/read`);
  return response.data;
};

export const markAllReadAPI = async () => {
  const response = await axiosInstance.patch('/api/v1/notifications/read/all');
  return response.data;
};

export const deleteAllNotificationsAPI = async () => {
  // DELETE /api/v1/notifications (no id) - remove all notifications
  const response = await axiosInstance.delete('/api/v1/notifications');
  return response.data;
};

export default {
  fetchNotificationsAPI,
};
