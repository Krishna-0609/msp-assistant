# MSP Assistant - Frontend

React 18 + TypeScript + Tailwind CSS frontend for AWS Cost Intelligence Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Button, Card, Input, etc.
│   │   ├── layout/       # Header, Sidebar, MainLayout
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── chat/         # Chat components
│   │   ├── forms/        # Form components
│   │   └── data-display/ # Table, Pagination, etc.
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── services/         # API services
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: Sky blue (#0ea5e9)
- **Secondary**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Grayscale
- **Dark Mode**: Full dark theme support

### Typography
- **Font**: Inter
- **Font Sizes**: 0.75rem to 2.25rem
- **Font Weights**: 300-800

### Components
- Button (6 variants, 5 sizes)
- Card (3 variants)
- Alert (4 variants)
- Badge (5 variants)
- Input with validation
- Modal
- Skeleton loaders
- Custom MSP components (ConfidenceBar, CostCard)

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

### Tailwind Customization

Edit `tailwind.config.js` to customize colors, spacing, fonts, etc.

## 📦 Dependencies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Vite**: Build tool
- **Axios**: HTTP client
- **date-fns**: Date utilities

## 🧪 Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📖 Usage Examples

### Using Components

```tsx
import { Button, Card, Alert } from '@/components/common';

export const Example = () => {
  return (
    <Card>
      <Alert variant="success" title="Success">
        Your changes have been saved.
      </Alert>
      <Button variant="primary" onClick={() => console.log('Clicked')}>
        Click me
      </Button>
    </Card>
  );
};
```

### Using Hooks

```tsx
import { useTheme, useFetch } from '@/hooks';

export const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  const { data, loading, error } = useFetch('/api/data');

  return (
    <div>
      <button onClick={toggleTheme}>
        {isDark ? '🌙' : '☀️'}
      </button>
    </div>
  );
};
```

### Using Context

```tsx
import { useThemeContext } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';

export const MyComponent = () => {
  const { isDark, toggleTheme } = useThemeContext();
  const { user, isAuthenticated } = useAuthContext();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
    </div>
  );
};
```

## 🚢 Deployment

### Build Optimization

The build process uses code splitting:
- `vendor.js` - React and React DOM
- `utils.js` - Axios and date-fns
- `main.js` - Application code

### Static Hosting

Upload `dist/` folder to:
- AWS S3 + CloudFront
- Cloudflare Pages
- Vercel
- Netlify

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Keep components small and focused
4. Use the design system tokens
5. Test responsive behavior

## 📄 License

Proprietary - All rights reserved
