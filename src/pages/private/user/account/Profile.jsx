import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import PrimaryButton from '../../../../components/ui/PrimaryButton';
import {
  getUserProfile,
  updateUserProfile,
  getSubscriptionStatus,
  cancelSubscription,
  reactivateSubscription,
} from '../../../../features/auth/profileApi';
import { fetchPlans } from '../../../../features/payments/paymentAPI';
import { clearUpdateSuccess } from '../../../../features/auth/profileSlice';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  bio: '',
};

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, subscription, loading, error, updateSuccess } =
    useSelector((state) => state.profile);

  const [form, setForm] = useState(initialFormState);
  const [showCancelModal, setShowCancelModal] = useState(false);

  /* ----------------------------------
   Helpers
  -----------------------------------*/

  const [localCancelled, setLocalCancelled] = useState(false);

  const isSubscriptionCancelled = useCallback((sub) => {
    if (!sub) return false;
    const status = sub.status ? sub.status.toString().toLowerCase() : '';
    return Boolean(
      sub.cancelAt ||
      sub.cancel_at ||
      sub.canceledAt ||
      sub.canceled_at ||
      sub.isCancelled ||
      sub.is_cancelled ||
      ['canceled', 'cancelled', 'pending_cancellation', 'cancel_pending', 'pending-cancellation'].includes(status)
    );
  }, []);

  // keep local state in sync with server subscription to avoid flicker
  useEffect(() => {
    const detected = isSubscriptionCancelled(subscription);
    setLocalCancelled(detected);
  }, [subscription, isSubscriptionCancelled]);

  const isCancelled = localCancelled || isSubscriptionCancelled(subscription);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getPlanAsset = useCallback(async (type = 'cancel') => {
    try {
      const plans = await fetchPlans();
      const key = (subscription?.plan || subscription?.planName || '')
        .toString()
        .toLowerCase();

      const plan = (plans || []).find(
        (p) => ((p.id || p.name) || '').toString().toLowerCase() === key
      );

      if (!plan) return null;

      return type === 'reactivate'
        ? plan.reactivateImage || plan.image || plan.imageRoute
        : plan.image || plan.imageRoute;
    } catch {
      return null;
    }
  }, [subscription]);

  /* ----------------------------------
   Initial Data Fetch
  -----------------------------------*/

  useEffect(() => {
    if (loading) return;

    if (!profile) dispatch(getUserProfile());
    if (!subscription) dispatch(getSubscriptionStatus());
  }, [profile, subscription, loading, dispatch]);

  /* ----------------------------------
   Sync Profile → Form
  -----------------------------------*/

  useEffect(() => {
    if (!profile) return;

    const nameParts = profile.fullName?.split(' ') || [];

    setForm({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || '',
    });
  }, [profile]);

  /* ----------------------------------
   Success & Error Handling
  -----------------------------------*/

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profile updated successfully!');
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (error && !loading) {
      const message =
        error?.response?.data?.message || error?.message || error;
      toast.error(`Update failed: ${message}`);
    }
  }, [error, loading]);

  /* ----------------------------------
   Form Submit
  -----------------------------------*/

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    const updateData = Object.fromEntries(
      Object.entries({
        fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        bio: form.bio,
      }).filter(([, value]) => value?.trim())
    );

    if (!Object.keys(updateData).length) {
      toast.error('Please fill in at least one field to update');
      return;
    }

    dispatch(updateUserProfile(updateData));
  };

  /* ----------------------------------
   Subscription Actions
  -----------------------------------*/

  const handleCancelSubscription = () => {
    if (!subscription || subscription?.plan?.toLowerCase() === 'free') {
      toast.info('No active subscription to cancel');
      return;
    }
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = async () => {
    setShowCancelModal(false);
    try {
      const assetRoute = await getPlanAsset('cancel');
      const payload = assetRoute ? { imageRoute: assetRoute } : {};

      await dispatch(cancelSubscription(payload)).unwrap();
      toast.success('Subscription cancelled successfully');
      dispatch(getSubscriptionStatus());
    } catch (err) {
      toast.error(err?.toString() || 'Failed to cancel subscription');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const assetRoute = await getPlanAsset('reactivate');
      const payload = assetRoute ? { imageRoute: assetRoute } : {};

      await dispatch(reactivateSubscription(payload)).unwrap();
      toast.success('Subscription reactivated successfully');
      dispatch(getSubscriptionStatus());
    } catch (err) {
      toast.error(err?.toString() || 'Failed to reactivate subscription');
    }
  };

  const isFirstLoad = loading && !profile;
  const isSaving = loading && profile;

  /* ----------------------------------
   Render
  -----------------------------------*/

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {error && !profile && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-center">
            <div className="text-sm font-medium text-red-800">
              Error: {error}
            </div>
            <button
              onClick={() => dispatch(getUserProfile())}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-start justify-center py-6">
          <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-md">
            {isFirstLoad && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-zinc-600/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
                  <div className="text-sm text-gray-600 dark:text-white">
                    Loading profile...
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xl font-medium text-black dark:text-white">
                  {profile?.fullName ||
                    `${form.firstName} ${form.lastName}` ||
                    'User'}
                </div>
                <div className="text-base text-black dark:text-white/80">
                  {profile?.email || form.email || 'email@example.com'}
                </div>

                <div className="mt-2">
                  <span className="rounded bg-[#E0E7FF] px-3 py-1 text-xs font-normal text-[#4338CA]">
                    {(subscription?.plan ||
                      profile?.subscriptionPlan ||
                      'FREE'
                    ).toUpperCase()}{' '}
                    PLAN
                  </span>
                </div>

                <div className="mt-3">
                  {isCancelled ? (
                    <button
                      type="button"
                      onClick={handleReactivateSubscription}
                      disabled={loading}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Reactivate Subscription
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showCancelModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowCancelModal(false)}
                />
                <div className="relative mx-4 w-full max-w-md rounded-lg bg-white dark:bg-zinc-700 p-6 shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold dark:text-white">
                    Confirm cancellation
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-200">
                    Are you sure you want to cancel your subscription? It will be
                    cancelled at the end of the current billing period.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="rounded bg-gray-200 dark:bg-zinc-600 dark:text-white px-3 py-2 text-sm"
                    >
                      Keep subscription
                    </button>
                    <button
                      type="button"
                      onClick={confirmCancelSubscription}
                      disabled={loading}
                      className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      Yes, cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['firstName', 'lastName'].map((field) => (
                  <div key={field}>
                    <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                      {field === 'firstName' ? 'First Name' : 'Last Name'}
                    </label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full rounded border border-[#000000] dark:border-white bg-gray-100 dark:bg-zinc-700 px-3 py-2 text-base text-[#5D5D5D] dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {['phone', 'address'].map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-base font-semibold text-black dark:text-white">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full rounded border border-[#000000] dark:border-white bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 text-base text-[#5D5D5D] dark:text-white focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex justify-end">
                <PrimaryButton type="submit" disabled={isSaving}>
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
