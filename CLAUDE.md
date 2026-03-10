# CLAUDE.md — Portfolio Project Guidelines

## Project Overview
pnpm monorepo. Next.js 15 App Router portfolio site. Content served from Notion via `@portfolio/notion` package. Server Components fetch data directly; Client Components use TanStack Query + Next.js Route Handlers. Styles via vanilla-extract. Tests via Vitest + Testing Library + MSW.

---

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, @tanstack/react-query v5, pnpm
- **Styling**: vanilla-extract (CSS-in-TS), sprinkles for atomic styles
- **Data source**: Notion API via `@notionhq/client` (encapsulated in `packages/notion/`)
- **Testing**: Vitest, @testing-library/react, MSW for API mocking
- **Linting/Formatting**: Biome

## Key Scripts
- `pnpm dev` — start Next.js dev server
- `pnpm build` — next build
- `pnpm test` — vitest
- `pnpm lint` — biome check --write
- `pnpm check-types` — tsc --noEmit across all packages
- `pnpm fml` — biome format + check (full fix)

## Project Structure

```
packages/notion/src/      # @portfolio/notion
  types/                  # block.ts, page.ts, properties.ts, database.ts
  guards/                 # block.ts, properties.ts
  transform/              # blocks.ts, page.ts
  client.ts               # Notion SDK singleton
  config.ts               # STATIC_PAGE_IDS, resolvePageId()
  blocks.ts               # fetchBlocks()
  blocks-recursive.ts     # fetchBlocksRecursive()
  page.ts                 # fetchPage<T>(), fetchLandingPage(), fetchResumePage()
  database.ts             # fetchDatabase()
  data-source.ts          # fetchAndQueryDataSource()
  index.ts                # barrel export

apps/web/src/
  app/                    # App Router pages + Route Handlers
    page.tsx              # / (Server Component)
    resume/page.tsx       # /resume (Server Component)
    not-found.tsx         # 404
    api/blocks/[id]/      # Route Handler → fetchBlocks()
    api/page/[id]/        # Route Handler → fetchPage()
    api/database/[id]/    # Route Handler → fetchDatabase()
  components/
    Block.tsx             # Server Component
    BlockClient.tsx       # Client Component (used in Experience tree)
    Blocks.tsx            # Async Server Component
    BlocksClient.tsx      # Client Component with useSuspenseQuery
    Database.tsx          # Async Server Component
    DatabaseClient.tsx    # Client Component with useSuspenseQuery
    Experience.tsx        # "use client" — TanStack Query waterfall
    ResumeClient.tsx      # "use client" — useBreakpoint responsive divider
    Skills.tsx            # Server Component (pure rendering)
    QueryProvider.tsx     # "use client" — QueryClientProvider wrapper
    ThemeContext.tsx       # "use client" — ThemeContextProvider
    ThemeToggle.tsx        # "use client" — theme toggle button
    ThemeWrapper.tsx       # "use client" — applies theme class
    ui/                   # primitives: Box, Flex, Heading, RichText, TypeWriter, etc.
  data/                   # Client-side fetch functions (used by Experience + Route Handlers)
  hooks/                  # useColorScheme, useBreakpoint
  styles/                 # vanilla-extract styles (theme, sprinkles, typography, reset, etc.)
  test/                   # Vitest tests + MSW mocks/fixtures
```

---

## Server vs Client Components

Server Components call `@portfolio/notion` directly (no HTTP). Client Components use TanStack Query hitting the Route Handlers. Pages use `export const dynamic = 'force-dynamic'` to prevent static pre-rendering.

| Component | Type | Reason |
|-----------|------|--------|
| `app/page.tsx`, `app/resume/page.tsx` | Server | Async data fetching |
| `Blocks`, `Database`, `Skills` | Server | Async or pure rendering |
| `Box`, `Flex`, `Heading`, `RichText`, etc. | Server | No hooks |
| `TypeWriter` | Client | useState, useEffect, rAF |
| `ThemeContext`, `ThemeToggle`, `ThemeWrapper` | Client | Context, state |
| `Experience`, `BlocksClient`, `DatabaseClient` | Client | TanStack Query |
| `ResumeClient` | Client | useBreakpoint |
| `QueryProvider` | Client | QueryClientProvider |

---

## Workflow
- Before writing code, think through the approach: identify affected files, consider edge cases, and verify assumptions against existing patterns.
- Create new Beads issues (`bd create ...`) for **all** tasks. For larger features and changes, create epics (`bd create -t epic ...`) and assign tasks to it with the `--parent` flag. See @AGENTS.md and @.beads/README.md for more details on issue management.
- Commit **every time** you close an issue. This creates granular rollback points and ensures work is checked in periodically during longer sessions.

---

## TypeScript
- Use `import type` for type-only imports.
- Use type guards (`block is Foo`) for discriminated unions — see `packages/notion/src/guards/`.
- Use `Omit<>`, `Partial<>`, and other utility types to derive types rather than duplicating.
- Avoid `any`. Use `unknown` and narrow explicitly.
- Generics are preferred when they provide real value (e.g. `fetchPage<T>`).

---

## React
- Functional components only, named exports.
- Always define a `type XxxProps` for component props.
- Client-side data fetching uses `useSuspenseQuery` (TanStack Query). Components are wrapped in `<Suspense>` + `<ErrorBoundary>` — don't add local loading/error states.
- Use the polymorphic `Box` component (with `as` prop) for layout primitives rather than raw HTML elements with inline styles.
- Avoid inline styles except for truly one-off dynamic values that can't be expressed with sprinkles.

---

## Styling (vanilla-extract + sprinkles)
- All styles go in `apps/web/src/styles/` or co-located `Component.css.ts` files. No CSS modules, no Tailwind.
- Use sprinkles props for spacing, flex, size, and typography — e.g. `paddingY="300"`, `flexDirection={['column', 'row']}`.
- Responsive arrays follow `[mobile, tablet, print]` order.
- Space/size tokens use numeric scale: `100`, `200`, `300`, etc.
- For styles beyond what sprinkles covers, use `style()` in a `.css.ts` file.

---

## Testing
- Run tests: `pnpm test`
- Tests live in `apps/web/src/test/components/`. Name files `ComponentName.test.tsx`.
- Use `describe` + `it` blocks. Use `screen.findBy*` (async) for assertions after renders.
- Always wrap renders in the custom `render` util (`apps/web/src/test/utils/render.tsx`) — not the raw Testing Library one.
- Mock API calls with MSW. Use handler factories in `apps/web/src/test/mocks/handlers.ts` (`makeGetPageHandler`, `makeGetBlocksHandler`, etc.). Override per-test with `server.use(...)`.
- Server Components that call `@portfolio/notion` directly should be tested with `vi.mock('@portfolio/notion')`.
- Use fixture factories (`makeProperty`, `makeRichText`, `makeBlocks`) to create test data — don't hardcode raw Notion API shapes.
- Write tests before or alongside new features. Test behavior, not implementation.

---

## Code Quality & Hygiene
- Linting/formatting: Biome (`pnpm lint`). Run before committing.
- Tests must pass before pushing.
- No unused variables, imports, or dead code.
- Keep Route Handlers thin — validate input, call `@portfolio/notion`, return data.
- Do not commit `.env` or secrets. Do not remove `.env.example` files.
- Prefer editing existing files over creating new ones. New files should be clearly necessary.
- Keep changes focused — do not refactor or clean up code outside the scope of the task.
