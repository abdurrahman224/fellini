import React from 'react'
import { Check } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const GOALS = [
  'Increase Productivity',
  'Strict Coach',
  'Build Healthy Habits',
  'Reduce Stress',
  'Career Milestones',
  'Mental Clarity',
  'Physical Fitness'
]

const Step2Goals = ({ selectedGoals, onToggleGoal, onContinue, onSkip }) => {
  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-[725px] text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            What defines success for you?
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: '#595959' }}>
            Select at least 2 areas of improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto px-4">
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal)
            return (
              <button
                key={goal}
                onClick={() => onToggleGoal(goal)}
                className={`
                  relative px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base font-medium text-left
                  ${isSelected 
                    ? 'bg-purple-100 border-purple-300' 
                    : 'bg-white border-gray-200 hover:border-purple-200'
                  }
                  hover:shadow-md active:scale-[0.98]
                `}
                style={{ color: isSelected ? '#211E2D' : '#475569' }}
              >
                <span className="block pr-8">{goal}</span>
                {isSelected && (
                  <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-24 sm:gap-6 pt-4 sm:pt-6">
          <button
            onClick={onSkip}
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors underline-offset-2 hover:underline order-2 sm:order-1"
          >
            Skip for now
          </button>
          
          <PrimaryButton
            onClick={onContinue}
            disabled={selectedGoals.length < 2}
            className="px-8 sm:px-12 md:px-14 py-3 sm:py-3.5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step2Goals
