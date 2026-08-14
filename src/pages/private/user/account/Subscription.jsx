import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PricingCard from './components/PricingCard';
import BillingPanel from './components/BillingPanel';
import { clearCheckout } from '../../../../features/payments/paymentSlice';
import { fetchPlans, fetchSubscriptionStatus } from '../../../../features/payments/paymentAPI';
import { toast } from 'react-toastify';

// NOTE: plans are fetched from backend. Keep fallback static summary if API fails.
const fallbackPlans = [
  { id: 'free', name: 'FREE', priceMonthly: '0', priceYearly: '0', features: [] },
  { id: 'starter', name: 'STARTER', priceMonthly: '7.99', priceYearly: '79', features: [] },
  { id: 'pro', name: 'PRO', priceMonthly: '17.99', priceYearly: '179', features: [] },
  { id: 'ultimate', name: 'ULTIMATE', priceMonthly: '39.99', priceYearly: '399', features: [] },
];

const Subscription = () => {
  const dispatch = useDispatch();
  const { profile, subscription } = useSelector((state) => state.profile || {});
  const [period, setPeriod] = useState('monthly');
  const [selected, setSelected] = useState('pro');
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null); 

  // Selected plan
  const selectedPlan = useMemo(() => plans.find((p) => p.id === selected) || null, [plans, selected]);

  // derive current user plan string for quick checks (e.g. 'free')
  const currentPlan = (subscriptionPlan || subscription?.plan || profile?.subscriptionPlan || profile?.plan || 'free').toString().toLowerCase();

  // Clear checkout data when switching to plans tab or selecting different plan
  useEffect(() => {
    if (activeTab === 'plans') {
      dispatch(clearCheckout());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    dispatch(clearCheckout());
  }, [selected, dispatch]);

  // Fetch plans from backend on mount
  useEffect(() => {
    let mounted = true;
    setLoadingPlans(true);
    Promise.all([fetchPlans().catch(() => []), fetchSubscriptionStatus().catch(() => null)])
      .then(([plansData, subStatus]) => {
        if (!mounted) return;
        const finalPlans = Array.isArray(plansData) && plansData.length > 0 ? plansData : fallbackPlans;
        setPlans(finalPlans);
        // set subscription plan from backend if present
        if (subStatus && subStatus.plan) {
          const planKey = subStatus.plan.toString().toLowerCase();
          setSubscriptionPlan(planKey);
          // if selected isn't present, prefer user's current plan as selected
          const foundById = finalPlans.find((p) => (p.id || '').toString().toLowerCase() === planKey);
          const foundByName = finalPlans.find((p) => (p.name || '').toString().toLowerCase() === planKey);
          const found = foundById || foundByName;
          if (found) setSelected(found.id);
        } else {
          // ensure selected exists in fetched plans
          const found = finalPlans.find((p) => p.id === selected);
          if (!found) setSelected(finalPlans[0].id);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setPlansError(err.message || 'Failed to load plans');
        setPlans(fallbackPlans);
      })
      .finally(() => mounted && setLoadingPlans(false));

    return () => { mounted = false; };
  }, []);

  // Amount in smallest currency unit (cents/paisa) - normalize API and static formats
  const amount = useMemo(() => {
    if (!selectedPlan) return 0;
    // API format: selectedPlan.price.monthly.amount (cents)
    if (selectedPlan.price && selectedPlan.price.monthly && typeof selectedPlan.price.monthly.amount === 'number') {
      return period === 'monthly'
        ? selectedPlan.price.monthly.amount
        : (selectedPlan.price.yearly?.amount ?? selectedPlan.price.monthly.amount);
    }
    // fallback static format: priceMonthly/priceYearly strings (dollars)
    const raw = Number(period === 'monthly' ? selectedPlan.priceMonthly : selectedPlan.priceYearly) || 0;
    return Math.round(raw * 100);
  }, [selectedPlan, period]);

  return (
    <div className="text-black dark:text-white p-4 sm:p-6 lg:p-8 ">
      <h1 className="mb-6 text-[25px] font-semibold md:text-[32px]">
        Simple Pricing. Powerful Results.
      </h1>

      {/* Tabs */}
      <div className="mb-4 overflow-hidden md:mb-6">
        <div className="bg-[#FBF8FF] dark:bg-[#1E1B2E] rounded-md">
          <div className="flex">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-3 text-center text-base font-normal ${activeTab === 'plans'
                ? 'border-b-2 border-[#7C3AED] bg-[#F8FBFE] text-gray-800 dark:border-[#A78BFA] dark:bg-[#2A2446] dark:text-white'
                : 'border-b-2 border-transparent bg-[#F8FBFE] text-gray-600 dark:bg-[#1E1B2E] dark:text-gray-400'
                }`}
            >
              Available Plans
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 py-3 text-center text-base font-normal ${activeTab === 'billing'
                ? 'border-b-2 border-[#7C3AED] bg-[#F7F3FF] text-gray-800  dark:border-[#A78BFA] dark:bg-[#2A2446] dark:text-white'
                : 'border-b-2 border-transparent bg-[#F7F3FF] text-gray-600 dark:bg-[#1E1B2E] dark:text-gray-400'
                }`}
            >
              Billing & Invoices
            </button>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      {activeTab === 'plans' && (
        <div className="flex items-center justify-center p-4 md:p-6">
          <div className="flex w-full max-w-sm items-center justify-between rounded-full bg-[#C4C4C4] dark:bg-gray-400 px-2 py-2 md:w-80">
            <button
              onClick={() => setPeriod('monthly')}
              className={`rounded-full ${period === 'monthly' ? 'bg-white dark:bg-gray-700 px-4 py-2 shadow-md md:px-6 dark:text-white' : 'px-4 py-2 text-gray-600 dark:text-gray-300 md:px-6 '
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`rounded-full ${period === 'yearly' ? 'bg-white dark:bg-gray-700 px-3 py-2 shadow-md md:px-4' : 'px-3 py-2 font-semibold md:px-4'
                }`}
            >
              <div className="flex gap-2">
                <span>Yearly</span>
                <span className="text-green-600">SAVE 20%</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mt-4 md:mt-6">
        {activeTab === 'plans' ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6">
            {plans.map((p) => {
              const pKey = (p.id || p.name || '').toString().toLowerCase();
              const isActiveFromSubscription = subscriptionPlan ? subscriptionPlan === pKey : false;
              const isActive = selected === p.id || isActiveFromSubscription;
              // derive display price robustly for both API and static formats
              let priceDisplay = '0';
              if (p.price && p.price.monthly && typeof p.price.monthly.amount === 'number') {
                const amt = period === 'monthly' ? p.price.monthly.amount : (p.price.yearly?.amount ?? p.price.monthly.amount);
                priceDisplay = (amt / 100).toFixed(2);
              } else {
                priceDisplay = period === 'monthly' ? (p.priceMonthly ?? '0') : (p.priceYearly ?? '0');
              }

              const handleStart = () => {
                // normalize clicked plan id/name and compare to currentPlan
                const clickedId = (p?.id || p?.name || '').toString().toLowerCase();
                if (clickedId === currentPlan) {
                  toast.info(`You are already on the ${p.name} plan`);
                  return;
                }
                setSelected(p.id);
                setActiveTab('billing');
              };

              return (
                <PricingCard
                  key={p.id}
                  plan={p}
                  isActive={isActive}
                  price={priceDisplay}
                  period={period}
                  onSelect={() => setSelected(p.id)}
                  onStartClick={handleStart}
                />
              );
            })}
          </div>
        ) : (
          <BillingPanel
            amount={amount}
            productId={selectedPlan.id}
            planName={selectedPlan.name}
            selectedPlan={selectedPlan}
            period={period}
            currency="USD"
            customer={{ name: '', email: '' }} // Optional: pass customer info
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;
