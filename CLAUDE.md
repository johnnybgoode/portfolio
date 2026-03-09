# CLAUDE.md — Portfolio Project Guidelines

## Project Overview
React 19 + Vite portfolio site. Content served from Notion via Vercel BFF functions (`/api/`). Styles via vanilla-extract. Tests via Vitest + Testing Library + MSW.

---

## Tech Stack
- **Frontend**: React 19, Vite 7, TypeScript, react-router v7, @tanstack/react-query v5, pnpm
- **Styling**: vanilla-extract (CSS-in-TS), sprinkles for atomic styles
- **Backend**: Vercel serverless functions in `/api/`
- **Data source**: Notion API via `@notionhq/client`
- **Testing**: Vitest, @testing-library/react, MSW for API mocking
- **Linting/Formatting**: Biome

## Key Scripts
- `pnpm run dev` — start dev server
- `pnpm run build` — tsc + vite build
- `pnpm run lint` — biome check --write
- `pnpm run test` — vitest
- `pnpm run fml` — biome format + check (full fix)

## Project Structure
- `src/` — React app
  - `components/` — UI components (Block, Blocks, Database, Experience, LandingPage, Resume, Router, Page, etc.)
  - `components/ui/` — primitives (Box, Flex, Heading, Icon, IconLink, List, RichText, TypeWriter, etc.)
  - `data/` — data fetching layer (block.ts, database.ts, page.ts, properties.ts)
  - `hooks/` — useColorScheme, useBreakpoint
  - `styles/` — vanilla-extract styles (theme, sprinkles, typography, reset, print, etc.)
  - `test/` — tests + MSW mocks/fixtures
- `api/` — Vercel serverless functions
  - `blocks.ts`, `blocks-recursive.ts`, `page.ts`, `database.ts`, `data-source.ts`, `utils.ts`

---

## Workflow
- Before writing code, think through the approach: identify affected files, consider edge cases, and verify assumptions against existing patterns.
- Prefer editing existing files over creating new ones. New files should be clearly necessary.
- Keep changes focused — do not refactor or clean up code outside the scope of the task.
- 

---

## TypeScript
- Use `import type` for type-only imports.
- Use type guards (`block is Foo`) for discriminated unions — see `src/data/block.ts`.
- Use `Omit<>`, `Partial<>`, and other utility types to derive types rather than duplicating.
- Avoid `any`. Use `unknown` and narrow explicitly.
- Generics are preferred when they provide real value (e.g. `getPage<T>`).

---

## React
- Functional components only, named exports.
- Always define a `type XxxProps` for component props.
- Data fetching uses `useSuspenseQuery` (TanStack Query). Components are wrapped in `<Suspense>` + `<ErrorBoundary>` at the app level — don't add local loading/error states.
- Use the polymorphic `Box` component (with `as` prop) for layout primitives rather than raw HTML elements with inline styles.
- Avoid inline styles except for truly one-off dynamic values that can't be expressed with sprinkles.

---

## Styling (vanilla-extract + sprinkles)
- All styles go in `src/styles/` or co-located `Component.css.ts` files. No CSS modules, no Tailwind.
- Use sprinkles props for spacing, flex, size, and typography — e.g. `paddingY="300"`, `flexDirection={['column', 'row']}`.
- Responsive arrays follow `[mobile, tablet, print]` order.
- Space/size tokens use numeric scale: `100`, `200`, `300`, etc.
- For styles beyond what sprinkles covers, use `style()` in a `.css.ts` file.

---

## Testing
- Run tests: `npm run test`
- Tests live in `src/test/components/`. Name files `ComponentName.test.tsx`.
- Use `describe` + `it` blocks. Use `screen.findBy*` (async) for assertions after renders.
- Always wrap renders in the custom `render` util (`src/test/utils/render.tsx`) — not the raw Testing Library one.
- Mock API calls with MSW. Use the handler factories in `src/test/mocks/handlers.ts` (`makeGetPageHandler`, `makeGetBlocksHandler`, etc.). Override per-test with `server.use(...)`.
- Use fixture factories (`makeProperty`, `makeRichText`, `makeBlocks`) to create test data — don't hardcode raw Notion API shapes.
- Write tests before or alongside new features. Test behavior, not implementation.

---

## Code Quality & Hygiene
- Linting/formatting: Biome (`npm run lint`). Run before committing.
- No unused variables, imports, or dead code.
- Keep API functions thin — validate input, call Notion, return data. Error handling in the `catch` block; don't swallow errors silently.
- Path aliases: use `~components`, `~styles`, `~test` for imports within `src/`.
- Do not commit `.env` or secrets.
