import React from 'react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const Step1Welcome = ({ onGetStarted }) => {
  return (
    <OnboardingLayout>
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8">
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          <img 
            src="/logo.png" 
            alt="Elyxa.Ai Logo" 
            className="h-16 md:h-20 lg:h-28 w-auto object-contain"
          />
        </div>

        <div className="space-y-3 sm:space-y-2">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            Unlock your <span className="text-[#7C3AED]">Zenith</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg max-w-4xl mx-auto px-4 leading-relaxed" style={{ color: '#595959' }}>
            A science-backed, AI-driven blueprint for the highest version of yourself.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
          <PrimaryButton 
            onClick={onGetStarted}
            className="px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Get started
          </PrimaryButton>
          
          <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium">
            TAKES ONLY 2 MINUTES
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step1Welcome
