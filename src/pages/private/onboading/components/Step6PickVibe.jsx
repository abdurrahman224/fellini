import React from 'react'
import { BarChart3, Zap, Flower2, Target, Check, ChevronLeft } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const VIBES = [
  { icon: BarChart3, label: 'Disciplined & Stoic', description: 'Consistent and logic-focused.' },
  { icon: Zap, label: 'Energetic & Hype', description: 'High-octane and encouraging.' },
  { icon: Flower2, label: 'Mindful & Balanced', description: 'Calm, balanced, and healthy.' },
  { icon: Target, label: 'Direct & Result-Oriented', description: 'Efficient and goal-oriented.' }
]

const Step6PickVibe = ({ selectedVibe, onSelect, onContinue, onBack }) => {
  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-[725px] text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            Pick your vibe
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: '#595959' }}>
            How should we talk to you?
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 max-w-xl mx-auto px-4">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibe === vibe.label
            const Icon = vibe.icon
            return (
              <button
                key={vibe.label}
                onClick={() => onSelect(vibe.label)}
                className={`
                  relative px-4 sm:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl
                  border-2 transition-all duration-200 text-left
                  ${isSelected 
                    ? 'bg-purple-50 border-purple-400 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }
                  hover:shadow-md active:scale-[0.98]
                  flex items-center gap-3 sm:gap-4
                `}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 text-[#7C3AED]" />
                
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold mb-0.5" style={{ color: '#211E2D' }}>
                    {vibe.label}
                  </h3>
                  <p className="text-xs sm:text-sm" style={{ color: '#595959' }}>
                    {vibe.description}
                  </p>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" strokeWidth={3} />
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
            disabled={!selectedVibe}
            className="px-8 sm:px-12 md:px-14 py-3 sm:py-3.5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            Generate My Blueprint
          </PrimaryButton>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step6PickVibe
