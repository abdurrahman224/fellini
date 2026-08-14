import React, { useState } from 'react'

const TimePickerModal = ({ isOpen, editingTimeType, initialTime, onClose, onSave }) => {
  const [tempHour, setTempHour] = useState(() => {
    const [time] = initialTime.split(' ')
    return parseInt(time.split(':')[0])
  })
  const [tempMinute, setTempMinute] = useState(() => {
    const [time] = initialTime.split(' ')
    return parseInt(time.split(':')[1])
  })
  const [tempPeriod, setTempPeriod] = useState(() => initialTime.split(' ')[1])
  const [lastScrollTime, setLastScrollTime] = useState(0)

  if (!isOpen) return null

  const handleSave = () => {
    const formattedTime = `${String(tempHour).padStart(2, '0')}:${String(tempMinute).padStart(2, '0')} ${tempPeriod}`
    onSave(formattedTime)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 bg-opacity-50 px-4 animate-fadeIn">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ color: '#211E2D' }}>
              {editingTimeType === 'wake' ? 'Set Wake Up Time' : 'Set Sleep Time'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Time Picker */}
        <div className="px-6 py-10">
          {/* Column Headers */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="w-20 text-center">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">HOUR</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">MINUTE</span>
            </div>
            <div className="w-20 text-center">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">PERIOD</span>
            </div>
          </div>

          {/* Time Picker Columns */}
          <div className="flex items-center justify-center gap-4 relative">
            {/* Hour Column */}
            <div 
              className="w-20 flex flex-col items-center"
              onWheel={(e) => {
                e.preventDefault()
                const now = Date.now()
                if (now - lastScrollTime < 150) return
                setLastScrollTime(now)
                const delta = e.deltaY > 0 ? 1 : -1
                let newHour = tempHour + delta
                if (newHour < 1) newHour = 12
                if (newHour > 12) newHour = 1
                setTempHour(newHour)
              }}
            >
              {[...Array(5)].map((_, index) => {
                const offset = index - 2
                let displayHour = tempHour + offset
                if (displayHour < 1) displayHour += 12
                if (displayHour > 12) displayHour -= 12
                const isSelected = offset === 0
                
                return (
                  <div key={index} className="relative w-full">
                    <button
                      onClick={() => {
                        let newHour = tempHour + offset
                        if (newHour < 1) newHour += 12
                        if (newHour > 12) newHour -= 12
                        setTempHour(newHour)
                      }}
                      className={`w-full py-2 text-center transition-all ${
                        isSelected 
                          ? 'text-3xl font-bold text-[#7C3AED]' 
                          : 'text-2xl font-medium text-gray-300'
                      }`}
                    >
                      {String(displayHour).padStart(2, '0')}
                    </button>
                    {isSelected && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#7C3AED]"></div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Colon Separator */}
            <div className="flex flex-col gap-1 text-gray-400 -mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            </div>

            {/* Minute Column */}
            <div 
              className="w-20 flex flex-col items-center"
              onWheel={(e) => {
                e.preventDefault()
                const now = Date.now()
                if (now - lastScrollTime < 150) return
                setLastScrollTime(now)
                const delta = e.deltaY > 0 ? 1 : -1
                let newMinute = tempMinute + delta
                if (newMinute < 0) newMinute = 59
                if (newMinute > 59) newMinute = 0
                setTempMinute(newMinute)
              }}
            >
              {[...Array(5)].map((_, index) => {
                const offset = index - 2
                let displayMinute = tempMinute + offset
                if (displayMinute < 0) displayMinute += 60
                if (displayMinute > 59) displayMinute -= 60
                const isSelected = offset === 0
                
                return (
                  <div key={index} className="relative w-full">
                    <button
                      onClick={() => {
                        let newMinute = tempMinute + offset
                        if (newMinute < 0) newMinute += 60
                        if (newMinute > 59) newMinute -= 60
                        setTempMinute(newMinute)
                      }}
                      className={`w-full py-2 text-center transition-all ${
                        isSelected 
                          ? 'text-3xl font-bold text-[#7C3AED]' 
                          : 'text-2xl font-medium text-gray-300'
                      }`}
                    >
                      {String(displayMinute).padStart(2, '0')}
                    </button>
                    {isSelected && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#7C3AED]"></div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="w-4"></div>

            {/* Period Column */}
            <div 
              className="w-20 flex flex-col items-center"
              onWheel={(e) => {
                e.preventDefault()
                const now = Date.now()
                if (now - lastScrollTime < 150) return
                setLastScrollTime(now)
                setTempPeriod(prev => prev === 'AM' ? 'PM' : 'AM')
              }}
            >
              {['', tempPeriod === 'AM' ? 'PM' : 'AM', tempPeriod, tempPeriod === 'AM' ? 'PM' : 'AM', ''].map((period, index) => {
                const isSelected = index === 2
                
                return (
                  <div key={index} className="relative w-full">
                    {period && (
                      <>
                        <button
                          onClick={() => setTempPeriod(period)}
                          className={`w-full py-2 text-center transition-all ${
                            isSelected 
                              ? 'text-3xl font-bold text-[#7C3AED]' 
                              : 'text-2xl font-medium text-gray-300'
                          }`}
                        >
                          {period}
                        </button>
                        {isSelected && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#7C3AED]"></div>
                        )}
                      </>
                    )}
                    {!period && <div className="py-2 h-12"></div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Time Display */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 mb-2">Selected Time</p>
            <p className="text-4xl font-bold text-[#7C3AED]">
              {String(tempHour).padStart(2, '0')}:{String(tempMinute).padStart(2, '0')} {tempPeriod}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors shadow-lg hover:shadow-xl"
          >
            Set Time
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimePickerModal
