# Trinity Academy - Copilot Instructions

Trinity is an educational platform for computer science topics with interactive P5.js visualizations, MDX content, and quiz functionality.

## Build, Test, and Lint Commands

```bash
# Development
npm run dev              # Start Next.js dev server on localhost:3000
npm run build            # Production build
npm start                # Start production server

# Code quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Storybook
npm run storybook        # Start Storybook on localhost:6006
npm run build-storybook  # Build Storybook for deployment

# Testing
npx vitest               # Run all tests (Vitest with Playwright browser)
npx vitest --ui          # Run tests with UI
npx vitest [test-file]   # Run specific test file
```

## Architecture

### Route Organization

The app uses **Next.js App Router with layout groups** (parenthesized directories) for different UI layouts:

- **(auth)/** - Authentication pages with OTP login flow (`/login`, `/otp`)
- **(centered)/** - Single-column centered layout for profiles, interviews, resources
- **(sidebar)/** - Sidebar navigation layout for all course content
  - Course pages: `/[course]/` (e.g., `/redes-de-computadores/`)
  - Lesson pages: `/[course]/[slug]/` (e.g., `/redes-de-computadores/chapter-1/`)

Layout groups provide different visual wrappers **without affecting URLs**. All course routes appear flat (e.g., `/redes-de-computadores/chapter-1`) despite being nested in `(sidebar)`.

### MDX Content System

Lessons are organized in `src/data/lessons/[course-name]/`:

- **Content**: `.mdx` files (e.g., `chapter-1.mdx`) with embedded interactive components
- **Metadata**: `module.json` files define course structure, video info, quiz references
- **Loading**: `src/data/lessons.ts` provides `getCourseModules()`, `getLesson()` functions
- **Rendering**: MDX files are rendered as React components with registered custom components

**Math support**: Uses `remark-math` + `rehype-katex` for LaTeX equations.

**Code highlighting**: Shiki with custom theme (`src/app/syntax-theme.json`) and colorized brackets.

### P5.js Integration Pattern

The codebase has a **component-based wrapper pattern** for P5.js visualizations:

**Core wrapper** (`src/components/p5-sketch.tsx`):
- Generic reusable component that accepts `setup()`, `draw()`, `mousePressed()` callbacks
- Client-side only (uses dynamic import)
- Manages p5 instance lifecycle with proper cleanup

**Specialized components** (34+ files like `routing-fundamentals-p5-examples.tsx`):
- Domain-specific visualizations for each course topic
- Export multiple named components (e.g., `DijkstraRoutingStepSimulator`, `BGPTopologyVisualizer`)
- Used directly in MDX via `mdx-components.tsx` registration

**To add a new P5 visualization**:
1. Create component in `src/components/[topic]-p5-examples.tsx`
2. Use `<P5Sketch>` wrapper with setup/draw functions
3. Export the component
4. Register in `mdx-components.tsx`
5. Use directly in lesson MDX files

### Supabase Integration

**Authentication**: OTP-based magic link flow
- `src/app/(auth)/actions.ts` - Server actions: `sendOTP()`, `verifyOTP()`, `signOut()`
- `src/contexts/auth-context.tsx` - Client-side auth state provider
- `src/lib/supabase/middleware.ts` - Route protection and token refresh

**Database services**:
- `src/lib/services/quiz-service.ts` - Quiz attempts, answers, progress tracking
- `src/lib/services/profile-service.ts` - User profiles, photo uploads to Supabase Storage
- `src/lib/services/stats-service.ts` - Learning statistics and metrics

**Client vs Server**:
- `src/lib/supabase/client.ts` - Browser client using `@supabase/ssr`
- `src/lib/supabase/server.ts` - Server client using Next.js `cookies()` API

### Component Conventions

**File naming**: Lowercase with hyphens (`sidebar-layout.tsx`, `button.tsx`)

**Component structure**:
- Functional components with TypeScript
- `"use client"` directive for interactive components (auth, P5, quiz)
- `"use server"` for server actions
- Layout components are server components by default

**Styling**: Tailwind CSS only
- Use `clsx` for conditional classes
- Custom theme in `src/app/globals.css` with `@theme` directive
- No CSS modules or CSS-in-JS

**Stories**: Components with `.stories.tsx` files use Storybook CSF format
- Use `satisfies Meta<typeof Component>` pattern
- Tag with `'autodocs'` for automatic documentation
- Mock auth context in `.storybook/mocks/auth-context.tsx` for isolated testing

### Shared Utilities

**Hooks** (`src/hooks/`):
- `useAuth()` - Global auth state (user, loading, signOut)
- `useQuizState()` - Quiz question/answer management
- `useQuizTimer()` - Quiz time tracking
- `useUserProfile()` - Fetch/manage user data
- `useNavigationBlocker()` - Prevent navigation during quizzes

**Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.json`)

## Key Conventions

### Import Organization

Prettier is configured to auto-organize imports:
- Uses `prettier-plugin-organize-imports`
- Sorts Tailwind classes with `prettier-plugin-tailwindcss`
- Run `npm run format` to apply

### MDX Component Registration

All custom MDX components must be registered in `mdx-components.tsx`:

```typescript
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    P5Sketch,
    MyNewComponent, // Add here
    ...components,
  };
}
```

This makes components available in all `.mdx` lesson files.

### Image Handling in MDX

Next.js `<Image>` component requires dimensions. In MDX files, use:

```md
![Alt text|1000x500](image.png)
```

For theme-aware images, use `.{scheme}` before extension:

```md
![Alt text|1000x500](image.{scheme}.png)
```

Then provide `image.light.png` and `image.dark.png`.

### Quiz Structure

Quizzes are defined in `src/data/quizzes/[course-name]/[quiz-id].json`:

```json
{
  "id": "quiz-id",
  "courseId": "course-name",
  "title": "Quiz Title",
  "timeLimit": 300,
  "questions": [
    {
      "id": "q1",
      "text": "Question text",
      "type": "single-choice",
      "options": [...],
      "correctAnswer": "option-id"
    }
  ]
}
```

Referenced in `module.json` via `quizId` field.

### TypeScript Patterns

- Use strict mode (enabled in `tsconfig.json`)
- Prefer `React.ComponentProps<"element">` for extending native elements
- Export types alongside components when needed
- Use `satisfies` for type narrowing (e.g., `satisfies Meta<typeof Component>`)

### Storybook Configuration

Components requiring auth should use mock context:

```typescript
import { AuthProvider } from '../.storybook/mocks/auth-context';

export const Default: Story = {
  decorators: [
    (Story) => (
      <AuthProvider value={{ user: mockUser, loading: false }}>
        <Story />
      </AuthProvider>
    ),
  ],
};
```

### Environment Variables

Required variables (create `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing Conventions

- Tests run in browser with Playwright via Vitest
- Storybook stories can have inline tests with `@storybook/addon-vitest`
- Component tests should verify user interactions, not implementation details
- Use Storybook's a11y addon to catch accessibility issues

## Notes

- **Turbopack enabled**: Next.js uses Turbopack for faster builds
- **React 19**: Uses latest React features
- **Tailwind v4**: Latest version with `@tailwindcss/postcss`
- **Content language**: Lessons are primarily in Portuguese (Brazil)
