"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Business Profile', path: '/onboarding/steps/business-profile' },
  { label: 'Admin Contact', path: '/onboarding/steps/business-admin' },
  { label: 'Payroll Setup', path: '/onboarding/steps/business-settings' },
  { label: 'Compliance Details', path: '/onboarding/steps/compliance' },
  { label: 'Review & Confirm', path: '/onboarding/steps/confirmation' },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => step.path === pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
            
            {/* Steps */}
            {steps.map((step, index) => {
              const isActive = pathname === step.path;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.path} className="relative z-10">
                  <Link
                    href={step.path}
                    className={cn(
                      'flex flex-col items-center group',
                      isCompleted && 'cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                      isActive ? 'border-blue-600 bg-blue-600 text-white' :
                      isCompleted ? 'border-blue-600 bg-blue-600 text-white' :
                      'border-gray-300 bg-white text-gray-400'
                    )}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      'mt-2 text-xs font-medium transition-colors',
                      isActive ? 'text-blue-600' :
                      isCompleted ? 'text-blue-600' :
                      'text-gray-500'
                    )}>
                      {step.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
