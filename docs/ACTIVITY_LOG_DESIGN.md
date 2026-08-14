# Activity Log - Visual Design Preview

## 🎨 Complete Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Activity Log                                                        │
│  Track your productivity journey and AI usage                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │
│  │ 📊 Total  │  │ 💬 AI     │  │ ⚡ Tokens │  │ 📅 Plans  │        │
│  │    48     │  │ Chats 43  │  │   29,841  │  │  Created  │        │
│  │Activities │  │           │  │           │  │     5     │        │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │
│                                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  🔍 Filters                                       [Clear All]        │
│  ┌──────────────┬──────────────┬──────────────┐                    │
│  │Activity Type │  From Date   │   To Date    │                    │
│  │ All Activities│ 2026-01-01  │ 2026-01-21   │                    │
│  └──────────────┴──────────────┴──────────────┘                    │
│  Active: [Type: AI Chat ×] [From: Jan 1 ×] [To: Jan 21 ×]          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TODAY ──────────────────────────────────────────── 2 activities    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 💬  AI Life Coach conversation      [AI Chat]    12:23 PM  │    │
│  │     2 hours ago                                              │    │
│  │     💬 666 tokens • ID: b7551184...                         │    │
│  │     [View Details →]                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 💬  AI Life Coach conversation      [AI Chat]    06:19 AM  │    │
│  │     8 hours ago                                              │    │
│  │     💬 698 tokens • ID: 543d5a18...                         │    │
│  │     [View Details →]                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  YESTERDAY ──────────────────────────────────────── 5 activities    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 💬  AI Life Coach conversation      [AI Chat]    06:02 PM  │    │
│  │     yesterday                                                │    │
│  │     💬 680 tokens                                           │    │
│  │     [View Details →]                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  JANUARY 18, 2026 ──────────────────────────────── 1 activity      │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 📅  Generated weekly plan with AI  [Plan Created] 04:20 AM │    │
│  │     3 days ago                                               │    │
│  │     📅 Week Plan                                            │    │
│  │     [View Details →]                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  Showing 1 to 20 of 48 activities                                    │
│  [← Previous]  [1] [2] [3] [4] [5]  [Next →]                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View (< 640px)

```
┌─────────────────────┐
│  Activity Log       │
│  Track your journey │
├─────────────────────┤
│  ┌───────────────┐  │
│  │ 📊 Total      │  │
│  │    48         │  │
│  │ Activities    │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ 💬 AI Chats   │  │
│  │    43         │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ ⚡ Tokens     │  │
│  │  29,841       │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ 📅 Plans      │  │
│  │    5          │  │
│  └───────────────┘  │
├─────────────────────┤
│  🔍 Filters         │
│  Activity Type      │
│  [All Activities ▾] │
│  From Date          │
│  [2026-01-01]       │
│  To Date            │
│  [2026-01-21]       │
├─────────────────────┤
│  TODAY ──── 2       │
│  ┌───────────────┐  │
│  │ 💬 AI Chat    │  │
│  │ 12:23 PM      │  │
│  │ 666 tokens    │  │
│  │ View →        │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 🎨 Color Scheme

### Activity Type Colors

**AI_CHAT (Purple)**
- Background: `bg-purple-50` / `dark:bg-purple-900/30`
- Icon: `text-purple-600` / `dark:text-purple-400`
- Border: `border-purple-200` / `dark:border-purple-800`
- Badge: Purple badge

**PLAN_CREATED (Green)**
- Background: `bg-green-50` / `dark:bg-green-900/30`
- Icon: `text-green-600` / `dark:text-green-400`
- Border: `border-green-200` / `dark:border-green-800`
- Badge: Green badge

**GOAL_ADDED (Blue)**
- Background: `bg-blue-50` / `dark:bg-blue-900/30`
- Icon: `text-blue-600` / `dark:text-blue-400`
- Border: `border-blue-200` / `dark:border-blue-800`
- Badge: Blue badge

**HABIT_TRACKED (Orange)**
- Background: `bg-amber-50` / `dark:bg-amber-900/30`
- Icon: `text-amber-600` / `dark:text-amber-400`
- Border: `border-amber-200` / `dark:border-amber-800`
- Badge: Orange badge

---

## 🌙 Dark Mode

All components fully support dark mode with proper contrast:
- Backgrounds: `dark:bg-zinc-800`, `dark:bg-zinc-900`
- Text: `dark:text-white`, `dark:text-gray-300`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`
- Cards: Smooth transitions between light/dark themes

---

## ✨ Interactive Elements

### Hover States
- Stats cards: Shadow elevation
- Activity cards: Shadow + border glow
- Buttons: Color darkening
- Filter chips: Close button appears

### Transitions
- All hover states: `transition-all`
- Smooth color changes
- Shadow elevations
- Border highlights

### Loading States
- Stats cards: Shimmer skeleton
- Timeline: Multiple skeleton cards
- Maintains layout during loading

---

## 📊 Component Breakdown

### 1. ActivityStatsCards
- 4 responsive cards
- Icons from lucide-react
- Number formatting (commas)
- Loading skeletons

### 2. ActivityFilters
- 3-column grid (desktop)
- Stacked (mobile)
- Active filter chips
- Clear all button

### 3. ActivityTimeline
- Date grouping logic
- Smart date labels
- Activity count per date
- Empty state illustration

### 4. ActivityItem
- Type-based styling
- Token display
- Time ago format
- Navigation buttons
- Responsive layout

---

## 🚀 User Interactions

1. **Filter by Type**: Dropdown with 5 options
2. **Date Range**: Native date pickers
3. **Clear Filters**: One-click reset
4. **View Details**: Navigate to AI Chat or Plan pages
5. **Pagination**: Previous/Next + page numbers
6. **Responsive**: Touch-friendly on mobile

---

## 📈 Data Flow

```
User Action → Redux Action → API Call → Update State → Re-render
```

**Example Flow:**
1. User changes filter type to "AI_CHAT"
2. `setActivityFilter` action dispatched
3. `useEffect` triggers `getActivityLogs`
4. API called with new filters
5. Response updates Redux state
6. Components re-render with new data

---

## 🎯 Key Features

✅ Real-time filtering
✅ Pagination support
✅ Dark mode ready
✅ Fully responsive
✅ Smart date grouping
✅ Type-based styling
✅ Navigation to related pages
✅ Empty states handled
✅ Loading states
✅ Accessible markup

