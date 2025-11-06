# Z-Index Layer Hierarchy 🎨

## Overview
This document outlines the z-index stacking order for all fixed/absolute positioned elements in SKILL-UP to prevent layering conflicts.

## Current Z-Index Hierarchy

| Layer | z-index | Element | Usage |
|-------|---------|---------|-------|
| **Loading Screen** | `z-[100]` | LoadingScreen | Full-screen loading overlay (highest priority) |
| **Feedback Button** | `z-[60]` | FeedbackButton | Floating feedback button with isolation context (above modals) |
| **Modals & Dialogs** | `z-50` | DialogOverlay, DialogContent, AlertDialog | Modal dialogs that need to overlay everything |
| **Bottom Navigation** | `z-30` | Bottom nav bars on Dashboard, Modules, Community, Profile, Lesson | Fixed bottom navigation tabs |
| **Content** | `z-0` to `z-10` | Regular page content | Default content layers |

## Positioning Strategy

### 1. **Feedback Button**
- **Position**: `fixed bottom-24 right-6` inside isolated container
- **Z-Index**: `z-[60]` with `isolation: isolate`
- **Reasoning**: 
  - `bottom-24` (6rem) positions it **above** the bottom navigation bars
  - `z-[60]` ensures it's above everything including modals (user feedback is priority)
  - Wrapped in isolated stacking context to prevent transform conflicts
  - Added white border and animated glow for visual appeal
  - Appears on all screens except Welcome/Login/Signup (which use FeedbackFooterLink instead)
  - Enhanced with multiple animations: pulse, glow, bounce, and notification dot

### 2. **Bottom Navigation Bars**
- **Position**: `fixed bottom-0`
- **Z-Index**: `z-30`
- **Screens**: DashboardScreen, ModuleListScreen, CommunityResourcesScreen, ProfileScreen, LessonScreen
- **Reasoning**: Should overlay scrollable content but stay below floating buttons and modals

### 3. **Loading Screen**
- **Position**: `fixed inset-0`
- **Z-Index**: `z-[100]`
- **Reasoning**: Must overlay **everything** including modals and feedback button during loading

### 4. **Modals & Dialogs**
- **Position**: `fixed` with portal rendering
- **Z-Index**: `z-50`
- **Examples**: Language selector, alert dialogs, confirmation modals
- **Reasoning**: Should overlay all page content including feedback button

## Visual Stacking (from top to bottom)

```
┌─────────────────────────────────────┐
│  Loading Screen (z-100)             │  ← Highest, only shows during transitions
├─────────────────────────────────────┤
│  Feedback Button (z-60 + isolated)  │  ← Always visible (floating, with animations)
├─────────────────────────────────────┤
│  Modals/Dialogs (z-50)              │  ← When opened
├─────────────────────────────────────┤
│  Bottom Navigation (z-30)           │  ← Fixed at bottom
├─────────────────────────────────────┤
│  Page Content (z-0 to z-10)         │  ← Scrollable content
└─────────────────────────────────────┘
```

## Spacing & Collision Prevention

### Feedback Button Placement
- **Bottom spacing**: `24` (6rem) = ~96px
- **Bottom nav height**: ~4.5rem = ~72px
- **Clearance**: ~24px between button bottom and nav top
- **Right margin**: `6` (1.5rem) = ~24px from screen edge

### Content Padding
Most screens with bottom nav have `pb-24` or `pb-32` to prevent content from being hidden behind:
- Bottom navigation bar
- Feedback button

## Best Practices

### When Adding New Fixed Elements:
1. **Determine priority**: Where should it sit in the hierarchy?
2. **Choose appropriate z-index**:
   - Critical overlays: `z-[100]+`
   - Modals/dialogs: `z-50`
   - Floating buttons: `z-40`
   - Bottom bars: `z-30`
   - Headers: `z-20`
3. **Consider mobile viewport**: Test on mobile widths (max-w-md)
4. **Add proper spacing**: Ensure other elements don't get hidden

### When Debugging Layering Issues:
1. Check z-index values in this hierarchy
2. Verify element has `position: fixed` or `position: absolute`
3. Check if parent has `position: relative` affecting stacking context
4. Use browser DevTools to inspect computed z-index values
5. Test with all interactive elements (modals, buttons, navs) visible

## Recent Fixes

### Feedback Button Issue (Fixed v2)
**Problem**: Feedback button was overlapping content and glitching, especially on Community page

**Solution**:
- ✅ Wrapped button in isolated stacking context with `isolation: isolate`
- ✅ Increased z-index to `z-[60]` to ensure it's always on top
- ✅ Removed inline `zIndex: 1` from map element that was causing conflicts
- ✅ Added `relative` positioning to App.tsx container
- ✅ Added `willChange: 'transform'` for better rendering performance
- ✅ Enhanced with 4 simultaneous animations:
  - Animated glow ring (pulsing blur effect)
  - Pulse border effect (expanding ring)
  - Icon bounce and rotate
  - Notification dot pulse
- ✅ Improved hover/tap interactions with rotation

**Result**: Smooth, visually appealing button that never glitches or overlaps

## Testing Checklist

When modifying z-index values, test:
- ✅ Feedback button visible but not covering text
- ✅ Bottom navigation always on top of content
- ✅ Modals overlay everything (except loading screen)
- ✅ Loading screen overlays everything
- ✅ No z-index conflicts on any screen
- ✅ Mobile viewport (narrow width) works properly

## Files Using Z-Index

### Components
- `/components/FeedbackButton.tsx` - z-40
- `/components/LoadingScreen.tsx` - z-[100]
- `/components/DashboardScreen.tsx` - z-30 (bottom nav)
- `/components/ModuleListScreen.tsx` - z-30 (bottom nav)
- `/components/CommunityResourcesScreen.tsx` - z-30 (bottom nav)
- `/components/ProfileScreen.tsx` - z-30 (bottom nav)
- `/components/LessonScreen.tsx` - z-30 (bottom action bar)

### UI Components
- `/components/ui/dialog.tsx` - z-50 (overlay & content)
- `/components/ui/alert-dialog.tsx` - z-50
