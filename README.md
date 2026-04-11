# Theta Web v2

Official website for **Theta 2026** built with **Qwik + Qwik City + Tailwind CSS**.

## What's New in v2

- Light-first black/white visual system with violet primary accent.
- Reworked responsive navigation with improved mobile interaction.
- Comic-style day cards with JSON-driven artwork.
- Refined events, sponsors, and contact page UI.

## Stack

- Qwik / Qwik City
- Vite
- Tailwind CSS
- DaisyUI (utility components)
- Netlify Edge deployment

## Prerequisites

- Node.js `>= 18.17`
- Bun `>= 1.3` (recommended)

## Local Development

```bash
bun install
bun run dev
```

Default dev URL: `http://localhost:5173` (or the Vite-assigned port).

## Scripts

- `bun run dev` - start local SSR development server
- `bun run build` - production build
- `bun run build.types` - TypeScript check
- `bun run lint` - ESLint
- `bun run preview` - preview production build
- `bun run serve` - Netlify local runtime

## Content System

All editable content is JSON-driven from:

- `/public/data/config.json`
- `/public/data/content.json`
- `/public/data/events.json`
- `/public/data/sponsors.json`
- `/public/data/team.json`

Day-card artwork is loaded from `/public/day/*.svg` and referenced in `config.json`.

### JSON Copy Coverage

- Home sponsors section labels (including previous-sponsor messaging) come from `content.json -> home.sponsors`.
- Events page metric/filter labels come from `content.json -> eventsPage.metrics` and `eventsPage.filterLabels`.
- Contact support labels and CTA copy come from `content.json -> contactPage`.

## Route Map

- `/` - home/landing page
- `/events` - searchable/filterable event explorer
- `/contact` - organizing team and WebTek contact directory

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API/Data Docs](./docs/API.md)

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `bun build.server` and `bun build.client`:

```shell
bun build
```

[Read the full guide here](https://github.com/QwikDev/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
bun deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.

## TODO

- [ ] Unify event data sources. The homepage, events page, and chatbot currently use different datasets and can disagree on schedules and details.
- [ ] Replace the `/register` fallback on the events modal with a safe state. Right now events without `regLink` can send users to a non-existent route.
- [ ] Fix broken event poster references, including `/EVENTSPOSTERS/SPORTS.jpg`.
- [ ] Fix missing contact/team image assets referenced from `public/data/team.json`, or update the JSON to valid image paths.
- [x] Remove or re-enable the dead GSAP animation block in `src/routes/contact/index.tsx` instead of leaving unreachable code behind an early `return`.
- [ ] Chatbot scroll issue: When chatbot is open on mobile, scrolling inside the chat scrolls the page instead of the chat content.
- [ ] Fix `fixMojibake` function in Chatbot - current implementation doesn't properly handle encoding issues.
- [ ] Add error handling/feedback when JSON data files fail to load (e.g., config.json, events.json).
- [ ] Remove unused theme-context.tsx - the theme system uses `data-theme` attribute on body instead.
- [ ] Fix hardcoded external URLs (Unsplash images in events page) - consider local copies to prevent broken images.
- [ ] Add validation for team image paths - several referenced images don't exist in `/public/team/`.
