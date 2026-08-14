import React from 'react';
import { CircleCheck } from 'lucide-react';

const PricingCard = ({ plan, billingCycle, isSelected, onClick, onStartClick }) => {
  const {
    name,
    description,
    price,
    monthlyPrice,
    yearlyPrice,
    buttonText,
    buttonStyle,
    outlineStyle,
    features,
    isPopular,
    nameColor,
  } = plan;

  const displayPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;
  const isFreePlan = plan.isFree || (typeof price === 'number' && price === 0) || (name && name.toLowerCase() === 'free');

  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col items-start justify-start gap-8 rounded-lg bg-white dark:bg-zinc-800 p-5 md:gap-10 md:p-6 transition-all ${outlineStyle} ${isPopular ? 'lg:shadow-lg' : ''
        } ${isSelected ? 'ring-2 ring-violet-500 shadow-xl scale-105 my-4 md:my-0' : 'hover:shadow-lg'}`}
    >
    
      {isPopular && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          Most Popular
        </div>
      )}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full flex-col items-start justify-start gap-1">
          <div
            className={`justify-start font-['Inter'] dark:text-white text-xl leading-8 font-medium md:text-2xl md:leading-9 ${nameColor}`}
          >
            {name}
          </div>
          <div className="justify-start  font-['Inter'] text-sm leading-5 font-normal text-black md:text-base md:leading-6 dark:text-white md:min-h-11.5">
            {description}
          </div>
        </div>
        <div className="flex w-full items-end justify-start gap-1">
          <div className="justify-start font-['Inter'] text-base leading-6 font-semibold text-black md:text-lg dark:text-white">
            {displayPrice || `$${price}`}
          </div>
        </div>
      </div>
      <div className="w-full">
        <button
          type="button"
          disabled={isFreePlan}
          aria-disabled={isFreePlan}
          onClick={(e) => { e.stopPropagation(); if (!isFreePlan) onStartClick && onStartClick(plan); }}
          className={`flex w-full items-center justify-center gap-2.5 rounded px-2.5 py-3 transition-all ${buttonStyle} ${isFreePlan ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="justify-start font-['Inter'] text-sm leading-6 font-normal md:text-base">
            {buttonText}
          </div>
        </button>
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-3 md:gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex w-full items-center justify-start gap-2">
            <CircleCheck className="h-5 w-5 flex-shrink-0 text-violet-500" />
            <div className="justify-start font-['Inter'] text-sm leading-5 font-normal text-black dark:text-white md:text-base">
              {feature}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
