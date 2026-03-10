# Portfolio site

Personal portfolio site built with Next.js App Router, serving content from Notion. Styles via vanilla-extract.

## Structure

```
apps/web/          # @portfolio/web — Next.js app
packages/notion/   # @portfolio/notion — Notion API client + types
```

## Setup

```bash
pnpm install
```

Create `apps/web/.env.local`:
```
NOTION_AUTH_TK=your_token
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint + format (Biome) |
| `pnpm check-types` | TypeScript type check (all packages) |
