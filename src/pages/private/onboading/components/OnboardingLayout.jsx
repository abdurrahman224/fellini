import React from 'react'

const OnboardingLayout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default OnboardingLayout
