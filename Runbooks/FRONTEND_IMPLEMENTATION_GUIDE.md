# Frontend Implementation Guide - MSP Assistant

## 🎯 Overview

The frontend is a fully-featured React 18 + TypeScript + Tailwind CSS application with:
- ✅ Elegant component library (Button, Card, Alert, Badge, Input, Modal, Skeleton)
- ✅ MSP-specific components (ConfidenceBar, CostCard)
- ✅ Layout system (Header, Sidebar, MainLayout)
- ✅ Dark/Light theme support
- ✅ Responsive grid-based design
- ✅ Type-safe with full TypeScript
- ✅ Custom hooks (useTheme, useFetch)
- ✅ Context providers (Theme, Auth)
- ✅ API client with retry logic
- ✅ Utility functions and formatters

## 📁 Directory Structure

```
frontend/
├── public/                          # Static assets
│   ├── icons/                      # SVG icons and logo
│   ├── images/                     # Hero images and backgrounds
│   └── fonts/                      # Web fonts (Inter, Space Mono)
├── src/
│   ├── components/
│   │   ├── common/                 # Reusable components
│   │   │   ├── Button.tsx          # Button with 6 variants
│   │   │   ├── Card.tsx            # Card with Header/Body/Footer
│   │   │   ├── Alert.tsx           # Alert with 4 variants
│   │   │   ├── Badge.tsx           # Badge component
│   │   │   ├── Input.tsx           # Input with validation
│   │   │   ├── Modal.tsx           # Modal dialog
│   │   │   ├── Skeleton.tsx        # Skeleton loader
│   │   │   ├── index.ts            # Barrel export
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Side navigation
│   │   │   ├── MainLayout.tsx      # Main layout wrapper
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── ConfidenceBar.tsx   # Confidence progress bar
│   │   │   ├── CostCard.tsx        # Cost display card
│   │   │   └── index.ts
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx      # Chat message display
│   │   │   ├── MessageBubble.tsx   # Individual message
│   │   │   └── ... (to implement)
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx       # Login form
│   │   │   ├── ReportFilterForm.tsx # Report filters
│   │   │   └── ... (to implement)
│   │   └── data-display/
│   │       ├── DataTable.tsx       # Table component
│   │       ├── Pagination.tsx      # Pagination
│   │       └── ... (to implement)
│   ├── pages/
│   │   ├── Dashboard.tsx           # Dashboard page
│   │   ├── Login.tsx               # Login page (to implement)
│   │   ├── Chat.tsx                # Chat page (to implement)
│   │   ├── Reports.tsx             # Reports page (to implement)
│   │   ├── Costs.tsx               # Costs page (to implement)
│   │   ├── Admin.tsx               # Admin page (to implement)
│   │   └── NotFound.tsx            # 404 page (to implement)
│   ├── styles/
│   │   ├── globals.css             # Global styles
│   │   ├── theme.css               # Theme variables
│   │   ├── animations.css          # Animation definitions
│   │   ├── utilities.css           # Utility classes
│   │   └── variables.css           # CSS variables
│   ├── hooks/
│   │   ├── useTheme.ts             # Theme management
│   │   ├── useFetch.ts             # Data fetching
│   │   ├── useAuth.ts              # (to implement)
│   │   ├── useWebSocket.ts         # (to implement)
│   │   └── index.ts
│   ├── context/
│   │   ├── ThemeContext.tsx        # Theme provider
│   │   ├── AuthContext.tsx         # Auth provider
│   │   ├── ChatContext.tsx         # Chat provider (to implement)
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts                  # API client with retry logic
│   │   ├── auth.ts                 # (to implement)
│   │   ├── costs.ts                # (to implement)
│   │   └── chat.ts                 # (to implement)
│   ├── utils/
│   │   ├── formatters.ts           # Number, date, currency formatters
│   │   ├── validators.ts           # Email, password, URL validators
│   │   ├── constants.ts            # App constants
│   │   ├── helpers.ts              # Utility functions
│   │   └── index.ts
│   ├── types/
│   │   ├── api.ts                  # API response types
│   │   ├── models.ts               # Data model types
│   │   ├── components.ts           # Component prop types
│   │   └── index.ts
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # React entry point
│   └── vite-env.d.ts               # Vite type definitions
├── index.html                      # HTML entry point
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment template
└── README.md                       # Documentation
```

## 🚀 Getting Started

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 🧩 Component Usage Examples

### Button Component

```tsx
import { Button } from '@/components/common';

// Primary button
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Button with icon and loading state
<Button 
  variant="secondary" 
  size="lg" 
  isLoading={isLoading}
  icon={<SaveIcon />}
  iconPosition="left"
>
  Save Changes
</Button>

// Outline button
<Button variant="outline" size="sm">
  Cancel
</Button>

// Danger button
<Button variant="danger" size="md">
  Delete
</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common';
import { Button } from '@/components/common';

<Card variant="elevated">
  <CardHeader divider>
    <h2>Card Title</h2>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter divider>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### Alert Component

```tsx
import { Alert } from '@/components/common';

<Alert variant="warning" title="Warning" dismissible>
  This is a warning message
</Alert>

<Alert variant="danger" title="Error" onClose={handleClose}>
  An error occurred
</Alert>

<Alert variant="success" title="Success">
  Changes saved successfully
</Alert>
```

### CostCard Component

```tsx
import { CostCard } from '@/components/dashboard';

<CostCard
  service="EC2"
  amount={2450.50}
  currency="$"
  trend="up"
  trendPercent={12}
  status="high"
  badge="Alert"
/>
```

### ConfidenceBar Component

```tsx
import { ConfidenceBar } from '@/components/dashboard';

<ConfidenceBar value={72} label="Optimization Score" />
```

## 🎨 Theme System

### Using Theme Context

```tsx
import { useThemeContext } from '@/context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'} Toggle Theme
    </button>
  );
}
```

### Tailwind Dark Mode

Use `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-dark-text-primary">
  Content adapts to theme
</div>
```

### Custom Colors

```tsx
// Primary colors
'bg-primary-500', 'text-primary-600', 'border-primary-700'

// Dark mode colors
'dark:bg-dark-bg-secondary', 'dark:text-dark-text-primary'

// Cost-specific colors
'bg-cost-low', 'bg-cost-high', 'bg-cost-spike'
```

## 🔌 API Integration

### Using the API Client

```tsx
import { apiClient } from '@/services/api';

// GET request
const { data, error } = await apiClient.get('/costs');

// POST request
const { data, error } = await apiClient.post('/alerts', { 
  severity: 'high' 
});

// PUT request
const { data, error } = await apiClient.put('/settings/1', { 
  theme: 'dark' 
});

// DELETE request
const { data, error } = await apiClient.delete('/alerts/1');
```

### Using useFetch Hook

```tsx
import { useFetch } from '@/hooks';

function CostsList() {
  const { data, loading, error, refetch } = useFetch('/costs');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(cost => (
        <div key={cost.id}>{cost.service}: ${cost.amount}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## 🎯 Implementation Tasks

### Phase 1: Core Pages (Week 1-2)
- [x] Dashboard page with component examples
- [ ] Login page with form validation
- [ ] Layout components (Header, Sidebar, MainLayout)

### Phase 2: Features (Week 2-3)
- [ ] Costs page with DataTable and filtering
- [ ] Reports page with report generator
- [ ] Chat page with message history
- [ ] Admin settings page

### Phase 3: Forms (Week 3-4)
- [ ] Login form with Cognito integration
- [ ] Report filter form
- [ ] Alert configuration form
- [ ] User profile form

### Phase 4: Data Display (Week 4-5)
- [ ] DataTable with sorting/filtering
- [ ] Pagination component
- [ ] Chart components (TrendChart, Heatmap, etc.)
- [ ] Export functionality

### Phase 5: Enhancements (Week 5+)
- [ ] WebSocket integration for real-time updates
- [ ] Search functionality
- [ ] Advanced filtering
- [ ] User preferences/settings
- [ ] Notifications system

## 📦 Utilities

### Formatting Functions

```tsx
import { 
  formatCurrency, 
  formatDate, 
  formatBytes, 
  abbreviateNumber 
} from '@/utils/formatters';

formatCurrency(1234.56, 'USD')    // "$1,234.56"
formatDate('2024-01-15')          // "Jan 15, 2024"
formatBytes(1024000)              // "1000 KB"
abbreviateNumber(1500000)         // "1.5M"
```

### Validators

```tsx
import { 
  isEmail, 
  isStrongPassword, 
  isAWSAccountId 
} from '@/utils/validators';

isEmail('user@example.com')        // true
isStrongPassword('P@ssw0rd!')      // true
isAWSAccountId('123456789012')    // true
```

### Helpers

```tsx
import { 
  debounce, 
  throttle, 
  classNames, 
  getInitials, 
  groupBy 
} from '@/utils/helpers';

classNames('px-4', false, 'py-2') // "px-4 py-2"
getInitials('John Doe')           // "JD"
groupBy(users, 'role')            // { admin: [...], user: [...] }
```

## 🌐 Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=MSP Assistant
VITE_APP_VERSION=1.0.0
```

## 📊 Responsive Design

The design uses Tailwind's responsive breakpoints:

```tsx
// Mobile first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Responsive padding
className="p-4 sm:p-6 lg:p-8"

// Responsive typography
className="text-sm md:text-base lg:text-lg"
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Authentication Flow

1. User logs in via Login page
2. AuthContext validates credentials
3. JWT token stored in localStorage
4. API client includes token in headers
5. Protected routes check authentication
6. On 401 error, redirect to login

## 🧪 Type Safety

All components and functions have TypeScript types:

```tsx
// Component Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

// Data Models
interface CostData {
  service: string;
  amount: number;
  currency: string;
  date: string;
  trend: 'up' | 'down' | 'neutral';
}

// API Responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## 🚀 Deployment

### Build Optimization

```bash
npm run build
```

This creates:
- `dist/vendor.js` - React and React DOM (cached)
- `dist/utils.js` - axios and date-fns (cached)
- `dist/main.js` - Application code

### Deploy to S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://my-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

### Deploy to Cloudflare Pages

```bash
# Connect your repo to Cloudflare Pages
# Set build command: npm run build
# Set publish directory: dist
```

## 📝 Coding Standards

### Component Structure

```tsx
import React from 'react';
import { Button } from './Button';
import type { ButtonProps } from './Button';

interface MyComponentProps {
  title: string;
  onSubmit?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onSubmit,
}) => {
  const [state, setState] = React.useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
```

### Naming Conventions

- Components: PascalCase (`MyComponent.tsx`)
- Files: PascalCase for components, camelCase for utilities
- CSS Classes: kebab-case (Tailwind)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

## 🔗 Links

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)

## 💡 Tips

1. **Performance**: Use React.memo for expensive components
2. **Accessibility**: Include aria-labels for interactive elements
3. **Testing**: Write tests for critical paths
4. **Documentation**: Keep JSDoc comments for public APIs
5. **Bundle Size**: Monitor with `npm run build --analyze`

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review similar implementations
3. Consult TypeScript/React docs
4. Create an issue on GitHub
