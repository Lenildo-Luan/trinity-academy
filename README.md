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
```

- Write stories in `src/components/**/**/*.stories.tsx` with `tags: ['autodocs']`.
- Use realistic component states (loading, auth, empty, error) when applicable.
- Keep docs pages in `src/stories/*.mdx`.
- Chromatic publication is configured in `.github/workflows/storybook.yml` (requires `CHROMATIC_PROJECT_TOKEN`).

## TODO

- [ ] Iniciar versionamento 1.0.0_alpha
