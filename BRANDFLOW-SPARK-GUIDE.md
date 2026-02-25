# BrandFlow UI - Spark Template Guide

This document provides the context for the BrandFlow dashboard Spark application.
It summarizes the current structure, navigation, layout, design tokens, and UI patterns.

## 1) Application Structure & Layout

### Framework
- **Technology**: React 19 + TypeScript + Vite
- **Routing**: Client-side view switching (state-based)
- **UI Library**: shadcn/ui v4 components
- **Styling**: Tailwind CSS v4 + CSS custom properties

### Layout Shell
Main component: `src/App.tsx`
- Single-page application with sidebar navigation
- View switching via state management (no route-based navigation)
- Responsive sidebar with mobile drawer

**Shell Structure:**
```
┌─────────────┬──────────────────────────┐
│   Sidebar   │     Main Content         │
│   (200px)   │     (flex-1)             │
│             │                          │
│  Brand      │  <Active View Component> │
│  Nav Items  │                          │
│  Footer     │                          │
└─────────────┴──────────────────────────┘
```

## 2) Navigation & Views

### Sidebar Component
Location: `src/components/Sidebar.tsx`

**Structure:**
- **Header**: Brand name "BrandFlow" + subtitle
- **Navigation**: Menu items with icons
- **Footer**: Copyright notice

**Menu Items** (in order):
```json
[
  {
    "id": "analytics",
    "label": "Analytics",
    "icon": "BarChart3",
    "component": "AnalyticsView"
  },
  {
    "id": "advertising",
    "label": "Advertising",
    "icon": "Megaphone",
    "component": "AdvertisingView"
  },
  {
    "id": "clients",
    "label": "Clients",
    "icon": "Users",
    "component": "ClientsView"
  },
  {
    "id": "meetings",
    "label": "Meetings",
    "icon": "Calendar",
    "component": "MeetingsView"
  },
  {
    "id": "tasks",
    "label": "Tasks",
    "icon": "CheckSquare",
    "component": "TasksView"
  },
  {
    "id": "chats",
    "label": "Chats",
    "icon": "MessageSquare",
    "component": "ChatsView"
  },
  {
    "id": "designs",
    "label": "Designs",
    "icon": "Layout",
    "component": "DesignsView"
  }
]
```

### View Components (Implemented)
All located in `src/components/`:
- ✅ `AnalyticsView.tsx` - Analytics dashboard with metrics
- ✅ `AdvertisingView.tsx` - Campaign performance and ad metrics
- ✅ `ClientsView.tsx` - Client management
- ✅ `MeetingsView.tsx` - Meeting schedule
- ✅ `TasksView.tsx` - Task management
- ✅ `ChatsView.tsx` - Messaging interface
- ✅ `DesignsView.tsx` - Design assets

### Reusable Components
- `MetricCard.tsx` - Stat card with optional change indicator

## 3) Design System & Theme

### Color Palette (HSL Format)

**Current Theme** (defined in `src/index.css`):

```css
:root {
  /* Backgrounds */
  --bg-primary: #0f1419;      /* 212 27% 8% - Main page background */
  --bg-secondary: #1a1f2e;    /* 221 26% 14% - Sidebar background */
  --bg-tertiary: #242b3d;     /* 221 23% 23% - Cards/elevated surfaces */
  --bg-card: #1e2433;         /* 222 26% 16% - Card backgrounds */
  
  /* Text */
  --text-primary: #ffffff;    /* 0 0% 100% - Primary text */
  --text-secondary: #94a3b8;  /* 215 20% 65% - Secondary text */
  --text-muted: #64748b;      /* 215 20% 47% - Muted text */
  
  /* Brand Colors */
  --brand-blue: #0472FD;      /* 212 99% 50% - Primary brand */
  --brand-blue-hover: #0562d9;
  --brand-blue-muted: rgba(4, 114, 253, 0.15);
  --brand-purple: #8B5CF6;    /* 258 90% 66% - Accent/active states */
  --brand-purple-hover: #7c4fee;
  --brand-purple-muted: rgba(139, 92, 246, 0.15);
  --brand-purple-text: #a78bfa;
  
  /* Status Colors */
  --success: #22c55e;         /* Green for positive metrics */
  --warning: #f59e0b;         /* Orange for warnings */
  --danger: #ef4444;          /* Red for errors/negative */
  --chart-cyan: #06b6d4;      /* Cyan for charts */
  
  /* Neutrals */
  --neutral-bg: #2d3548;
  --neutral-bg-hover: #3d4560;
  --neutral-border: #374151;  /* Border color */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.4);
}
```

### New shadcn/ui Theme Variables (HSL for compatibility)

To integrate shadcn components, add these to `src/main.css`:

```css
:root {
  /* Core */
  --background: 222 26% 16%;        /* bg-main */
  --foreground: 0 0% 100%;          /* text-primary */

  /* Cards / Popovers */
  --card: 222 26% 16%;
  --card-foreground: 0 0% 100%;
  --popover: 222 26% 16%;
  --popover-foreground: 0 0% 100%;

  /* Primary (Brand Blue) */
  --primary: 212 99% 50%;           /* #0472FD */
  --primary-foreground: 0 0% 100%;

  /* Secondary / Muted */
  --secondary: 221 23% 23%;         /* bg-surface */
  --secondary-foreground: 0 0% 100%;
  --muted: 221 23% 23%;
  --muted-foreground: 215 20% 65%;  /* text-secondary */

  /* Accent (brand purple used selectively) */
  --accent: 258 90% 66%;            /* #8B5CF6 */
  --accent-foreground: 0 0% 100%;

  /* Borders / Inputs */
  --border: 220 13% 23%;
  --input: 220 13% 23%;
  --ring: 212 99% 50%;

  /* Status */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  /* Border radius */
  --radius: 0.6rem;
}

/* Dark mode variant (if needed in future) */
.dark {
  --background: 212 27% 8%;          /* bg-root */
  --foreground: 0 0% 100%;

  --card: 222 26% 16%;
  --card-foreground: 0 0% 100%;

  --popover: 222 26% 16%;
  --popover-foreground: 0 0% 100%;

  --primary: 212 99% 50%;
  --primary-foreground: 0 0% 100%;

  --secondary: 221 23% 23%;
  --secondary-foreground: 0 0% 100%;

  --muted: 221 23% 23%;
  --muted-foreground: 215 20% 65%;

  --accent: 258 90% 66%;
  --accent-foreground: 0 0% 100%;

  --border: 220 13% 23%;
  --input: 220 13% 23%;
  --ring: 212 99% 50%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
}
```

### Typography
- **Font Family**: 'Poppins' (weights: 400, 500, 600, 700)
- **Font Loading**: Google Fonts (preconnect in `index.html`)

**Type Scale:**
- H1 (Page Title): `text-2xl font-bold` (24px, 700 weight)
- H2 (Section Title): `text-2xl font-semibold` (24px, 600 weight)
- H3 (Card Title): `text-lg font-semibold` (18px, 600 weight)
- Body: `text-sm` (14px, 400 weight)
- Small: `text-xs` (12px, 400 weight)

### Icon Library
- **Primary**: `lucide-react` (used in sidebar and components)
- **Available**: `@phosphor-icons/react` (also installed)

## 4) UI Patterns & Component Usage

### Metric Card Pattern
Component: `MetricCard.tsx`

**Props:**
- `label`: string - Metric label
- `value`: string - Main value
- `change?`: object - Optional change indicator
  - `value`: string - Change percentage
  - `isPositive`: boolean - Green (true) or red (false)

**Usage:**
```tsx
<MetricCard
  label="Total Revenue"
  value="$124,567"
  change={{ value: '26.8%', isPositive: true }}
/>
```

### Page Layout Pattern

**Standard page structure:**
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <div>
    <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
      Page Title
    </h2>
    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
      Page description
    </p>
  </div>

  {/* Metrics Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <MetricCard ... />
  </div>

  {/* Content Cards */}
  <div className="rounded-xl p-5" style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--neutral-border)',
  }}>
    {/* Card content */}
  </div>
</div>
```

### Card Styling Pattern
```tsx
<div
  className="rounded-lg p-5"
  style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--neutral-border)',
  }}
>
  {/* Card content */}
</div>
```

### Active State Pattern (Sidebar)
```tsx
style={{
  background: isActive ? 'var(--brand-purple)' : 'transparent',
  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
}}
```

## 5) shadcn/ui Integration Guidelines

### Available Components
Location: `src/components/ui/`

**Pre-installed shadcn components (40+):**
- Buttons, Inputs, Selects, Textareas
- Cards, Dialogs, Sheets, Drawers
- Tables, Tabs, Accordions
- Forms (with react-hook-form integration)
- Toasts (sonner), Tooltips, Popovers
- And more...

### Using shadcn Components

**Import pattern:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

**Style integration:**
- shadcn components automatically use the CSS variables defined above
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sizes: `default`, `sm`, `lg`, `icon`

**Example:**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
```

### Migrating Custom Components to shadcn

When updating existing components:
1. Keep the same visual appearance (colors, spacing)
2. Replace custom styled elements with shadcn primitives
3. Use Tailwind utilities + CSS variables for theming
4. Maintain responsive behavior

**Before (custom):**
```tsx
<button
  className="px-4 py-2 rounded-lg"
  style={{ background: 'var(--brand-blue)' }}
>
  Click me
</button>
```

**After (shadcn):**
```tsx
<Button className="bg-[hsl(var(--primary))]">
  Click me
</Button>
```

## 6) Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile Behavior
- **Sidebar**: Drawer on mobile (< 768px), fixed on desktop
- **Grids**: Stack on mobile, multi-column on larger screens
  - Metrics: 1 col mobile → 2 col sm → 3 col lg → 4 col xl
  - Content: 1 col mobile → 2 col lg

### Mobile Sidebar
- Toggle button (top-left, visible on mobile only)
- Overlay backdrop when open
- Auto-close after navigation on mobile

## 7) State Management Patterns

### View Switching
```tsx
const [activeMenu, setActiveMenu] = useState('analytics');
```

### Sidebar Toggle
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);
```

### Data Persistence
For features requiring persistence:
```tsx
import { useKV } from '@github/spark/hooks'

const [preferences, setPreferences] = useKV("user-preferences", {})
```

## 8) Adding New Views/Features

### Checklist for New Views
1. Create view component in `src/components/`
2. Add menu item to `menuItems` array in `Sidebar.tsx`
3. Add case to switch statement in `App.tsx`
4. Follow existing page layout pattern
5. Use `MetricCard` for statistics
6. Implement responsive grid
7. Use CSS variables for colors

### Example: Adding "Reports" View

**Step 1:** Create `src/components/ReportsView.tsx`
```tsx
export function ReportsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2" 
            style={{ color: 'var(--text-primary)' }}>
          Reports
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Generate and view reports
        </p>
      </div>
      {/* Content */}
    </div>
  );
}
```

**Step 2:** Update `Sidebar.tsx`
```tsx
import { FileText } from 'lucide-react';

const menuItems = [
  // ... existing items
  { id: 'reports', label: 'Reports', icon: FileText },
];
```

**Step 3:** Update `App.tsx`
```tsx
import { ReportsView } from './components/ReportsView';

const renderView = () => {
  switch (activeMenu) {
    // ... existing cases
    case 'reports':
      return <ReportsView />;
  }
};
```

## 9) File Structure

```
/workspaces/spark-template/
├── index.html                  # HTML entry point
├── package.json               # Dependencies
├── src/
│   ├── App.tsx                # Main app component
│   ├── index.css              # Custom theme variables
│   ├── main.css               # Base styles (don't edit)
│   ├── main.tsx               # App entry (don't edit)
│   ├── components/
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── MetricCard.tsx     # Reusable metric card
│   │   ├── AnalyticsView.tsx  # View components
│   │   ├── AdvertisingView.tsx
│   │   ├── ClientsView.tsx
│   │   ├── MeetingsView.tsx
│   │   ├── TasksView.tsx
│   │   ├── ChatsView.tsx
│   │   ├── DesignsView.tsx
│   │   └── ui/                # shadcn components (40+)
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── styles/
│       └── theme.css
└── vite.config.ts             # Vite config (don't edit)
```

## 10) Next Steps & Enhancement Opportunities

### Immediate Improvements
1. **Migrate to shadcn components**: Replace custom buttons/inputs with shadcn primitives
2. **Add filtering**: Implement filter bars on list views
3. **Add tables**: Use shadcn Table component for data lists
4. **Add forms**: Use shadcn Form components with react-hook-form
5. **Add dialogs**: Use shadcn Dialog for modals/actions

### Feature Enhancements
- Search functionality (global or per-view)
- Settings page with preferences
- User profile management
- Data persistence (useKV hook)
- Charts and visualizations (recharts)
- Export capabilities
- Notifications (sonner toasts)

### UX Improvements
- Loading states (skeletons)
- Empty states (helpful messages)
- Error states (retry mechanisms)
- Optimistic updates
- Keyboard shortcuts
- Accessibility (ARIA labels, focus management)

---

## Quick Reference

### Color Usage
- **Primary action**: `var(--brand-blue)` or `hsl(var(--primary))`
- **Active state**: `var(--brand-purple)` or `hsl(var(--accent))`
- **Success**: `var(--success)`
- **Warning**: `var(--warning)`
- **Error**: `var(--danger)`
- **Borders**: `var(--neutral-border)` or `hsl(var(--border))`
- **Cards**: `var(--bg-card)` or `hsl(var(--card))`

### Component Imports
```tsx
// shadcn components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

// Icons
import { IconName } from 'lucide-react'

// Custom components
import { MetricCard } from '@/components/MetricCard'
```

### Utility Classes
```tsx
// Spacing
className="space-y-6"        // Vertical spacing
className="gap-4"            // Grid/flex gap

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Responsive
className="hidden md:block"  // Show on desktop only
className="md:hidden"        // Show on mobile only
```
