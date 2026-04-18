# QuoteList

**Path:** `frontend/src/components/QuoteList/`

Lists all quotes in a table. Supports live search (by title or client name) and status filtering. Each row has View, Edit, and Delete actions.

## Files

| File        | Responsibility                                       |
|-------------|------------------------------------------------------|
| `index.js`  | State for data, search, status; load on filter change; delete handler |
| `index.css` | Flex filter bar, table structure, action button base |
| `light.css` | Input borders, table row colours, action button tints |
| `dark.css`  | Dark input/table surfaces, muted action tints        |
| `mlight.css`| Stacked filters, horizontal table scroll             |
| `mdark.css` | Dark input colours on mobile                         |

## Classnames

| Class                          | Element                                    |
|--------------------------------|--------------------------------------------|
| `quotelist-page`               | Page root `<div>`                          |
| `quotelist-header`             | Title + "New Quote" button row             |
| `quotelist-title`              | `<h1>` "Quotes"                            |
| `quotelist-new-btn`            | `<Link>` to `/quotes/new`                  |
| `quotelist-filters`            | Search + status select row                 |
| `quotelist-search`             | Text `<input>` for search                  |
| `quotelist-status-select`      | `<select>` for status filter               |
| `quotelist-table-wrap`         | Card wrapper around table                  |
| `quotelist-table`              | `<table>`                                  |
| `quotelist-thead-row`          | `<tr>` in `<thead>`                        |
| `quotelist-th`                 | `<th>` header cells                        |
| `quotelist-tr`                 | `<tr>` in `<tbody>`                        |
| `quotelist-td`                 | `<td>` data cells                          |
| `quotelist-actions-cell`       | `<td>` containing action buttons           |
| `quotelist-action-btn`         | Base class for all action buttons/links    |
| `quotelist-action-btn--view`   | Modifier: View link (indigo tint)          |
| `quotelist-action-btn--edit`   | Modifier: Edit link (blue tint)            |
| `quotelist-action-btn--delete` | Modifier: Delete button (red tint)         |
| `quotelist-empty`              | "No quotes found." empty state `<p>`       |

## State

| State    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `data`   | array  | Quote list from API                  |
| `search` | string | Live search term — triggers API call |
| `status` | string | Status filter — triggers API call    |

## API Calls

| Call                                     | When                     |
|------------------------------------------|--------------------------|
| `quotesApi.list({ search, status })`     | On mount and filter change |
| `quotesApi.delete(id)`                   | On delete confirm         |
