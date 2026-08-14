import axios from '../../services/axiosInstance';

export async function fetchPlans() {
  const res = await axios.get('/api/v1/payments/plans');
  // backend response shape expected: { success: true, data: { plans: [...] } }
  return res.data?.data?.plans ?? res.data?.plans ?? [];
}

export async function fetchSubscriptionStatus() {
  const res = await axios.get('/api/v1/payments/subscription-status');
  // expected shape: { success: true, data: { plan: 'FREE', ... } }
  return res.data?.data ?? null;
}

export default {
  fetchPlans,
};
