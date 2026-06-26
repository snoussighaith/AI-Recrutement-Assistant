import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outline'
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100/50',
    elevated: 'bg-white shadow-lg border border-gray-100/50 hover:shadow-xl hover:-translate-y-0.5',
    outline: 'bg-white/50 border-2 border-dashed border-gray-200',
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-gray-100/50 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-gray-100/50 flex gap-3 ${className}`}>{children}</div>
}
