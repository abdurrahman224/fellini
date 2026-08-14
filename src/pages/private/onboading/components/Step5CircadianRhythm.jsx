import React, { useState } from 'react'
import { Sun, Moon, Clock, ChevronLeft } from 'lucide-react'
import PrimaryButton from '../../../../components/ui/PrimaryButton'
import OnboardingLayout from './OnboardingLayout'
import TimePickerModal from './TimePickerModal'

const Step5CircadianRhythm = ({ wakeUpTime, sleepTime, onWakeUpChange, onSleepChange, onContinue, onBack }) => {
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [editingTimeType, setEditingTimeType] = useState(null)

  const openTimePicker = (type) => {
    setEditingTimeType(type)
    setTimePickerOpen(true)
  }

  const handleSaveTime = (formattedTime) => {
    if (editingTimeType === 'wake') {
      onWakeUpChange(formattedTime)
    } else {
      onSleepChange(formattedTime)
    }
    setTimePickerOpen(false)
    setEditingTimeType(null)
  }

  return (
    <OnboardingLayout className="py-8">
      <div className="w-full max-w-[725px] text-center space-y-6 sm:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4 text-[#7C3AED]">
            The Circadian Rhythm
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-medium" style={{ color: '#595959' }}>
            Your natural energy levels dictate your output
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl max-w-md mx-auto px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 space-y-8 sm:space-y-10">
          {/* Wake Up Time Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <span>WAKE UP TIME</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: '#211E2D' }}>
              <span>{wakeUpTime}</span>
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 opacity-60" />
            </div>

            <button
              onClick={() => openTimePicker('wake')}
              className="mx-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full text-sm font-medium text-[#7C3AED] hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Clock className="w-4 h-4" />
              Change Time
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 sm:px-4 text-sm sm:text-base text-gray-500 font-medium">to</span>
            </div>
          </div>

          {/* Sleep Time Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <span>SLEEP TIME</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: '#211E2D' }}>
              <span>{sleepTime}</span>
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 opacity-60" />
            </div>

            <button
              onClick={() => openTimePicker('sleep')}
              className="mx-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full text-sm font-medium text-[#7C3AED] hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Clock className="w-4 h-4" />
              Change Time
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-12 lg:gap-16 pt-4 sm:pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors group order-2 sm:order-1"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          
          <PrimaryButton
            onClick={onContinue}
            className="px-8 sm:px-12 md:px-14 py-3 sm:py-3.5 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            Sync Times
          </PrimaryButton>
        </div>
      </div>

      <TimePickerModal
        isOpen={timePickerOpen}
        editingTimeType={editingTimeType}
        initialTime={editingTimeType === 'wake' ? wakeUpTime : sleepTime}
        onClose={() => { setTimePickerOpen(false); setEditingTimeType(null) }}
        onSave={handleSaveTime}
      />
    </OnboardingLayout>
  )
}

export default Step5CircadianRhythm
