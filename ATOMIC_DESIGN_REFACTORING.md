# Atomic Design Refactoring - Trinity Academy

## Overview

This document outlines the atomic design refactoring completed for Trinity Academy's component library. The refactoring organizes UI components into a hierarchical structure: **Atoms** → **Molecules** → **Organisms** → **Templates**.

---

## Folder Structure

```
src/components/
├── atoms/                          # Basic, reusable building blocks
│   ├── button.tsx
│   ├── button.stories.tsx
│   ├── icon-button.tsx
│   ├── icon-button.stories.tsx
│   ├── input.tsx                  # TextInput, OTPInput
│   ├── input.stories.tsx
│   ├── logo.tsx
│   ├── logo.stories.tsx
│   ├── marker.tsx
│   ├── marker.stories.tsx
│   └── index.ts                   # Barrel export
│
├── molecules/                      # Simple combinations of atoms
│   ├── breadcrumbs.tsx            # Breadcrumbs, BreadcrumbHome, Breadcrumb, BreadcrumbSeparator
│   ├── breadcrumbs.stories.tsx
│   ├── dropdown.tsx               # Dropdown, DropdownButton, DropdownItem, DropdownMenu
│   ├── dropdown.stories.tsx
│   ├── video-card.tsx
│   ├── video-card.stories.tsx
│   ├── page-section.tsx
│   ├── page-section.stories.tsx
│   ├── video-player.tsx           # Video, TimestampButton
│   ├── video-player.stories.tsx
│   ├── content-link.tsx
│   ├── next-page-link.tsx
│   └── index.ts                   # Barrel export
│
├── organisms/                      # Complex combinations of molecules and atoms
│   ├── navbar.tsx
│   ├── navbar.stories.tsx
│   ├── sidebar-layout.tsx         # SidebarLayout, SidebarLayoutContent
│   ├── profile-header.tsx
│   ├── profile-photo-upload.tsx
│   ├── profile-stats-cards.tsx
│   ├── table-of-contents.tsx
│   ├── bookshelf.tsx              # Book, Bookshelf
│   ├── trial-welcome-modal.tsx
│   ├── quiz-section.tsx
│   ├── quiz-active-view.tsx
│   ├── quiz-initial-view.tsx
│   ├── quiz-result-view.tsx
│   ├── quiz-auth-required.tsx
│   ├── quiz-error-view.tsx
│   ├── quiz-best-attempt.tsx
│   ├── quiz-question.tsx
│   ├── quiz-navigation.tsx
│   ├── quiz-progress-bar.tsx
│   ├── quiz-timer.tsx
│   ├── quiz-navigation-blocker-modal.tsx
│   └── index.ts                   # Barrel export
│
├── templates/                      # Page-level layouts
│   ├── centered-layout.tsx        # CenteredPageLayout
│   ├── MarkdownTable.tsx
│   └── index.ts                   # Barrel export
│
├── p5-js/                          # P5.js visualizations (unchanged)
│   └── ... (existing structure)
│
└── index.ts                        # Root barrel export (re-exports all)
```

---

## Atom Components

**Pure, reusable base elements with no dependencies on other components.**

### Exports from `atoms/index.ts`:
```typescript
export { Button } from "./button";
export { IconButton } from "./icon-button";
export { TextInput, OTPInput } from "./input";
export { Logo } from "./logo";
export { Marker } from "./marker";
```

### Usage:
```typescript
// Old way
import { Button } from "@/components/button";
import { TextInput } from "@/components/input";

// New way (recommended)
import { Button, TextInput } from "@/components/atoms";
```

---

## Molecule Components

**Simple combinations of atoms, forming reusable UI patterns.**

### Exports from `molecules/index.ts`:
```typescript
export {
  Breadcrumbs,
  BreadcrumbHome,
  Breadcrumb,
  BreadcrumbSeparator,
} from "./breadcrumbs";
export {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./dropdown";
export { VideoCard } from "./video-card";
export { PageSection } from "./page-section";
export { Video, TimestampButton } from "./video-player";
export { ContentLink } from "./content-link";
export { NextPageLink } from "./next-page-link";
```

### Usage:
```typescript
// Old way
import { Breadcrumbs, Breadcrumb } from "@/components/breadcrumbs";
import { Video } from "@/components/video-player";

// New way (recommended)
import { Breadcrumbs, Breadcrumb, Video } from "@/components/molecules";
```

---

## Organism Components

**Complex combinations of molecules and atoms, forming feature-specific sections.**

### Exports from `organisms/index.ts`:
```typescript
export { Navbar } from "./navbar";
export { SidebarLayout, SidebarLayoutContent } from "./sidebar-layout";
export { ProfileHeader } from "./profile-header";
export { ProfilePhotoUpload } from "./profile-photo-upload";
export { ProfileStatsCards } from "./profile-stats-cards";
export { TableOfContents } from "./table-of-contents";
export { Book, Bookshelf } from "./bookshelf";
export { TrialWelcomeModal } from "./trial-welcome-modal";
// Quiz components
export { QuizSection } from "./quiz-section";
export { QuizInitialView } from "./quiz-initial-view";
export { QuizActiveView } from "./quiz-active-view";
export { QuizResultView } from "./quiz-result-view";
// ... and more
```

### Usage:
```typescript
// Old way
import { Navbar } from "@/components/navbar";
import { SidebarLayoutContent } from "@/components/sidebar-layout";
import { QuizSection } from "@/components/quiz-section";

// New way (recommended)
import { Navbar, SidebarLayoutContent, QuizSection } from "@/components/organisms";
```

---

## Template Components

**Page-level layouts and specialized containers.**

### Exports from `templates/index.ts`:
```typescript
export { CenteredPageLayout } from "./centered-layout";
export { MarkdownTable } from "./MarkdownTable";
```

### Usage:
```typescript
// Old way
import { CenteredPageLayout } from "@/components/centered-layout";

// New way (recommended)
import { CenteredPageLayout } from "@/components/templates";
```

---

## Import Patterns

### Recommended Import Style (Specific):
```typescript
// Import from specific atomic levels
import { Button, TextInput } from "@/components/atoms";
import { Breadcrumbs, Video } from "@/components/molecules";
import { Navbar, SidebarLayoutContent } from "@/components/organisms";
import { CenteredPageLayout } from "@/components/templates";
```

### Alternative (Root Barrel):
```typescript
// Import everything from root (less recommended, can impact tree-shaking)
import { Button, TextInput, Breadcrumbs, Video, Navbar } from "@/components";
```

---

## Migration Guide

### Updated Files

All app routes have been updated to use the new import paths:

**Auth Routes:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/otp/page.tsx`
- `src/app/(auth)/layout.tsx`

**Centered Routes:**
- `src/app/(centered)/resources/page.tsx`
- `src/app/(centered)/interviews/page.tsx`
- `src/app/(centered)/interviews/[slug]/page.tsx`

**Root Route:**
- `src/app/page.tsx`

**Sidebar Routes (16 files):**
- `src/app/(sidebar)/<course>/page.tsx` (8 courses × 2)
- `src/app/(sidebar)/<course>/[slug]/page.tsx` (8 courses × 2)

**Other Files:**
- `mdx-components.tsx` - Updated template imports

---

## Component Migration Summary

### Atoms (6 components)
| Component | Path | Export |
|-----------|------|--------|
| Button | `atoms/button.tsx` | `Button` |
| IconButton | `atoms/icon-button.tsx` | `IconButton` |
| TextInput | `atoms/input.tsx` | `TextInput` |
| OTPInput | `atoms/input.tsx` | `OTPInput` |
| Logo | `atoms/logo.tsx` | `Logo` |
| Marker | `atoms/marker.tsx` | `Marker` |

### Molecules (9 components)
| Component | Path | Exports |
|-----------|------|---------|
| Breadcrumbs | `molecules/breadcrumbs.tsx` | `Breadcrumbs, BreadcrumbHome, Breadcrumb, BreadcrumbSeparator` |
| Dropdown | `molecules/dropdown.tsx` | `Dropdown, DropdownButton, DropdownItem, DropdownMenu` |
| VideoCard | `molecules/video-card.tsx` | `VideoCard` |
| PageSection | `molecules/page-section.tsx` | `PageSection` |
| VideoPlayer | `molecules/video-player.tsx` | `Video, TimestampButton` |
| ContentLink | `molecules/content-link.tsx` | `ContentLink` |
| NextPageLink | `molecules/next-page-link.tsx` | `NextPageLink` |

### Organisms (18+ components)
| Component | Path | Exports |
|-----------|------|---------|
| Navbar | `organisms/navbar.tsx` | `Navbar` |
| SidebarLayout | `organisms/sidebar-layout.tsx` | `SidebarLayout, SidebarLayoutContent` |
| ProfileHeader | `organisms/profile-header.tsx` | `ProfileHeader` |
| ProfilePhotoUpload | `organisms/profile-photo-upload.tsx` | `ProfilePhotoUpload` |
| ProfileStatsCards | `organisms/profile-stats-cards.tsx` | `ProfileStatsCards` |
| TableOfContents | `organisms/table-of-contents.tsx` | `TableOfContents` |
| Bookshelf | `organisms/bookshelf.tsx` | `Book, Bookshelf` |
| TrialWelcomeModal | `organisms/trial-welcome-modal.tsx` | `TrialWelcomeModal` |
| Quiz Components | `organisms/quiz-*.tsx` | 11 quiz-related exports |

### Templates (2 components)
| Component | Path | Export |
|-----------|------|--------|
| CenteredPageLayout | `templates/centered-layout.tsx` | `CenteredPageLayout` |
| MarkdownTable | `templates/MarkdownTable.tsx` | `MarkdownTable` |

---

## Benefits of This Refactoring

1. **Improved Organization**: Components are logically grouped by complexity and responsibility
2. **Better Discoverability**: Clear naming and folder structure make it easier to find and understand components
3. **Enforced Hierarchy**: Prevents components from importing from higher levels (e.g., organisms shouldn't import from templates)
4. **Reusability**: Clearer patterns for component composition
5. **Scalability**: Easy to add new components at the appropriate level
6. **Documentation**: Self-documenting code structure that new developers can understand immediately
7. **Tree-shaking**: Barrel exports support better tree-shaking for production builds
8. **Consistency**: Standardized component organization across the project

---

## Conventions

- **Naming**: All components use lowercase with hyphens (e.g., `breadcrumbs.tsx`, `video-player.tsx`)
- **Stories**: Storybook stories stay alongside components (e.g., `button.stories.tsx`)
- **Imports**: Prefer importing from specific atomic levels over root barrel
- **Exports**: Barrel files (`index.ts`) re-export all components from that level

---

## Next Steps

1. **Optional**: Update imports in any custom code to use the recommended import style
2. **Testing**: Run `npm run dev` and `npx vitest` to ensure everything works
3. **Documentation**: Share this guide with your team
4. **Linting**: Consider adding ESLint rules to enforce atomic design constraints

---

## Examples

### Creating a New Atom
```typescript
// src/components/atoms/badge.tsx
import { clsx } from "clsx";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={clsx(
        className,
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      )}
      {...props}
    />
  );
}
```

Then add to `atoms/index.ts`:
```typescript
export { Badge } from "./badge";
```

### Creating a New Molecule
```typescript
// src/components/molecules/alert.tsx
import { Button } from "@/components/atoms/button";

export function Alert({ title, message, onDismiss }: { ... }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{message}</p>
      <Button onClick={onDismiss}>Dismiss</Button>
    </div>
  );
}
```

Then add to `molecules/index.ts`:
```typescript
export { Alert } from "./alert";
```

---

## References

- **Atomic Design Book**: https://atomicdesign.bradfrost.com/
- **Component-Based Architecture**: https://www.patterns.dev/posts/component-pattern/
- **Folder Structure Best Practices**: https://www.robinwieruch.de/react-folder-structure/

