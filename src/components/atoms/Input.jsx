import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  ...props 
}, ref) => {
  return (
<div className="space-y-1.5 sm:space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`input-field ${error ? 'border-error focus:ring-error' : ''} ${className}`}
        {...props}
      />
{error && (
        <p className="text-xs sm:text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input