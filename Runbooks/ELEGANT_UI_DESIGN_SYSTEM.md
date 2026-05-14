# MSP Assistant - Elegant UI Design System

## 🎨 Complete UI/UX Design Guide with Component Library

---

## PART 1: Folder Structure

### Frontend Directory Organization

```
frontend/
├── public/
│   ├── icons/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   ├── social-icons/
│   │   └── navigation-icons/
│   ├── images/
│   │   ├── hero/
│   │   ├── backgrounds/
│   │   └── illustrations/
│   └── fonts/
│       ├── inter/
│       └── space-mono/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Alert.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── CostCard.tsx
│   │   │   ├── Heatmap.tsx
│   │   │   ├── ServiceBreakdown.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── AlertWidget.tsx
│   │   │   ├── ConfidenceBar.tsx
│   │   │   └── DashboardGrid.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ReportFilterForm.tsx
│   │   │   └── AlertConfigForm.tsx
│   │   │
│   │   └── data-display/
│   │       ├── DataTable.tsx
│   │       ├── Pagination.tsx
│   │       ├── FilterBar.tsx
│   │       └── ExportButton.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Chat.tsx
│   │   ├── Reports.tsx
│   │   ├── Costs.tsx
│   │   ├── Admin.tsx
│   │   └── NotFound.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.css
│   │   ├── animations.css
│   │   ├── utilities.css
│   │   └── variables.css
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useDarkMode.ts
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useWebSocket.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ChatContext.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── costs.ts
│   │   └── chat.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── components.ts
│   │   └── models.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## PART 2: Design System & Color Palette

### Color Scheme (Dark + Light Mode)

```css
/* PRIMARY COLORS */
--primary-50:   #f0f9ff    (Light sky)
--primary-100:  #e0f2fe
--primary-200:  #bae6fd
--primary-300:  #7dd3fc
--primary-400:  #38bdf8
--primary-500:  #0ea5e9    (Main primary)
--primary-600:  #0284c7
--primary-700:  #0369a1
--primary-800:  #075985
--primary-900:  #0c3d66

/* SECONDARY COLORS (Accent) */
--secondary-50:  #f0fdf4
--secondary-500: #22c55e    (Success green)
--secondary-600: #16a34a
--secondary-700: #15803d

/* WARNING / ALERT COLORS */
--warning-50:    #fffbeb
--warning-500:   #f59e0b    (Amber)
--warning-600:   #d97706
--warning-700:   #b45309

/* DANGER / ERROR COLORS */
--danger-50:     #fef2f2
--danger-500:    #ef4444    (Red)
--danger-600:    #dc2626
--danger-700:    #b91c1c

/* NEUTRAL COLORS (Text & Background) */
/* Light Mode */
--neutral-50:    #f9fafb
--neutral-100:   #f3f4f6
--neutral-200:   #e5e7eb
--neutral-300:   #d1d5db
--neutral-400:   #9ca3af
--neutral-500:   #6b7280
--neutral-600:   #4b5563
--neutral-700:   #374151
--neutral-800:   #1f2937
--neutral-900:   #111827

/* Dark Mode */
--dark-bg-primary:   #0f172a    (Background)
--dark-bg-secondary: #1e293b    (Cards)
--dark-bg-tertiary:  #334155    (Hover)
--dark-text-primary: #f1f5f9    (Main text)
--dark-text-secondary: #cbd5e1  (Secondary text)
--dark-text-tertiary: #94a3b8   (Disabled text)

/* COST-SPECIFIC COLORS */
--cost-low:     #10b981     (Green - Savings)
--cost-medium:  #f59e0b     (Amber - Moderate)
--cost-high:    #ef4444     (Red - High)
--cost-spike:   #e11d48     (Rose - Alert)

/* BRAND COLORS */
--brand-primary:    #0ea5e9   (Sky blue)
--brand-secondary:  #22c55e   (Green)
--brand-accent:     #f59e0b   (Amber)
```

### Typography System

```css
/* FONT FAMILIES */
--font-sans:      'Inter', system-ui, -apple-system, sans-serif;
--font-mono:      'Space Mono', monospace;

/* FONT SIZES */
--text-xs:        0.75rem    (12px)
--text-sm:        0.875rem   (14px)
--text-base:      1rem       (16px)
--text-lg:        1.125rem   (18px)
--text-xl:        1.25rem    (20px)
--text-2xl:       1.5rem     (24px)
--text-3xl:       1.875rem   (30px)
--text-4xl:       2.25rem    (36px)

/* FONT WEIGHTS */
--weight-light:      300
--weight-normal:     400
--weight-medium:     500
--weight-semibold:   600
--weight-bold:       700
--weight-extrabold:  800

/* LINE HEIGHTS */
--leading-tight:     1.25
--leading-snug:      1.375
--leading-normal:    1.5
--leading-relaxed:   1.625
--leading-loose:     2

/* LETTER SPACING */
--tracking-tight:    -0.02em
--tracking-normal:   0em
--tracking-wide:     0.025em
--tracking-wider:    0.05em
```

### Spacing System (8px Base Unit)

```css
--space-0:    0
--space-1:    0.25rem    (4px)
--space-2:    0.5rem     (8px)
--space-3:    0.75rem    (12px)
--space-4:    1rem       (16px)
--space-6:    1.5rem     (24px)
--space-8:    2rem       (32px)
--space-10:   2.5rem     (40px)
--space-12:   3rem       (48px)
--space-16:   4rem       (64px)
--space-20:   5rem       (80px)
--space-24:   6rem       (96px)
```

### Border Radius

```css
--radius-none:    0
--radius-sm:      0.25rem   (2px)
--radius-base:    0.375rem  (3px)
--radius-md:      0.5rem    (4px)
--radius-lg:      0.75rem   (6px)
--radius-xl:      1rem      (8px)
--radius-2xl:     1.5rem    (12px)
--radius-full:    9999px    (Pill)
```

### Shadows

```css
--shadow-none:  0 0 #0000

--shadow-sm:    0 1px 2px 0 rgba(0, 0, 0, 0.05)

--shadow-base:  0 1px 3px 0 rgba(0, 0, 0, 0.1),
                0 1px 2px 0 rgba(0, 0, 0, 0.06)

--shadow-md:    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06)

--shadow-lg:    0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05)

--shadow-xl:    0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* ELEVATION FOR DARK MODE */
--shadow-dark-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-dark-md:  0 4px 6px 0 rgba(0, 0, 0, 0.4)
--shadow-dark-lg:  0 10px 15px 0 rgba(0, 0, 0, 0.5)
```

---

## PART 3: Component Library

### 1. Button Component

```tsx
// components/common/Button.tsx

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
        secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900',
        ghost: 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900',
        danger: 'bg-danger-500 text-white hover:bg-danger-600',
        success: 'bg-secondary-500 text-white hover:bg-secondary-600',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    isLoading,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {children}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
```

### 2. Card Component

```tsx
// components/common/Card.tsx

import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline'
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-neutral-700',
      elevated: 'bg-white dark:bg-dark-bg-secondary shadow-md',
      outline: 'bg-transparent border-2 border-primary-500',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6 transition-all duration-200',
          variants[variant],
          hover && 'hover:shadow-lg cursor-pointer',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }
```

### 3. Alert/Notification Component

```tsx
// components/common/Alert.tsx

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 flex gap-3 items-start',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
        danger: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, onClose, children, ...props }, ref) => (
    <div ref={ref} className={cn(alertVariants({ variant }), className)} {...props}>
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg font-semibold opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
)

Alert.displayName = 'Alert'

export { Alert, alertVariants }
```

### 4. Badge Component

```tsx
// components/common/Badge.tsx

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
```

### 5. Input Component

```tsx
// components/common/Input.tsx

import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</div>}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 dark:bg-dark-bg-secondary dark:border-neutral-600 dark:text-white',
              icon && 'pl-10',
              error && 'border-danger-500 focus:ring-danger-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
```

### 6. Confidence Bar Component (MSP Specific)

```tsx
// components/dashboard/ConfidenceBar.tsx

import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

export interface ConfidenceBarProps {
  confidence: number  // 0-100
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  animated = true,
  size = 'md',
  showLabel = true,
}) => {
  const [displayConfidence, setDisplayConfidence] = useState(0)

  useEffect(() => {
    if (!animated) {
      setDisplayConfidence(confidence)
      return
    }

    const timer = setTimeout(() => {
      setDisplayConfidence(confidence)
    }, 100)

    return () => clearTimeout(timer)
  }, [confidence, animated])

  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-amber-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getSizeClass = (s: string) => {
    switch (s) {
      case 'sm':
        return 'h-2'
      case 'lg':
        return 'h-4'
      default:
        return 'h-3'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700', getSizeClass(size))}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            getColor(displayConfidence),
            animated && 'animate-pulse'
          )}
          style={{ width: `${displayConfidence}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 min-w-[3rem] text-right">
          {displayConfidence}%
        </span>
      )}
    </div>
  )
}

export { ConfidenceBar }
```

### 7. Cost Card Component (MSP Specific)

```tsx
// components/dashboard/CostCard.tsx

import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { TrendIcon } from '@/components/common/TrendIcon'

export interface CostCardProps {
  title: string
  cost: number
  trend?: number
  currency?: string
  details?: string
  icon?: React.ReactNode
  variant?: 'default' | 'highlight'
}

const CostCard: React.FC<CostCardProps> = ({
  title,
  cost,
  trend,
  currency = '$',
  details,
  icon,
  variant = 'default',
}) => {
  const trendColor = trend && trend > 0 ? 'text-red-500' : 'text-green-500'
  const trendIcon = trend && trend > 0 ? '↑' : '↓'
  const trendBadgeVariant = trend && trend > 0 ? 'danger' : 'success'

  return (
    <Card
      variant={variant === 'highlight' ? 'elevated' : 'default'}
      className={variant === 'highlight' ? 'border-2 border-primary-500' : ''}
      hover
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
        {icon && <div className="text-2xl opacity-20">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
          {currency}
          {cost.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
        {trend !== undefined && (
          <Badge variant={trendBadgeVariant} size="sm">
            {trendIcon} {Math.abs(trend).toFixed(1)}%
          </Badge>
        )}
      </div>

      {details && <p className="text-xs text-neutral-500 dark:text-neutral-400">{details}</p>}
    </Card>
  )
}

export { CostCard }
```

---

## PART 4: Layout Components

### Main Layout

```tsx
// components/layout/MainLayout.tsx

import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-dark-bg-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
```

### Header Component

```tsx
// components/layout/Header.tsx

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-dark-bg-secondary px-8 py-4 flex items-center justify-between">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Last updated: 2 minutes ago</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Alerts Badge */}
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            🔔
          </button>
          <Badge variant="danger" size="sm" className="absolute -top-1 -right-1">
            3
          </Badge>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-neutral-500">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)}
          </div>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign Out
        </Button>
      </div>
    </header>
  )
}
```

### Sidebar Component

```tsx
// components/layout/Sidebar.tsx

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

const navigationItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '💬', label: 'Chat', path: '/chat' },
  { icon: '💰', label: 'Costs', path: '/costs' },
  { icon: '📈', label: 'Reports', path: '/reports' },
  { icon: '⚙️', label: 'Admin', path: '/admin' },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      'border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-dark-bg-secondary transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold text-primary-500">MSP</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
              location.pathname === item.path
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

---

## PART 5: Animations & Transitions

### CSS Animations

```css
/* styles/animations.css */

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide In */
@keyframes slideInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Scale */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Utility classes */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slideInUp {
  animation: slideInUp 0.4s ease-out;
}

.animate-slideInLeft {
  animation: slideInLeft 0.4s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
```

---

## PART 6: Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c3d66',
        },
        secondary: {
          500: '#22c55e',
          600: '#16a34a',
        },
        dark: {
          'bg-primary': '#0f172a',
          'bg-secondary': '#1e293b',
          'bg-tertiary': '#334155',
          'text-primary': '#f1f5f9',
          'text-secondary': '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        none: '0 0 #0000',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideInUp: 'slideInUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
```

---

## PART 7: Complete Page Example - Dashboard

```tsx
// pages/Dashboard.tsx

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { CostCard } from '@/components/dashboard/CostCard'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { ServiceBreakdown } from '@/components/dashboard/ServiceBreakdown'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { AlertWidget } from '@/components/dashboard/AlertWidget'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Select } from '@/components/common/Select'

export const Dashboard: React.FC = () => {
  const [creditsFilter, setCreditsFilter] = useState<'with' | 'without' | 'custom'>('with')

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 animate-slideInDown">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          AWS Cost Intelligence
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Last updated: 2 minutes ago
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex items-center gap-4">
        <Select
          value={creditsFilter}
          onChange={(e) => setCreditsFilter(e.target.value as any)}
          options={[
            { value: 'with', label: 'WITH Credits' },
            { value: 'without', label: 'WITHOUT Credits' },
            { value: 'custom', label: 'CUSTOM Credits' },
          ]}
        />
        <Button variant="outline" size="sm">
          📊 Download Report
        </Button>
        <Button variant="outline" size="sm">
          ⚙️ Filters
        </Button>
      </div>

      {/* Cost Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <CostCard
            title="Total Costs (Current Month)"
            cost={12543.67}
            trend={8.3}
            icon="💰"
            variant="highlight"
          />
        </div>
        <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <CostCard
            title="Daily Average"
            cost={418.12}
            trend={-2.1}
            icon="📈"
          />
        </div>
        <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <CostCard
            title="Forecast (Month End)"
            cost={11143}
            trend={0}
            icon="🔮"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Heatmap */}
        <Card variant="elevated" className="animate-slideInLeft">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Cost Trends (90 Days)
          </h2>
          <Heatmap />
        </Card>

        {/* Service Breakdown */}
        <Card variant="elevated" className="animate-slideInRight">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
            Top Services
          </h2>
          <ServiceBreakdown />
        </Card>
      </div>

      {/* Alerts */}
      <Card variant="outline" className="animate-slideInUp">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Recent Alerts
        </h2>
        <AlertWidget />
      </Card>
    </MainLayout>
  )
}
```

---

This complete UI design system includes:

✅ **Professional folder structure**  
✅ **Elegant color palette** (light + dark mode)  
✅ **Complete component library** (Button, Card, Alert, Badge, Input, etc.)  
✅ **Layout system** (Header, Sidebar, Main)  
✅ **Typography system**  
✅ **Animation system**  
✅ **Tailwind configuration**  
✅ **Real page example**  

Ready to implement? 🎨
