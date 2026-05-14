import React from 'react';
import { Button } from './Button';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, subtitle, footer, size = 'md', className, children, ...props }, ref) => {
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 animate-fadeIn"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={[
            'relative bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg animate-scaleIn',
            sizeClasses[size],
            'w-11/12 max-h-[90vh] overflow-y-auto',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        >
          {(title || subtitle) && (
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              {title && (
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text-primary">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="p-6">
            {children}
          </div>

          {footer && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 flex gap-3 justify-end">
              {footer}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-dark-text-secondary transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
