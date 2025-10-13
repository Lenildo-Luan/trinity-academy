# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based educational platform called "Introdução a Programação" (Introduction to Programming). It's built on the Tailwind Plus "Compass" template and serves programming course content and interviews in Portuguese.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Architecture

### Content Structure

The application has two primary content types, both defined in `/src/data/`:

1. **Lessons** (`lessons.ts` and `lessons/` folder)
   - Course content organized into modules and individual lessons
   - Each lesson is a standalone MDX file in `/src/data/lessons/`
   - Lesson metadata includes title, description, and optional video
   - Lesson IDs follow the pattern `charpter-N` (note: typo exists in codebase)
   - Content functions: `getModules()`, `getLesson(slug)`, `getLessonContent(slug)`

2. **Interviews** (`interviews.ts` and `interviews/` folder)
   - Interview videos with transcripts stored as WebVTT files
   - Each interview has chapters with timestamps
   - Includes video URLs (SD/HD), thumbnails, and duration
   - Content functions: `getInterviews()`, `getInterview(slug)`, `getInterviewTranscript(slug)`

### Route Structure

The app uses Next.js App Router with three distinct layout groups:

- `(sidebar)/` - Main lesson viewing with navigation sidebar
  - `/` - Home page showing all modules
  - `/[slug]` - Individual lesson pages

- `(centered)/` - Centered layout for resource pages
  - `/resources` - Resources page
  - `/interviews` - Interview listing
  - `/interviews/[slug]` - Individual interview pages

- `(auth)/` - Authentication pages
  - `/login` - Login page
  - `/otp` - OTP verification page

### MDX Configuration

MDX content is rendered with custom components defined in `mdx-components.tsx`:

- Auto-generates IDs for all headings (h1-h4) from text content
- Custom image handling with light/dark mode support using `{scheme}` placeholder
- Syntax highlighting via Shiki with custom theme (`src/app/syntax-theme.json`)
- Supports image dimensions in alt text: `![Alt text|1000x500](image.png)`
- Colorized bracket matching for code blocks

### Key Components

Component organization in `/src/components/`:
- `sidebar-layout.tsx` - Main lesson navigation layout
- `centered-layout.tsx` - Centered content layout
- `video-player.tsx` - Custom video player for lessons/interviews
- `table-of-contents.tsx` - Auto-generated TOC from MDX headings
- `navbar.tsx` - Top navigation
- `breadcrumbs.tsx` - Navigation breadcrumbs

### Styling

- Tailwind CSS v4 via PostCSS
- Custom typography styles in `src/app/typography.css`
- Global styles in `src/app/globals.css`
- Geist font family
- Headless UI for interactive components

## Path Aliases

The project uses `@/*` to reference the `src/` directory:
```typescript
import { getLesson } from '@/data/lessons'
```

## Important Notes

- Image paths in MDX should use the pattern `image.{scheme}.png` for light/dark mode variants
- All lesson IDs currently have the typo "charpter" instead of "chapter" - maintain consistency
- Remote images are configured for `assets.tailwindcss.com/templates/compass/**`
- Transcripts use WebVTT format with speaker annotations: `<v Speaker Name>`
