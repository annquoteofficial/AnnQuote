# Frontend

## Stack

- **React 18** with functional components and hooks
- **React Router 6** for client-side routing
- **Axios** for HTTP requests via a shared `services/api.js` client

## Source Structure

```
frontend/src/
  index.js              React entry point — mounts <App />
  index.css             Global reset only (box-sizing, font-family)
  App/                  Root layout: sidebar nav + <main> outlet
  components/
    Dashboard/          Stats cards + recent quotes table
    QuoteList/          Searchable, filterable quote table
    QuoteForm/          Create and edit form with line items
    QuoteDetail/        Read-only view with inline status change
    ClientList/         Client CRUD with inline form
    StatusBadge/        Shared badge component for quote status
  services/
    api.js              Axios instance + typed endpoint functions
```

## 6-File Component Convention

Every component and page uses exactly this file layout:

| File        | Purpose                                                          |
|-------------|------------------------------------------------------------------|
| `index.js`  | Component logic. Zero inline styles. All classnames as strings.  |
| `index.css` | Structural layout: flex, grid, border-radius, font-size, spacing. No colors. |
| `light.css` | Light mode colors. Applied unconditionally (light is the default). |
| `dark.css`  | `@media (prefers-color-scheme: dark)` color overrides.           |
| `mlight.css`| `@media (max-width: 768px)` mobile layout adjustments.           |
| `mdark.css` | `@media (max-width: 768px) and (prefers-color-scheme: dark)` mobile dark overrides. |

**Import order** in every `index.js` — always in this order:

```js
import "./index.css";
import "./light.css";
import "./dark.css";
import "./mlight.css";
import "./mdark.css";
```

Order matters: light.css colors layer on top of index.css structure; dark.css overrides light.css via media query; mobile files override both.

## Classname Convention

Pattern: `componentname-elementname` — all lowercase, hyphen-separated.

Modifiers use BEM double-dash: `componentname-element--modifier`.

```
dashboard-page
dashboard-stat-card
dashboard-stat-card--accepted   ← modifier
quotelist-action-btn
quotelist-action-btn--delete    ← modifier
quoteform-input
quoteform-input--qty            ← modifier
statusbadge-root
statusbadge-root--sent          ← modifier
```

**Rules:**
- Never use generic names like `.card`, `.btn`, `.table`, `.wrapper`
- Never use inline `style={{}}` props
- Never use a classname from another component's namespace
- Modifiers (BEM `--`) are used for visual variants, never for layout

## Theming

Themes are driven by `prefers-color-scheme`. There is no JavaScript toggle — the browser/OS preference controls which CSS applies.

- `light.css` holds the default (light) values using direct CSS properties on the component's own classnames.
- `dark.css` wraps overrides in `@media (prefers-color-scheme: dark) { ... }`.

Color palette used across all components:

| Token               | Light         | Dark          |
|---------------------|---------------|---------------|
| Page background     | `#f8fafc`     | `#0f172a`     |
| Surface (cards)     | `#ffffff`     | `#1e293b`     |
| Surface hover       | `#f8fafc`     | `#273548`     |
| Primary text        | `#1e293b`     | `#f1f5f9`     |
| Secondary text      | `#475569`     | `#94a3b8`     |
| Muted text          | `#94a3b8`     | `#64748b`     |
| Border              | `#e2e8f0`     | `#334155`     |
| Accent              | `#6366f1`     | `#818cf8`     |
| Danger              | `#ef4444`     | `#f87171`     |
| Success             | `#22c55e`     | `#4ade80`     |

## Routing

Defined in `App/index.js`:

| Path               | Component     |
|--------------------|---------------|
| `/`                | Dashboard     |
| `/quotes`          | QuoteList     |
| `/quotes/new`      | QuoteForm     |
| `/quotes/:id`      | QuoteDetail   |
| `/quotes/:id/edit` | QuoteForm     |
| `/clients`         | ClientList    |

## API Service

`services/api.js` exports two namespaced objects:

```js
import { quotes, clients } from "../services/api";

// Quotes
quotes.list({ search, status, limit, skip })
quotes.get(id)
quotes.create(payload)
quotes.update(id, payload)
quotes.delete(id)
quotes.stats()

// Clients
clients.list()
clients.create(payload)
clients.update(id, payload)
clients.delete(id)
```

All functions return Axios promises. The base URL is read from `process.env.REACT_APP_API_URL` (defaults to `http://localhost:8000`).

## Adding a New Component

1. Create `frontend/src/components/MyComponent/`
2. Add all six files: `index.js`, `index.css`, `light.css`, `dark.css`, `mlight.css`, `mdark.css`
3. Use only classnames prefixed with `mycomponent-`
4. Import CSS in order: `index → light → dark → mlight → mdark`
5. Put structural styles in `index.css`, colors in `light.css`/`dark.css`, responsive in `mlight.css`/`mdark.css`
