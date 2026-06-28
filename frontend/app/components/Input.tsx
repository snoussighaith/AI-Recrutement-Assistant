import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder:text-gray-400 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 resize-none ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  )
}
