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

3. **Quizzes** (`quizzes.ts` and `quizzes/` folder)
   - Interactive quizzes rendered at the end of lesson pages
   - Quiz data stored as JSON files in `/src/data/quizzes/`
   - Each quiz includes multiple questions with alternatives
   - Quizzes are associated with lessons via the `quizId` field in lesson metadata
   - Content functions: `getQuiz(quizId)`, `getAllQuizzes()`, `validateQuizData(data)`

#### Quiz Structure

Quizzes use the following TypeScript types:

```typescript
type Alternative = {
  id: string;                // Unique ID (e.g., "a1", "a2")
  text: string;              // Alternative text
  isCorrect: boolean;        // Whether this is the correct answer
  explanation?: string;      // Optional explanation shown in results
};

type Question = {
  id: string;                // Unique ID (e.g., "q1", "q2")
  question: string;          // Question text
  alternatives: Alternative[]; // Must have at least 2 alternatives
};

type Quiz = {
  id: string;                // Quiz ID (e.g., "quiz-1")
  title: string;             // Quiz title
  description: string;       // Quiz description
  timeLimit: number;         // Time limit in seconds (900 = 15 minutes)
  questions: Question[];     // Array of questions
};
```

#### Quiz JSON Format

Quizzes are stored as JSON files in `/src/data/quizzes/`. Example structure:

```json
{
  "id": "quiz-1",
  "title": "Quiz - Bem-vindos ao Futuro",
  "description": "Teste seus conhecimentos sobre JavaScript.",
  "timeLimit": 900,
  "questions": [
    {
      "id": "q1",
      "question": "O JavaScript foi criado para qual finalidade?",
      "alternatives": [
        {
          "id": "a1",
          "text": "Criar aplicativos mobile",
          "isCorrect": false,
          "explanation": "JavaScript foi criado para web."
        },
        {
          "id": "a2",
          "text": "Adicionar interatividade a páginas web",
          "isCorrect": true,
          "explanation": "Correto! JavaScript foi criado para tornar páginas web interativas."
        }
      ]
    }
  ]
}
```

**Validation Rules:**
- All fields (id, title, description, timeLimit, questions) are required
- Each question must have a unique ID
- Each question must have at least 2 alternatives
- Each question must have at least one correct alternative
- Alternative IDs must be unique within each question
- The `validateQuizData()` function checks these rules automatically

#### Associating Quizzes with Lessons

To add a quiz to a lesson:

1. Create a quiz JSON file in `/src/data/quizzes/` (e.g., `quiz-1.json`)
2. Add the quiz ID to the lesson's `quizId` field in `lessons.ts`:

```typescript
{
  slug: 'charpter-1',
  title: 'Bem-vindos ao Futuro',
  description: '...',
  quizId: 'quiz-1',  // Associate quiz with lesson
  // ... other fields
}
```

3. The quiz will automatically render at the end of the lesson page

#### QuizSection Component

The `<QuizSection>` component (`src/components/quiz-section.tsx`) is the main quiz container with three internal states:

**States:**
- `inactive` - Initial state showing "Iniciar Quiz" button
- `active` - Quiz in progress with timer, questions, and navigation
- `finished` - Results view showing score and explanations

**Props:**
```typescript
type QuizSectionProps = {
  quiz: Quiz;  // Quiz data loaded from JSON
}
```

**Key Features:**
- **Timer Management**: 15-minute countdown timer that auto-finishes quiz when time expires
- **State Management**: Uses `useQuizState` hook to manage current question, answers, and scoring
- **Navigation Blocking**: Prevents users from leaving the page during active quiz

**Sub-components:**
- `QuizInitialView` - Shows quiz info and start button
- `QuizActiveView` - Displays current question with timer and progress
- `QuizTimer` - Countdown timer with visual alerts (orange <2min, red pulsing <1min)
- `QuizProgressBar` - Shows "X of Y questions answered"
- `QuizQuestion` - Displays question with radio button alternatives
- `QuizNavigation` - "Próxima Questão" and "Encerrar Prova" buttons
- `QuizResultView` - Shows final score, correct/incorrect answers, and explanations
- `QuizNavigationBlockerModal` - Confirmation modal when user tries to leave

#### Navigation Blocking During Active Quiz

When a quiz is active, the `useNavigationBlocker` hook prevents users from accidentally leaving:

**Intercepted Actions:**
- Clicking sidebar links or breadcrumb navigation
- Browser back/forward buttons
- Attempting to close or reload the page
- Direct URL changes

**Behavior:**
- Shows confirmation modal: "Ao sair desta página, o quiz será finalizado. Deseja continuar?"
- If user confirms: Quiz is finalized and navigation proceeds
- If user cancels: Stays on page and quiz continues
- **Page scrolling is always allowed** - users can scroll to view lesson content while quiz is active

**Technical Implementation:**
- Uses three event listeners: `beforeunload`, `popstate`, and `click` (capture phase)
- Click handler traverses up to 5 DOM levels to find clicked links
- Intelligently ignores external links, anchors, mailto/tel links
- Stores pending destination and navigates after confirmation

**Timer Behavior:**
- Timer continues counting even if user switches tabs or minimizes window
- No pause functionality - runs continuously until time expires or quiz is finished
- Visual alerts when time is low (< 2 minutes) or critical (< 1 minute)

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
- **Mathematical notation support via KaTeX**:
  - Inline math: `$x = y^2$` renders as $x = y^2$
  - Block math: `$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$` renders as display equation
  - Full LaTeX syntax support for equations, matrices, symbols, etc.
  - Configured with `remark-math` and `rehype-katex` plugins in `next.config.mjs`
- **Interactive visualizations with p5.js**:
  - Pre-built components: `<BouncingBall />`, `<FollowMouse />`, `<SineWave />`, `<CirclePattern />`, `<Particles />`, `<TrafficLight />`
  - Custom sketches using `<P5Sketch setup={...} draw={...} width={400} height={400} />`
  - Components defined in `src/components/p5-sketch.tsx` and `src/components/p5-examples.tsx`
  - Great for visualizing programming concepts like loops, arrays, conditionals, and animation

### Key Components

Component organization in `/src/components/`:
- `sidebar-layout.tsx` - Main lesson navigation layout
- `centered-layout.tsx` - Centered content layout
- `video-player.tsx` - Custom video player for lessons/interviews
- `table-of-contents.tsx` - Auto-generated TOC from MDX headings
- `navbar.tsx` - Top navigation
- `breadcrumbs.tsx` - Navigation breadcrumbs

**Quiz Components:**
- `quiz-section.tsx` - Main quiz container managing three states (inactive, active, finished)
- `quiz-initial-view.tsx` - Initial view with quiz info and start button
- `quiz-active-view.tsx` - Active quiz view with timer, progress, question, and navigation
- `quiz-result-view.tsx` - Results view with score and explanations
- `quiz-timer.tsx` - Countdown timer with visual alerts
- `quiz-progress-bar.tsx` - Progress indicator showing answered questions
- `quiz-question.tsx` - Question display with radio button alternatives
- `quiz-navigation.tsx` - Navigation buttons (next question, finish quiz)
- `quiz-navigation-blocker-modal.tsx` - Confirmation modal for navigation attempts
- `quiz-error-view.tsx` - Error display for invalid quiz data
- `quiz-best-attempt.tsx` - Displays user's best previous attempt with score

### Quiz Persistence System

The application uses Supabase to persist quiz attempts and answers across devices.

**Database Schema:**
- See `supabase-quiz-schema.md` for complete SQL schema
- Tables: `quiz_attempts`, `quiz_answers`
- Views: `user_progress`, `quiz_statistics`, `completed_lessons`, `quiz_attempt_details`
- Row Level Security (RLS) enabled for all tables

**Architecture:**
- `src/types/database.ts` - TypeScript types for database tables
- `src/lib/quiz-service.ts` - Service functions for Supabase operations
- `src/hooks/use-quiz-persistence.ts` - Hook that auto-saves quiz state

**Automatic Saving:**
- Quiz attempts are created when quiz starts (status: 'in_progress')
- Each answer is saved immediately when user selects an alternative
- Attempt is updated when quiz finishes (status: 'completed')
- All data is associated with authenticated user via `auth.uid()`

**User Experience:**
- Best previous attempt is shown in `QuizInitialView`
- Progress syncs automatically across devices
- Lessons are marked complete when score >= 70%

For detailed documentation, see `QUIZ_PERSISTENCE.md`.

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
- Quiz JSON files must follow validation rules (see Quiz Structure section)
- Quizzes automatically render at the end of lesson pages when `quizId` is set
- Navigation blocking is active only during quiz state 'active' - users can freely scroll the page
