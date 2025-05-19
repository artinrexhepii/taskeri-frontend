import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  contentClassName = ''
}) => {
  return (
    <div className={`bg-background-paper rounded-lg shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={`p-6 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;