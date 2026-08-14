import React from 'react'
import { ChevronLeft } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const DAILY_CONTEXTS = [
  'Corporate Professional',
  'Remote Freelancer',
  'Full-time Student',
  'Entrepreneur',
  'Creative Artist',
  'Stay-at-home Parent'
]

const Step4DailyContext = ({ dailyContext, onSelect, onContinue, onBack }) => {
  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-[725px] text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            Daily context
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: '#595959' }}>
            We'll build your routines around your reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto px-4">
          {DAILY_CONTEXTS.map((context) => {
            const isSelected = dailyContext === context
            return (
              <button
                key={context}
                onClick={() => onSelect(context)}
                className={`
                  relative px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base md:text-lg font-medium text-center
                  ${isSelected 
                    ? 'bg-purple-100 border-purple-300 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }
                  hover:shadow-md active:scale-[0.98]
                `}
                style={{ color: isSelected ? '#211E2D' : '#475569' }}
              >
                {context}
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
            disabled={!dailyContext}
            className="px-8 sm:px-12 md:px-14 py-3 sm:py-3.5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step4DailyContext
