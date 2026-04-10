# Atomic Design Structure - Visual Guide

## Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          TEMPLATES                              │
│           (Page layouts - CenteredPageLayout, etc.)            │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ORGANISMS                               │
│  (Complex features - Navbar, SidebarLayout, Quiz, etc.)        │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MOLECULES                                │
│ (Simple combinations - Breadcrumbs, VideoCard, Dropdown, etc.)  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          ATOMS                                  │
│    (Basic blocks - Button, Input, Logo, IconButton, etc.)      │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
VALID (following hierarchy):
─────────────────────────────────────────

Templates can use:
  ├─ Organisms
  ├─ Molecules
  ├─ Atoms
  └─ External libraries

Organisms can use:
  ├─ Molecules
  ├─ Atoms
  └─ External libraries

Molecules can use:
  ├─ Atoms
  └─ External libraries

Atoms can use:
  └─ External libraries only

---

INVALID (violating hierarchy):
─────────────────────────────────────────

❌ Atoms importing Molecules/Organisms/Templates
❌ Molecules importing Organisms/Templates
❌ Organisms importing Templates
```

## Component Classification Examples

### ATOMS (Most Basic)
```
Button    TextInput    Logo    IconButton    Marker    OTPInput
│         │            │       │             │         │
└─────────┴────────────┴───────┴─────────────┴─────────┘
          No dependencies on other components
```

### MOLECULES (Simple Combinations)
```
Breadcrumbs(Button, Link)
Dropdown(Button, List)
VideoCard(Image, Badge)
PageSection(Typography)
Video(HTML5 Video)
ContentLink(Link, Icon)
NextPageLink(Link, Arrow)
```

### ORGANISMS (Complex Features)
```
Navbar(Dropdown, IconButton)
SidebarLayout(Breadcrumbs, Navigation)
QuizSection(QuizQuestion, Button, Progress)
ProfileHeader(Avatar, TextInput)
Bookshelf(Book Card)
TableOfContents(Headings, Links)
```

### TEMPLATES (Page Layouts)
```
CenteredPageLayout(Navbar, Content Container)
MarkdownTable(HTML Table)
```

## File Organization

```
src/components/
│
├── atoms/
│   ├── button.tsx
│   ├── button.stories.tsx
│   ├── icon-button.tsx
│   ├── icon-button.stories.tsx
│   ├── input.tsx (TextInput, OTPInput)
│   ├── input.stories.tsx
│   ├── logo.tsx
│   ├── logo.stories.tsx
│   ├── marker.tsx
│   ├── marker.stories.tsx
│   └── index.ts ◄── Barrel export
│
├── molecules/
│   ├── breadcrumbs.tsx
│   ├── breadcrumbs.stories.tsx
│   ├── dropdown.tsx
│   ├── dropdown.stories.tsx
│   ├── video-card.tsx
│   ├── video-card.stories.tsx
│   ├── page-section.tsx
│   ├── page-section.stories.tsx
│   ├── video-player.tsx
│   ├── video-player.stories.tsx
│   ├── content-link.tsx
│   ├── next-page-link.tsx
│   └── index.ts ◄── Barrel export
│
├── organisms/
│   ├── navbar.tsx
│   ├── navbar.stories.tsx
│   ├── sidebar-layout.tsx
│   ├── profile-header.tsx
│   ├── profile-photo-upload.tsx
│   ├── profile-stats-cards.tsx
│   ├── table-of-contents.tsx
│   ├── bookshelf.tsx
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
│   └── index.ts ◄── Barrel export
│
├── templates/
│   ├── centered-layout.tsx
│   ├── MarkdownTable.tsx
│   └── index.ts ◄── Barrel export
│
├── p5-js/
│   └── ... (P5.js visualizations)
│
└── index.ts ◄── Root barrel export
```

## Import Examples by Scenario

### Scenario 1: Creating a Login Form
```typescript
// Login page needs basic input atoms
import { Button, TextInput, Logo } from "@/components/atoms";

// Or
import { Button, TextInput, Logo } from "@/components";
```

### Scenario 2: Building a Course Landing Page
```typescript
// Course page needs multiple levels
import { Button, Logo } from "@/components/atoms";
import { Breadcrumbs, ContentLink, PageSection } from "@/components/molecules";
import { SidebarLayoutContent } from "@/components/organisms";
import { CenteredPageLayout } from "@/components/templates";
```

### Scenario 3: Lesson Page with Quiz
```typescript
// Lesson page uses all levels
import { Button } from "@/components/atoms";
import { Breadcrumbs, Video, NextPageLink } from "@/components/molecules";
import { 
  SidebarLayoutContent, 
  TableOfContents, 
  QuizSection 
} from "@/components/organisms";
```

## Storybook Organization

```
Storybook Stories Mirror Folder Structure:

Stories/
├── Atoms/
│   ├── Button
│   ├── IconButton
│   ├── TextInput
│   ├── OTPInput
│   ├── Logo
│   └── Marker
│
├── Molecules/
│   ├── Breadcrumbs
│   ├── Dropdown
│   ├── VideoCard
│   ├── PageSection
│   ├── VideoPlayer
│   ├── ContentLink
│   └── NextPageLink
│
├── Organisms/
│   ├── Navbar
│   ├── SidebarLayout
│   ├── ProfileHeader
│   ├── Quiz
│   ├── Bookshelf
│   └── TableOfContents
│
└── Templates/
    ├── CenteredPageLayout
    └── MarkdownTable
```

## Component Size Reference

```
                    COMPLEXITY
                        ▲
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    TEMPLATES          │        High complexity
    (>500 lines)       │        (multiple features)
        │               │               │
    ORGANISMS          │        Medium complexity
    (200-500 lines)    │        (feature-specific)
        │               │               │
    MOLECULES          │        Low complexity
    (50-200 lines)     │        (single pattern)
        │               │               │
    ATOMS              │        Very low complexity
    (<50 lines)        │        (single element)
        │               │               │
        └───────────────┼───────────────┘
                        │
                   SIMPLE BLOCKS
```

## Import Decision Tree

```
Need a component?
│
├─ Is it a basic UI element?
│  ├─ Button, TextInput, Icon, etc.
│  └─ Use @/components/atoms ✓
│
├─ Is it a combination of basic elements?
│  ├─ Breadcrumbs, VideoCard, Dropdown, etc.
│  └─ Use @/components/molecules ✓
│
├─ Is it a feature or section of a page?
│  ├─ Navbar, Quiz, ProfileHeader, etc.
│  └─ Use @/components/organisms ✓
│
└─ Is it a full page layout?
   ├─ CenteredPageLayout, etc.
   └─ Use @/components/templates ✓
```

## Performance Tips

### Good ✅
```typescript
// Specific imports - better tree-shaking
import { Button } from "@/components/atoms";
import { Breadcrumbs } from "@/components/molecules";
```

### Also Good ✅
```typescript
// Barrel imports - cleaner syntax
import { Button, TextInput } from "@/components/atoms";
import { Breadcrumbs, Video } from "@/components/molecules";
```

### Less Ideal ⚠️
```typescript
// Root barrel - reduces tree-shaking effectiveness
import { Button, Breadcrumbs } from "@/components";
// (still works, just less optimal)
```

---

## Remember

🎯 **The atomic design structure is designed to be:**
- **Scalable** - Easy to add new components
- **Maintainable** - Clear organization and dependencies
- **Reusable** - Atoms combine into molecules, molecules into organisms
- **Testable** - Isolated component levels are easier to test

Follow the hierarchy, and your codebase will be cleaner and more efficient! 🚀

