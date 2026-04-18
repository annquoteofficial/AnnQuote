# QuoteDetail

**Path:** `frontend/src/components/QuoteDetail/`

Read-only view of a single quote. Shows client info, quote metadata, and a line items table. Includes an inline status `<select>` that immediately PATCHes the backend on change, plus Edit and Delete buttons.

## Files

| File        | Responsibility                                         |
|-------------|--------------------------------------------------------|
| `index.js`  | Fetch quote on mount, status change handler, delete handler |
| `index.css` | Two-column card grid, items table structure            |
| `light.css` | Card backgrounds, button colours, text colours         |
| `dark.css`  | Dark card surfaces, adjusted button and text colours   |
| `mlight.css`| Single-column card layout on mobile, table scroll      |
| `mdark.css` | Dark select and card on mobile                         |

## Classnames

| Class                      | Element                                             |
|----------------------------|-----------------------------------------------------|
| `quotedetail-page`         | Page root `<div>`                                   |
| `quotedetail-loading`      | Loading state `<p>`                                 |
| `quotedetail-header`       | Quote number + title + action buttons row           |
| `quotedetail-title-block`  | Wraps quote number and title                        |
| `quotedetail-quote-num`    | Quote number label (e.g. QT-2026-0001)              |
| `quotedetail-title`        | `<h1>` quote title                                  |
| `quotedetail-actions`      | Status select + Edit + Delete buttons               |
| `quotedetail-status-select`| `<select>` for inline status change                 |
| `quotedetail-btn`          | Base class for Edit and Delete buttons              |
| `quotedetail-btn--edit`    | Modifier: Edit button (blue)                        |
| `quotedetail-btn--delete`  | Modifier: Delete button (red)                       |
| `quotedetail-cards-grid`   | 2-column grid for Client + Details cards            |
| `quotedetail-card`         | Individual info card                                |
| `quotedetail-card--items`  | Modifier: Line Items card (full width)              |
| `quotedetail-card-title`   | `<h3>` inside each card                             |
| `quotedetail-info-row`     | `<p>` for each label: value pair                    |
| `quotedetail-items-table`  | `<table>` for line items                            |
| `quotedetail-thead-row`    | `<tr>` in `<thead>`                                 |
| `quotedetail-th`           | `<th>` header cells                                 |
| `quotedetail-tr`           | `<tr>` in `<tbody>`                                 |
| `quotedetail-td`           | `<td>` data cells                                   |
| `quotedetail-td--total`    | Modifier: total amount cell (accent colour)         |
| `quotedetail-total-row`    | `<tr>` in `<tfoot>` showing total                   |

## State

| State           | Type    | Description                                    |
|-----------------|---------|------------------------------------------------|
| `quote`         | object  | Full quote with client and items from API      |
| `changingStatus`| boolean | Disables select while PATCH is in-flight       |

## API Calls

| Call                                    | When                        |
|-----------------------------------------|-----------------------------|
| `quotesApi.get(id)`                     | On mount                    |
| `quotesApi.update(id, { status })`      | On status select change     |
| `quotesApi.delete(id)`                  | On delete confirm           |

Status change is fire-and-update: the returned quote object replaces state immediately, so the badge and select both reflect the new value without a page reload.
