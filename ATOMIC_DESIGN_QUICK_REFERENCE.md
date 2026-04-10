# Quick Reference: Atomic Design Import Patterns

## Atoms (Basic Building Blocks)

```typescript
// From atoms/index.ts
import { Button, IconButton, TextInput, OTPInput, Logo, Marker } from "@/components/atoms";

// Or directly from specific file
import { Button } from "@/components/atoms/button";
import { TextInput, OTPInput } from "@/components/atoms/input";
```

## Molecules (Combinations of Atoms)

```typescript
// From molecules/index.ts
import {
  Breadcrumbs,
  BreadcrumbHome,
  Breadcrumb,
  BreadcrumbSeparator,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  VideoCard,
  PageSection,
  Video,
  TimestampButton,
  ContentLink,
  NextPageLink,
} from "@/components/molecules";

// Or directly from specific file
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { Video } from "@/components/molecules/video-player";
```

## Organisms (Complex Components)

```typescript
// From organisms/index.ts
import {
  Navbar,
  SidebarLayout,
  SidebarLayoutContent,
  ProfileHeader,
  ProfilePhotoUpload,
  ProfileStatsCards,
  TableOfContents,
  Book,
  Bookshelf,
  TrialWelcomeModal,
  QuizSection,
  QuizInitialView,
  QuizActiveView,
  QuizResultView,
  QuizAuthRequired,
  QuizErrorView,
  QuizBestAttempt,
  QuizQuestion,
  QuizNavigation,
  QuizProgressBar,
  QuizTimer,
  QuizNavigationBlockerModal,
} from "@/components/organisms";

// Or directly from specific file
import { SidebarLayoutContent } from "@/components/organisms/sidebar-layout";
import { QuizSection } from "@/components/organisms/quiz-section";
```

## Templates (Page Layouts)

```typescript
// From templates/index.ts
import { CenteredPageLayout, MarkdownTable } from "@/components/templates";

// Or directly from specific file
import { CenteredPageLayout } from "@/components/templates/centered-layout";
```

## All Components (Root Barrel)

```typescript
// Import everything from root
import {
  Button,
  Breadcrumbs,
  SidebarLayoutContent,
  CenteredPageLayout,
} from "@/components";
```

## Common Import Patterns by Use Case

### Auth Pages
```typescript
import { Button, TextInput, OTPInput, Logo } from "@/components/atoms";
```

### Course Pages
```typescript
import { Breadcrumbs, BreadcrumbHome } from "@/components/molecules";
import { SidebarLayoutContent, QuizSection } from "@/components/organisms";
import { CenteredPageLayout } from "@/components/templates";
```

### Resource/Interview Pages
```typescript
import { Breadcrumbs, VideoCard } from "@/components/molecules";
import { Bookshelf } from "@/components/organisms";
import { CenteredPageLayout } from "@/components/templates";
```

### Lesson Pages
```typescript
import { Breadcrumbs, Video, NextPageLink } from "@/components/molecules";
import { SidebarLayoutContent, TableOfContents, QuizSection } from "@/components/organisms";
```

## Migration Checklist

When updating imports in existing files:

- [ ] Replace `from "@/components/button"` → `from "@/components/atoms"`
- [ ] Replace `from "@/components/breadcrumbs"` → `from "@/components/molecules"`
- [ ] Replace `from "@/components/sidebar-layout"` → `from "@/components/organisms"`
- [ ] Replace `from "@/components/centered-layout"` → `from "@/components/templates"`
- [ ] Verify no circular dependencies
- [ ] Run `npm run lint` to check for errors
- [ ] Test in `npm run dev`

## Folder Reference

```
src/components/
├── atoms/                    # 6 basic elements
├── molecules/                # 9 simple combinations
├── organisms/                # 18+ complex features
├── templates/                # 2 page layouts
├── p5-js/                    # P5.js visualizations
└── index.ts                  # Root barrel
```

## Key Rules

✅ **DO:**
- Import from specific atomic levels: `@/components/atoms`, `@/components/molecules`, etc.
- Use barrel exports for cleaner imports
- Keep stories alongside components
- Follow the atomic hierarchy

❌ **DON'T:**
- Mix import styles in the same file
- Import organisms from atoms (breaking hierarchy)
- Use old flat import paths: `@/components/button` (use `@/components/atoms` instead)

