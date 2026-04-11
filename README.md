# THETA-2K26

Official website for **Theta 2026** - National Level Techno-Management Fest by SASTRA Deemed University.

## Tech Stack

- Qwik + Qwik City
- Vite
- Tailwind CSS
- DaisyUI
- GSAP (animations)
- Lenis (smooth scroll)
- Bun or npm

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:9090`

## Scripts

| Command               | Description      |
| --------------------- | ---------------- |
| `bun run dev`         | Start dev server |
| `bun run build`       | Production build |
| `bun run build.types` | TypeScript check |
| `bun run lint`        | ESLint           |
| `bun run preview`     | Preview build    |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── routes/         # Qwik City routes (pages)
├── utils/          # Shared utilities
└── global.css      # Global styles

public/
├── data/           # JSON content (config, events, team, etc.)
└── ...             # Static assets (images, fonts, etc.)
```

## Data Files

All content is JSON-driven:

- `public/data/config.json` - Event meta, dates, stats
- `public/data/content.json` - Page copy and labels
- `public/data/events.json` - Event listings
- `public/data/sponsors.json` - Sponsor tiers
- `public/data/team.json` - Team members
- `public/data/chatbot.json` - Chatbot intents

## Routes

- `/` - Homepage
- `/events` - Events listing
- `/sponsors` - Sponsors page
- `/contact` - Contact directory
- `/developers` - Dev team
- `/roadmap/day1`, `/day2`, `/day3` - Event timeline

## Known Issues

See [GitHub Issues](https://github.com/KRISH-FSD/THETA-2K26/issues) for open bugs and TODO items.
