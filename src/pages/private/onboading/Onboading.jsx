import React, { useState, useEffect } from 'react'
import Step1Welcome from './components/Step1Welcome'
import Step2Goals from './components/Step2Goals'
import Step3CoreObjective from './components/Step3CoreObjective'
import Step4DailyContext from './components/Step4DailyContext'
import Step5CircadianRhythm from './components/Step5CircadianRhythm'
import Step6PickVibe from './components/Step6PickVibe'
import Step7Loading from './components/Step7Loading'
import Step8Complete from './components/Step8Complete'

// Helper function to get from localStorage safely
const getFromStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key)
    if (key === 'onboardingStep') {
      const s = parseInt(value)
      return Number.isInteger(s) && s > 0 ? s : defaultValue
    }
    if (key === 'onboardingGoals') {
      return value ? JSON.parse(value) : defaultValue
    }
    return value || defaultValue
  } catch (e) {
    return defaultValue
  }
}

const Onboading = () => {
  const [step, setStep] = useState(() => getFromStorage('onboardingStep', 1))
  const [selectedGoals, setSelectedGoals] = useState(() => getFromStorage('onboardingGoals', []))
  const [coreObjective, setCoreObjective] = useState(() => getFromStorage('onboardingCoreObjective', null))
  const [dailyContext, setDailyContext] = useState(() => getFromStorage('onboardingDailyContext', null))
  const [wakeUpTime, setWakeUpTime] = useState(() => getFromStorage('onboardingWakeUpTime', '07:00 AM'))
  const [sleepTime, setSleepTime] = useState(() => getFromStorage('onboardingSleepTime', '11:00 PM'))
  const [selectedVibe, setSelectedVibe] = useState(() => getFromStorage('onboardingVibe', null))

  const toggleGoal = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('onboardingStep', String(step))
      localStorage.setItem('onboardingGoals', JSON.stringify(selectedGoals))
      if (coreObjective) localStorage.setItem('onboardingCoreObjective', coreObjective)
      if (dailyContext) localStorage.setItem('onboardingDailyContext', dailyContext)
      if (wakeUpTime) localStorage.setItem('onboardingWakeUpTime', wakeUpTime)
      if (sleepTime) localStorage.setItem('onboardingSleepTime', sleepTime)
      if (selectedVibe) localStorage.setItem('onboardingVibe', selectedVibe)
    } catch (e) {}

    // Clear storage when onboarding finished
    if (step >= 8) {
      try {
        ['onboardingStep', 'onboardingGoals', 'onboardingCoreObjective', 
         'onboardingDailyContext', 'onboardingWakeUpTime', 'onboardingSleepTime', 'onboardingVibe']
          .forEach(key => localStorage.removeItem(key))
      } catch (e) {}
    }
  }, [step, selectedGoals, coreObjective, dailyContext, wakeUpTime, sleepTime, selectedVibe])

  // Auto-navigate from step 7 to step 8
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => setStep(8), 4000)
      return () => clearTimeout(timer)
    }
  }, [step])

  // Render steps
  switch (step) {
    case 1:
      return <Step1Welcome onGetStarted={() => setStep(2)} />
    
    case 2:
      return (
        <Step2Goals
          selectedGoals={selectedGoals}
          onToggleGoal={toggleGoal}
          onContinue={() => selectedGoals.length >= 2 && setStep(3)}
          onSkip={() => setStep(3)}
        />
      )
    
    case 3:
      return (
        <Step3CoreObjective
          coreObjective={coreObjective}
          onSelect={setCoreObjective}
          onContinue={() => coreObjective && setStep(4)}
          onBack={() => setStep(2)}
        />
      )
    
    case 4:
      return (
        <Step4DailyContext
          dailyContext={dailyContext}
          onSelect={setDailyContext}
          onContinue={() => dailyContext && setStep(5)}
          onBack={() => setStep(3)}
        />
      )
    
    case 5:
      return (
        <Step5CircadianRhythm
          wakeUpTime={wakeUpTime}
          sleepTime={sleepTime}
          onWakeUpChange={setWakeUpTime}
          onSleepChange={setSleepTime}
          onContinue={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )
    
    case 6:
      return (
        <Step6PickVibe
          selectedVibe={selectedVibe}
          onSelect={setSelectedVibe}
          onContinue={() => selectedVibe && setStep(7)}
          onBack={() => setStep(5)}
        />
      )
    
    case 7:
      return <Step7Loading />
    
    default:
      return (
        <Step8Complete
          selectedGoals={selectedGoals}
          coreObjective={coreObjective}
          dailyContext={dailyContext}
          wakeUpTime={wakeUpTime}
          sleepTime={sleepTime}
          selectedVibe={selectedVibe}
          onStart={() => {
            console.log('Starting app with:', { selectedGoals, coreObjective, dailyContext, wakeUpTime, sleepTime, selectedVibe })
            // Add navigation logic here
          }}
        />
      )
  }
}

export default Onboading
