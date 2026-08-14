import React from 'react'
import { Brain, Target, Heart, TrendingUp, Check, ChevronLeft } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const CORE_OBJECTIVES = [
  { icon: Brain, label: 'Deep Concentration' },
  { icon: Target, label: 'Physical Vitality' },
  { icon: Heart, label: 'Emotional Balance' },
  { icon: TrendingUp, label: 'Career Growth' }
]

const Step3CoreObjective = ({ coreObjective, onSelect, onContinue, onBack }) => {
  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-[725px] text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            The core objective
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: '#595959' }}>
            What is your #1st priority this month?
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 max-w-xl mx-auto px-4">
          {CORE_OBJECTIVES.map((objective) => {
            const Icon = objective.icon
            const isSelected = coreObjective === objective.label
            return (
              <button
                key={objective.label}
                onClick={() => onSelect(objective.label)}
                className={`
                  relative px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base md:text-lg font-medium text-left
                  ${isSelected 
                    ? 'bg-purple-100 border-purple-300 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }
                  hover:shadow-md active:scale-[0.98]
                  flex items-center gap-3 sm:gap-4
                `}
                style={{ color: isSelected ? '#211E2D' : '#475569' }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                <span className="flex-1">{objective.label}</span>
                {isSelected && (
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-24 sm:gap-6 pt-4 sm:pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors group order-2 sm:order-1"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          
          <PrimaryButton
            onClick={onContinue}
            disabled={!coreObjective}
            className="px-8 sm:px-12 md:px-14 py-3 sm:py-3.5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step3CoreObjective
