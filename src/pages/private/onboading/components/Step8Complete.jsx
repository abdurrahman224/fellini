import React from 'react'
import { Brain, Target, Heart, Clock, Check, Sparkles } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'

const SummaryCard = ({ icon: Icon, title, content }) => (
  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#7C3AED]" />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-sm sm:text-base font-semibold mb-2" style={{ color: '#211E2D' }}>
          {title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#595959' }}>
          {content}
        </p>
      </div>
    </div>
  </div>
)

const Step8Complete = ({ selectedGoals, coreObjective, dailyContext, wakeUpTime, sleepTime, selectedVibe, onStart }) => {
  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8 animate-fadeIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-4" style={{ color: '#211E2D' }}>
            Your Blueprint is <span className="text-[#7C3AED]">Ready!</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto px-4" style={{ color: '#595959' }}>
            We've crafted a personalized plan based on your goals and preferences.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto px-4 pt-4">
          <SummaryCard 
            icon={Target} 
            title="Your Goals" 
            content={selectedGoals.length > 0 ? selectedGoals.join(', ') : 'No goals selected'} 
          />
          <SummaryCard 
            icon={Brain} 
            title="Core Priority" 
            content={coreObjective || 'Not specified'} 
          />
          <SummaryCard 
            icon={Heart} 
            title="Lifestyle" 
            content={dailyContext || 'Not specified'} 
          />
          <SummaryCard 
            icon={Clock} 
            title="Sleep Schedule" 
            content={`${wakeUpTime} - ${sleepTime}`} 
          />
        </div>

        {/* CTA Button */}
        <div className="pt-4 sm:pt-6">
          <PrimaryButton
            onClick={onStart}
            className="px-10 sm:px-14 md:px-16 py-3.5 sm:py-4 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start My Journey
          </PrimaryButton>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
            Let's unlock your zenith together! <Sparkles className="w-4 h-4 text-yellow-500 inline" />
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Step8Complete
