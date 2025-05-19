import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <select
        className={`block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
          error ? 'border-red-500' : 'border-border'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  );
};

export default Select;