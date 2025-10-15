# Storybook Implementation Plan

## Overview

This document outlines the plan to add Storybook to the "Introdução a Programação" Next.js project. Storybook will enable isolated component development and documentation for the educational platform.

## Project Context

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 (PostCSS-based)
- **TypeScript**: Version 5.8.3
- **React**: Version 19
- **Key Features**: MDX content, custom video player, authentication with Supabase

## Implementation Steps

### Phase 1: Installation and Setup

#### 1.1 Install Storybook
```bash
npx storybook@latest init --type nextjs
```

This will automatically:
- Install required dependencies
- Create `.storybook` configuration directory
- Add npm scripts to `package.json`
- Generate example stories

#### 1.2 Manual Package Installation (if needed)
If automatic setup doesn't work, install manually:

```bash
npm install --save-dev @storybook/react @storybook/react-webpack5 \
  @storybook/addon-essentials @storybook/addon-interactions \
  @storybook/addon-links @storybook/blocks @storybook/nextjs \
  storybook @storybook/test
```

### Phase 2: Configuration

#### 2.1 Configure Storybook Main Config

Create/update `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // Resolve path aliases
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      }
    }
    return config
  },
}

export default config
```

#### 2.2 Configure Storybook Preview

Create/update `.storybook/preview.ts`:

```typescript
import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
```

#### 2.3 Add Dark Mode Support

Install addon:
```bash
npm install --save-dev storybook-dark-mode
```

Update `.storybook/main.ts` to include the addon and configure themes based on the project's color scheme.

### Phase 3: Component Stories

#### 3.1 Priority Components to Document

Create stories for these components in order of priority:

1. **Basic UI Components**
   - `button.tsx` → `button.stories.tsx`
   - `icon-button.tsx` → `icon-button.stories.tsx`
   - `input.tsx` → `input.stories.tsx`
   - `dropdown.tsx` → `dropdown.stories.tsx`

2. **Navigation Components**
   - `navbar.tsx` → `navbar.stories.tsx`
   - `breadcrumbs.tsx` → `breadcrumbs.stories.tsx`

3. **Content Components**
   - `video-card.tsx` → `video-card.stories.tsx`
   - `video-player.tsx` → `video-player.stories.tsx`
   - `marker.tsx` → `marker.stories.tsx`
   - `logo.tsx` → `logo.stories.tsx`

4. **Layout Components**
   - `page-section.tsx` → `page-section.stories.tsx`

#### 3.2 Story Template Example

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}
```

### Phase 4: Handle Special Cases

#### 4.1 MDX Components

Create mock stories that demonstrate MDX component rendering without requiring full MDX pipeline. Use example content to showcase:
- Syntax highlighting with Shiki
- Custom heading IDs
- Image handling with light/dark mode

#### 4.2 Video Player Component

Mock video URLs and WebVTT transcript data for the video player stories:

```typescript
const mockVideoProps = {
  src: {
    sd: 'https://example.com/video-sd.mp4',
    hd: 'https://example.com/video-hd.mp4',
  },
  transcript: [
    { start: 0, end: 5, text: 'Hello world' },
    // ... more transcript entries
  ],
}
```

#### 4.3 Authentication Components

For components that use Supabase authentication:
- Create mock auth contexts
- Provide decorator to wrap stories with auth state
- Document authenticated vs unauthenticated states

```typescript
// .storybook/decorators/auth-decorator.tsx
export const withAuth = (Story, context) => {
  const mockUser = context.parameters.mockUser || null
  return (
    <MockAuthProvider user={mockUser}>
      <Story />
    </MockAuthProvider>
  )
}
```

### Phase 5: Testing Integration

#### 5.1 Add Interaction Tests

Install testing addon (if not included):
```bash
npm install --save-dev @storybook/test
```

Example interaction test:

```typescript
import { expect, userEvent, within } from '@storybook/test'

export const ButtonClick: Story = {
  args: {
    children: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await expect(button).toHaveTextContent('Click me')
  },
}
```

#### 5.2 Visual Regression Testing (Optional)

Consider adding Chromatic or similar service for visual regression testing:

```bash
npm install --save-dev chromatic
```

### Phase 6: Documentation

#### 6.1 Create MDX Documentation

Create `.storybook/introduction.mdx`:

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Introduction" />

# Component Library

This is the component library for Introdução a Programação.

## Getting Started

Browse components in the sidebar...
```

#### 6.2 Add Component Guidelines

For each major component category, create MDX docs explaining:
- Usage guidelines
- Accessibility considerations
- Design patterns
- Code examples

### Phase 7: Scripts and Workflow

#### 7.1 Update package.json Scripts

The Storybook init should add:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

#### 7.2 Add to CI/CD (Optional)

If using CI/CD, add Storybook build verification:

```yaml
# .github/workflows/storybook.yml
- name: Build Storybook
  run: npm run build-storybook
```

## Potential Challenges

### Tailwind CSS v4 Compatibility

**Issue**: Tailwind CSS v4 uses PostCSS-only approach which may not be fully compatible with Storybook's webpack setup.

**Solutions**:
1. Ensure Storybook's webpack config includes PostCSS processing
2. May need to configure `@storybook/addon-postcss` if issues arise
3. Test thoroughly with Tailwind utilities in stories

### React 19 Compatibility

**Issue**: React 19 is relatively new and some Storybook addons may not be fully tested.

**Solutions**:
1. Use latest Storybook version (8.x)
2. Monitor for peer dependency warnings
3. Test core functionality before full implementation

### MDX Content Integration

**Issue**: The project uses `@next/mdx` with custom plugins which may not work in Storybook.

**Solutions**:
1. Don't render actual MDX content in Storybook
2. Create mock representations of MDX components
3. Document MDX components separately with code examples

### Path Aliases

**Issue**: `@/*` path aliases need to work in Storybook.

**Solutions**:
1. Configure webpack aliases in `.storybook/main.ts`
2. Ensure tsconfig paths are respected

## Success Criteria

- [ ] Storybook runs without errors
- [ ] All priority components have stories
- [ ] Dark/light mode toggle works
- [ ] Path aliases resolve correctly
- [ ] Tailwind styles apply correctly
- [ ] Documentation is clear and helpful
- [ ] Build process completes successfully
- [ ] Stories are organized logically

## Maintenance

### Regular Tasks

1. Add stories for new components
2. Update stories when components change
3. Keep Storybook dependencies up to date
4. Review and update documentation
5. Add new interaction tests for complex behaviors

### File Structure

```
.storybook/
├── main.ts           # Main configuration
├── preview.ts        # Global decorators and parameters
├── decorators/       # Reusable decorators
│   └── auth-decorator.tsx
├── introduction.mdx  # Landing page
└── theme.css         # Custom Storybook theme (optional)

src/
└── components/
    ├── button.tsx
    ├── button.stories.tsx
    ├── navbar.tsx
    └── navbar.stories.tsx
```

## Timeline Estimate

- **Phase 1**: 1 hour - Installation and basic setup
- **Phase 2**: 2 hours - Configuration and Tailwind integration
- **Phase 3**: 8-12 hours - Writing component stories (3-4 components/hour)
- **Phase 4**: 4-6 hours - Handling special cases (MDX, video, auth)
- **Phase 5**: 2-3 hours - Adding interaction tests
- **Phase 6**: 2-3 hours - Documentation
- **Phase 7**: 1 hour - Scripts and workflow setup

**Total**: ~20-28 hours for complete implementation

## Resources

- [Storybook Next.js Docs](https://storybook.js.org/docs/get-started/nextjs)
- [Storybook Best Practices](https://storybook.js.org/docs/writing-stories/introduction)
- [Component Story Format](https://storybook.js.org/docs/api/csf)
- [Storybook Addons](https://storybook.js.org/addons)

## Next Steps

1. Run `npx storybook@latest init --type nextjs`
2. Verify Storybook starts successfully
3. Test with one simple component (Button)
4. Configure Tailwind CSS integration
5. Proceed with remaining phases
