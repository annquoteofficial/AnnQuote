## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Project: AnnQuote

Quote management system. Full-stack: React JS frontend, FastAPI backend, PostgreSQL database.

## Frontend Component Convention

Every page and component lives in its own folder under `frontend/src/`:

```
ComponentName/
  index.js      — component logic only, zero inline styles
  index.css     — structural layout (flex, grid, spacing) — no colors
  light.css     — light mode colors (applied by default)
  dark.css      — @media (prefers-color-scheme: dark) overrides
  mlight.css    — @media (max-width: 768px) mobile layout
  mdark.css     — @media (max-width: 768px) and (prefers-color-scheme: dark)
```

CSS import order in every index.js:
```js
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";
```

## Classname Convention

All classnames follow the pattern `componentname-elementname` (all lowercase, hyphen-separated).
Modifiers use BEM double-dash: `componentname-element--modifier`.

Examples:
- `dashboard-stat-card`, `dashboard-stat-card--accepted`
- `quotelist-action-btn`, `quotelist-action-btn--delete`
- `quoteform-input`, `quoteform-input--qty`
- `statusbadge-root`, `statusbadge-root--sent`

Never use inline styles. Never use generic class names like `.card`, `.btn`, `.table`.

## Docs

Full documentation lives in `docs/`:
- `docs/architecture.md` — system overview and tech decisions
- `docs/frontend.md` — React structure and CSS conventions
- `docs/backend.md` — API endpoints and database schema
- `docs/components/` — one file per component
