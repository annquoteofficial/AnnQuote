# Dashboard

**Path:** `frontend/src/components/Dashboard/`

Landing page. Shows six stat cards (total quotes, per-status counts, total portfolio value) and a table of the five most recent quotes.

## Files

| File        | Responsibility                                        |
|-------------|-------------------------------------------------------|
| `index.js`  | Fetches stats + recent quotes on mount, renders cards and table |
| `index.css` | Grid layout for stat cards, table structure           |
| `light.css` | Card backgrounds, accent colours per stat type        |
| `dark.css`  | Dark surface colours, shifted accent tones            |
| `mlight.css`| 2-column card grid on mobile, horizontal table scroll |
| `mdark.css` | Dark card and table surfaces on mobile                |

## Classnames

| Class                          | Element                                  |
|--------------------------------|------------------------------------------|
| `dashboard-page`               | Page root `<div>`                        |
| `dashboard-header`             | Title + "New Quote" button row           |
| `dashboard-title`              | `<h1>` "Dashboard"                       |
| `dashboard-new-btn`            | `<Link>` to `/quotes/new`                |
| `dashboard-stats-grid`         | CSS grid container for stat cards        |
| `dashboard-stat-card`          | Individual stat card                     |
| `dashboard-stat-card--total`   | Modifier: total quotes card              |
| `dashboard-stat-card--draft`   | Modifier: draft count card               |
| `dashboard-stat-card--sent`    | Modifier: sent count card                |
| `dashboard-stat-card--accepted`| Modifier: accepted count card            |
| `dashboard-stat-card--rejected`| Modifier: rejected count card            |
| `dashboard-stat-card--value`   | Modifier: total value card               |
| `dashboard-stat-label`         | Label text inside stat card              |
| `dashboard-stat-value`         | Large value number inside stat card      |
| `dashboard-section-title`      | `<h2>` "Recent Quotes"                   |
| `dashboard-table-wrap`         | Card wrapper around the table            |
| `dashboard-table`              | `<table>`                                |
| `dashboard-table-head-row`     | `<tr>` in `<thead>`                      |
| `dashboard-th`                 | `<th>` header cells                      |
| `dashboard-tr`                 | `<tr>` in `<tbody>`                      |
| `dashboard-td`                 | `<td>` data cells                        |
| `dashboard-view-link`          | "View" `<Link>` per row                  |
| `dashboard-loading`            | Loading state `<p>`                      |

## API Calls

| Call                              | When       |
|-----------------------------------|------------|
| `quotesApi.stats()`               | On mount   |
| `quotesApi.list({ limit: 5 })`    | On mount   |

## Stat Card Accent Colours (light)

| Card       | Border + value colour |
|------------|-----------------------|
| Total      | `#6366f1`             |
| Draft      | `#94a3b8`             |
| Sent       | `#3b82f6`             |
| Accepted   | `#22c55e`             |
| Rejected   | `#ef4444`             |
| Value      | `#0ea5e9`             |
