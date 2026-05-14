import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outline';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg',
  elevated: 'bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg',
  outline: 'bg-transparent border-2 border-primary-500 rounded-lg',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, className, children, ...props }, ref) => {
    const baseClasses = 'transition-all duration-200';
    const interactiveClasses = interactive ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : '';

    const classNames = [
      baseClasses,
      variantClasses[variant],
      interactiveClasses,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ divider = true, className, ...props }, ref) => {
    const dividerClass = divider ? 'border-b border-neutral-200 dark:border-neutral-700' : '';
    const classNames = ['p-4 sm:p-6', dividerClass, className].filter(Boolean).join(' ');

    return <div ref={ref} className={classNames} {...props} />;
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => {
    const classNames = ['p-4 sm:p-6', className].filter(Boolean).join(' ');
    return <div ref={ref} className={classNames} {...props} />;
  }
);

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divider = true, className, ...props }, ref) => {
    const dividerClass = divider ? 'border-t border-neutral-200 dark:border-neutral-700' : '';
    const classNames = ['p-4 sm:p-6', dividerClass, className].filter(Boolean).join(' ');

    return <div ref={ref} className={classNames} {...props} />;
  }
);

CardFooter.displayName = 'CardFooter';
