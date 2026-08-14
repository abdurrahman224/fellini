import React from 'react'
import OnboardingLayout from './OnboardingLayout'

const Step7Loading = () => {
  return (
    <OnboardingLayout>
      <div className="w-full max-w-2xl text-center space-y-8 sm:space-y-12">
        <div className="flex justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#7C3AED] border-r-[#7C3AED] animate-spin"></div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            Finalizing Your Plan...
          </h1>

          <div className="space-y-3 sm:space-y-4 px-4">
            <p className="text-sm sm:text-base md:text-lg animate-pulse" style={{ color: '#595959' }}>
              Optimizing hormonal windows...
            </p>
            <p className="text-sm sm:text-base md:text-lg animate-pulse animation-delay-2000" style={{ color: '#595959' }}>
              Designing deep work blocks...
            </p>
            <p className="text-sm sm:text-base md:text-lg animate-pulse animation-delay-4000" style={{ color: '#595959' }}>
              Refining evening restoration...
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step7Loading
