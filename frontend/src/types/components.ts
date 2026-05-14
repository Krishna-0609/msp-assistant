import { ReactNode } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'active' | 'inactive' | 'pending' | 'error';

export interface ComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonVariants {
  [key: string]: string;
}

export interface IconProps {
  size?: Size;
  className?: string;
}
