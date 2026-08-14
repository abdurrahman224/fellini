import React, { useState, useEffect } from 'react';
import PricingCard from './PricingCard';
import { fetchPlans } from '../../../../features/payments/paymentAPI';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../../../features/auth/authSlice';
import { createCheckout } from '../../../../features/payments/paymentSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const mapApiPlanToView = (p, billingCycle) => {
  const id = (p.id || p.name || '').toString();
  const name = (p.name || p.id || '').toString().toUpperCase();
  const description = p.tagline || p.description || '';
  const monthlyDisplay = p.price?.monthly?.display || (typeof p.priceMonthly === 'string' ? p.priceMonthly : (p.price?.monthly?.amount != null ? `$${(p.price.monthly.amount / 100).toFixed(2)}/month` : undefined));
  const yearlyDisplay = p.price?.yearly?.display || (typeof p.priceYearly === 'string' ? p.priceYearly : (p.price?.yearly?.amount != null ? `$${(p.price.yearly.amount / 100).toFixed(2)}/year` : undefined));
  const features = p.features || [];
  const image = p.image || p.imageRoute || p.imageURL || p.image_url || null;
  const isPopular = (id.toLowerCase() === 'pro' || name.includes('PRO'));

  return {
    id,
    name,
    description,
    monthlyPrice: monthlyDisplay,
    yearlyPrice: yearlyDisplay,
    price: monthlyDisplay || yearlyDisplay || 0,
    buttonText: 'Start',
    buttonStyle: id.toLowerCase() === 'free' ? 'bg-gray-100 hover:bg-gray-200 text-black' : (isPopular ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-violet-100 hover:bg-violet-200 text-violet-500'),
    outlineStyle: id.toLowerCase() === 'free' ? 'outline-1 outline-offset-[-1px] outline-gray-100' : 'outline outline-1 outline-offset-[-1px] outline-gray-100',
    nameColor: isPopular ? 'text-violet-500' : 'text-black',
    features,
    isPopular,
    image,
  };
};

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('PRO');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuth = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartClick = async (plan) => {
    if (!isAuth) {
      toast.info('Please log in to continue');
      navigate('/login', { state: { from: location, intendedPlan: { ...plan, billingPeriod: billingCycle } } });
      return;
    }

    const payload = {
      plan: plan.id || plan.name,
      planName: plan.name,
      billingPeriod: billingCycle,
      imageRoute: plan.image || null,
    };

    try {
      const data = await dispatch(createCheckout(payload)).unwrap();
      const url = data?.url || data?.data?.url;
      if (url) window.location.href = url;
      else toast.error('Checkout failed: no redirect URL');
    } catch (err) {
      toast.error(err?.toString() || 'Checkout failed');
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPlans()
      .then((data) => {
        if (!mounted) return;
        const mapped = (data || []).map((p) => mapApiPlanToView(p, billingCycle));
        if (mapped.length === 0) throw new Error('No plans available');
        setPlans(mapped);
        // ensure selectedPlan exists
        if (!mapped.find((m) => m.name === selectedPlan)) setSelectedPlan(mapped[0].name);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load plans');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [billingCycle]);

  return (
    <section id='pricing' className="w-full bg-white dark:bg-black py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-8 md:gap-12">
          {/* Header */}
          <div className="flex max-w-2xl flex-col items-center justify-start gap-6 md:gap-8">
            <div className="justify-start text-center">
              <span className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
                Simple Pricing.{' '}
              </span>
              <span className="font-['Inter'] text-2xl font-semibold text-indigo-600 md:text-3xl lg:text-4xl">
                Powerful Results.
              </span>
            </div>

            {/* Billing Toggle */}
            <div className="flex w-full max-w-md items-center justify-start gap-4 rounded-[61px] bg-gray-100 dark:bg-gray-700 p-2 md:gap-6 md:p-3">
              <div
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-[46px] px-4 py-3 transition-all md:px-8 md:py-4 ${billingCycle === 'monthly' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''
                  }`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div
                  className={`justify-start font-['Inter'] text-sm md:text-base ${billingCycle === 'monthly' ? 'font-bold text-black dark:text-white' : 'font-normal text-black dark:text-white '
                    }`}
                >
                  Monthly
                </div>
              </div>
              <div
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[46px] px-4 py-3 transition-all md:gap-2 md:px-8 md:py-4 ${billingCycle === 'yearly' ? 'bg-white dark:bg-gray-900 shadow-sm' : ''
                  }`}
                onClick={() => setBillingCycle('yearly')}
              >
                <div className="justify-start font-['Inter'] text-sm font-normal text-black  md:text-base dark:text-white">
                  Yearly
                </div>
                <div className="justify-start font-['Inter'] text-xs font-bold text-green-600 md:text-base">
                  SAVE 20%
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-8 grid w-full grid-cols-1 gap-6 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading plans…</div>
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-600">{error}</div>
            ) : (
              plans.map((plan, index) => (
                <PricingCard
                  key={plan.id || index}
                  plan={plan}
                  billingCycle={billingCycle}
                  isSelected={selectedPlan === plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  onStartClick={(p) => handleStartClick(p)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
