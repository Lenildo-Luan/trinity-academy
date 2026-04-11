# Trinity platform

Trinity is a free platform to learn about the computer science universe

## Getting started

First install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Quality checks

```bash
npm run lint
npm run format:check
npm run coverage
```

## CI/CD and releases

### CI stages (`.github/workflows/app-ci.yml`)

**Triggers**: `pull_request` and `push` to `main`.

Pipeline order:

1. `npm ci`
2. `npm run format:check`
3. `npm run lint`
4. `npm run test:ci`
5. `npm run build`

If any stage fails, CI blocks merge/deploy.

### Release flow (`.github/workflows/release-please.yml`)

**Triggers**: `push` to `main` and `workflow_dispatch`.

`release-please` reads Conventional Commit messages and opens/updates a release PR.  
When that PR is merged, it updates the version manifest and `CHANGELOG.md`, then tags/releases.

Use Conventional Commits in PR titles/commits, for example:

- `feat: add quiz timer pause state` → **minor** bump
- `fix: handle empty lesson metadata` → **patch** bump
- `feat!: migrate quiz schema` or `BREAKING CHANGE:` → **major** bump

### Deploy gating (`.github/workflows/vercel-cd.yml`)

Production deploy runs only when:

- `Application CI` completed with `success`
- source event is `push` to `main`
- run belongs to this same repository

Job uses GitHub Environment `production` and requires these repository/environment secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Recommended branch protection for `main`

- Require pull requests before merging
- Require status checks:
  - `App quality gates` (from `Application CI`)
  - `storybook-quality` (from `Storybook UI Checks`)
- Require branches to be up to date before merging
- Block force pushes and branch deletion

## Images

This code uses the Next.js `<Image>` component to render images.

If your images are hosted remotely, update the `images.remotePatterns` setting in `next.config.ts` to match the correct URL. If you're serving images locally, you can remove the `images` key entirely.

When adding images to lesson markdown files, be sure to include the image size after the alt text, as the Next.js `<Image>` component requires this:

```md
![My alt tag|1000x500](my-image.png)
```

To support both light and dark mode images, insert `.{scheme}` before the file extension:

```md
![My alt tag|1000x500](my-image.{scheme}.png)
```

Then provide two versions of the image:

- `my-image.light.png` for light mode
- `my-image.dark.png` for dark mode

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [MDX](https://mdxjs.com/) - the official MDX documentation

## Storybook workflow

Use Storybook to build, test, and document UI components.

```bash
npm run storybook
npm run build-storybook
npx vitest run
npm run coverage
```

- Write stories in `src/components/**/**/*.stories.tsx` with `tags: ['autodocs']`.
- Use realistic component states (loading, auth, empty, error) when applicable.
- Keep docs pages in `src/stories/*.mdx`.
- Chromatic publication is configured in `.github/workflows/storybook.yml` (requires `CHROMATIC_PROJECT_TOKEN`).

## Coverage scope

Coverage is intentionally scoped to Storybook-validated UI components:

- `src/components/atoms/**/*.tsx`
- `src/components/molecules/**/*.tsx`
- `src/components/organisms/navbar/**/*.tsx`
- `src/components/templates/MarkdownTable.tsx`

To keep the 100% coverage target pragmatic, barrel files (`index.ts`), stories, and declaration files are excluded from instrumentation.

## Coverage guardrails for contributors

- Keep coverage at **100%** for configured files (statements, branches, functions, and lines, with per-file thresholds).
- Before opening a PR, run:

```bash
npm run coverage
```

- CI runs the same coverage command and fails the workflow if coverage regresses below the configured thresholds.

## TODO

- [ ] Iniciar versionamento 1.0.0_alpha
