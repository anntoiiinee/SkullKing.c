# SkullKing.c

Score tracker & statistics for Skull King card games.

![SkullKing.c](.github/skull_king-background.svg)

[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue)](https://gplv3.fsf.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)](#)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)](#)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflarepages&logoColor=fff)](#)

## Features

- **Full scoring** — bids vs tricks, with all bonuses (pirates captured by SK, SK captured by mermaid, black 14, color 14s, Tigresse)
- **Butin card** — linked to another player, +20 if both succeed, −20 if both fail
- **Single-button validation** — fill in all players then validate the round at once
- **Score correction** — click any past score to edit it
- **Round-by-round input** — guided flow through 10 rounds with live score preview
- **Early stop** — end a game before round 10
- **Delete games** — remove games from the dashboard
- **Real-time chart** — score evolution graph updated after each round
- **Player profiles** — win rate, bid accuracy, average score, best/worst score, win streaks
- **Advanced stats** — score progression over games, average score per round (bar chart)
- **Authentication** — email/password login, per-user data isolation
- **Supabase backend** — data persists across devices and sessions
- **Animated backgrounds** — Aurora, Waves, Particles, Squares, Threads (switchable)
- **Dark / Light mode** — toggle in sidebar
- **Responsive** — collapsible sidebar, works on mobile

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v4
- [BTCV Design System](https://ui.btcv.fr) (@btcv/ui)
- Supabase (PostgreSQL + Auth)
- Recharts
- Lucide icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor to create the required tables (`players`, `games`, `game_players`, `round_scores`) with RLS policies.

## Deployment

Deployed on **Cloudflare Pages** with:

| Setting | Value |
|---|---|
| Framework preset | `None` |
| Build command | `npm run build` |
| Output directory | `dist` |

Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are committed in `.env.production` since both values are public (client-side anon key).

## License

[GPLv3](LICENSE)
