import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseInputClasses = `
    block rounded-md border text-text-primary text-sm
    placeholder:text-text-secondary
    disabled:bg-background-main disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    transition-colors
  `;

  const inputClasses = `
    ${baseInputClasses}
    ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}
    ${leftIcon ? 'pl-10' : 'pl-4'}
    ${rightIcon ? 'pr-10' : 'pr-4'}
    ${fullWidth ? 'w-full' : 'w-auto'}
    py-2
    ${className}
  `.trim();

  return (
    <div className={fullWidth ? 'w-full' : 'w-auto'}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block mb-1.5 text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p 
          className={`mt-1.5 text-sm ${error ? 'text-danger' : 'text-text-secondary'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;