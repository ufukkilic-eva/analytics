# BrandFlow Dashboard - Product Requirements Document

A responsive e-commerce analytics dashboard with advanced product tagging and filtering capabilities.

## Mission Statement

BrandFlow Dashboard provides e-commerce teams with a comprehensive analytics platform to monitor sales performance, manage product inventory, analyze advertising metrics, and optimize operations through intelligent data visualization and advanced filtering.

## Experience Qualities

1. **Data-Dense & Scannable** - High information density presented clearly through thoughtful visual hierarchy and color coding
2. **Efficient & Fast** - Instant filtering, quick data manipulation, and responsive interactions that keep pace with power users
3. **Professional & Modern** - Dark-themed, enterprise-grade interface with sophisticated visual polish and attention to detail

## Complexity Level

**Complex Application (advanced functionality, likely with multiple views)** - Multi-view analytics platform with sophisticated filtering, real-time data manipulation, advanced charting, product tagging workflows, and state management across multiple interconnected features.

## Essential Features

### Feature 1: Advanced Filter System
- **Functionality**: Multi-dimensional filtering with support for tags, dates, numbers, and text fields
- **Purpose**: Enables users to drill down into specific data segments quickly
- **Trigger**: User clicks "Add Filter" button
- **Progression**: Click Add Filter → Select filter type from categorized list → Configure filter parameters → Apply → Data updates → Filter chip appears
- **Success criteria**: Filters apply instantly, chips display current filter state clearly, support for AND/OR logic on multi-select filters

### Feature 2: Analytics Dashboard with Interactive Charts
- **Functionality**: Displays key metrics (Impressions, Orders, ACoS, Organic Sales) with toggleable line charts
- **Purpose**: Provides comprehensive view of business performance over time
- **Trigger**: Default view on app load or Analytics navigation
- **Progression**: Page loads → Metrics cards render → User selects/deselects metrics → Chart updates dynamically → Export option available
- **Success criteria**: Smooth chart animations, accurate data representation, responsive tooltips, dual-axis support

### Feature 3: Product Tagging System
- **Functionality**: Add, edit, and manage product tags with visual color coding
- **Purpose**: Organize and classify products for better inventory management
- **Trigger**: User clicks "Add Tag" on product row or edits existing tag
- **Progression**: Click Add Tag → Search or create tag → Select tag → Tag appears on product → Color-coded pill renders
- **Success criteria**: Tags persist, color coding consistent, edit/delete flows work smoothly, tag filtering integrates with main filter

### Feature 4: Product List Table
- **Functionality**: Sortable, filterable table with product details and inline tagging
- **Purpose**: Central workspace for product management and classification
- **Trigger**: Automatically loads in Analytics view below charts
- **Progression**: Table renders → User can view products → Add/remove tags → Filter by tags → Sort by columns
- **Success criteria**: Table performance with 100+ rows, responsive on mobile, tag actions don't cause layout shifts

## Edge Case Handling

- **No Search Results** - Show empty state with "No products match your filters" and reset option
- **Long Product Names** - Truncate with ellipsis, show full name on hover tooltip
- **Many Tags on Product** - Show first 3 tags, "+N more" button expands to show all
- **Filter Chip Overflow** - Wrap to multiple lines with "Show less" toggle to collapse
- **Network Errors** - Show error state with retry button and helpful message
- **Empty Data States** - Display appropriate placeholder with actionable next step

## Design Direction

The design should evoke **precision, intelligence, and efficiency**. This is a tool for data-driven professionals who need to make fast decisions based on complex information. The dark theme reduces eye strain during extended use, while the vibrant accent colors (blues, greens, pinks) make data points immediately scannable.

## Color Selection

Dark theme optimized for extended analytics work:

- **Primary Color**: `oklch(0.205 0 0)` (Near-black) - Main background providing deep contrast
- **Secondary Colors**: 
  - `#3b82f6` (Brand Blue) - Primary actions, selected states, important CTAs
  - `#10b981` (Success Green) - Positive metrics, growth indicators
  - `#ec4899` (Alert Pink) - Attention-grabbing metrics, warnings
  - `#14b8a6` (Teal) - Secondary metrics
- **Accent Color**: `#0472FD` (Bright Blue) - Interactive elements, hover states, focus indicators
- **Foreground/Background Pairings**:
  - Primary BG (#0f111a): White text (#ffffff) - Ratio 17.2:1 ✓
  - Card BG (#1e2230): White text (#ffffff) - Ratio 14.8:1 ✓
  - Input BG (#1a1d2e): White text (#ffffff) - Ratio 15.9:1 ✓
  - Brand Blue (#3b82f6): White text (#ffffff) - Ratio 7.2:1 ✓
  - Success Green (#10b981): White text (#ffffff) - Ratio 4.9:1 ✓

## Font Selection

**Inter** - Modern, highly readable sans-serif optimized for UI density and data display. Excellent number rendering with clear distinction between similar characters.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/28px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/18px/normal spacing
  - H3 (Card Titles): Inter SemiBold/15px/normal spacing
  - Navigation Items: Inter Medium/14px/normal spacing
  - Body Text: Inter Regular/13px/relaxed line-height (1.5)
  - Data Values: Inter SemiBold/24px/tabular numbers
  - Labels: Inter Medium/12px/slightly wide spacing (0.01em)
  - Captions: Inter Regular/11px/muted color

## Animations

Subtle, purposeful animations that enhance usability without distraction:
- Filter popover: 200ms ease-out fade + slide from anchor point
- Metric card selection: Border color transition 150ms ease
- Chart line drawing: 800ms ease-in-out on initial render
- Tag addition: 200ms scale-in from 0.95 to 1.0
- Hover states: 120ms ease for background/color changes
- Table row hover: Instant (0ms) for immediate feedback on dense data

## Component Selection

- **Components**: 
  - Shadcn UI base components (Button, Input, Select, Table, Dialog, Popover)
  - Recharts for data visualization (ComposedChart with Line and Bar)
  - Custom MetricCard with checkbox selection and accent color indicator
  - Custom AdvancedFilter with multi-panel popover interface
  - Custom ProductTable with inline tag management
  
- **Customizations**:
  - Multi-panel filter popover (left: filter list, right: configuration)
  - Metric cards with horizontal layout and bottom accent line
  - Tag pills with hover-to-edit functionality
  - Segmented button groups for view/group controls
  - Filter chips with compact design and X-to-remove
  
- **States**:
  - Metric Cards: unselected (muted), selected (accent border), hover (subtle bg shift)
  - Filters: default, active (blue accent), hover (bg change)
  - Tags: default, hover (show edit icons), editing (popover open)
  - Table rows: default, hover (bg-tertiary), selected (checkbox)
  
- **Icon Selection**:
  - Lucide React library for consistency
  - Filter: Filter icon
  - Search: Search (magnifying glass)
  - Add: Plus
  - Edit: Edit2 (pencil)
  - Delete: X or Trash2
  - Calendar: CalendarIcon
  - Export: Download
  - All icons 14-18px with 2px stroke
  
- **Spacing**:
  - Page container: max-w-7xl with px-6 md:px-8
  - Card padding: p-4 to p-6 depending on content density
  - Grid gaps: gap-4 (16px) for metrics, gap-6 (24px) for sections
  - Filter popover: p-12 for panels, gap-8 between elements
  - Table cell padding: px-4 py-3
  
- **Mobile**:
  - Filter bar wraps controls to multiple rows
  - Metric cards stack to single column
  - Charts maintain aspect ratio, reduce height on small screens
  - Table becomes horizontally scrollable
  - Filter popover becomes full-screen modal
  - "View as" and "Group by" controls stack vertically
