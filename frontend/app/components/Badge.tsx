import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-700 border border-blue-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
    md: 'px-3 py-1 text-sm font-medium rounded-lg',
  }

  return (
    <span className={`${variants[variant]} ${sizes[size]} inline-block ${className}`}>
      {children}
    </span>
  )
}
