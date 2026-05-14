import React from 'react';

interface ConfidenceBarProps {
  value: number;
  label?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value,
  label,
  showLabel = true,
  animated = true,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const getColor = (val: number) => {
    if (val >= 80) return 'from-secondary-400 to-secondary-600';
    if (val >= 60) return 'from-warning-400 to-warning-600';
    return 'from-danger-400 to-danger-600';
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
            {label || 'Confidence'}
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-dark-text-primary">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-neutral-200 dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor(clampedValue)} rounded-full ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${clampedValue}%`,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
    </div>
  );
};
