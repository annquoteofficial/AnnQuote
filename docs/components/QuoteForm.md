# QuoteForm

**Path:** `frontend/src/components/QuoteForm/`

Handles both **create** (`/quotes/new`) and **edit** (`/quotes/:id/edit`) via the same component. Detects edit mode by checking for `:id` in the URL params.

## Files

| File        | Responsibility                                              |
|-------------|-------------------------------------------------------------|
| `index.js`  | Form state, item row management, submit handler, edit pre-fill |
| `index.css` | Two-section layout, item row grid, field and button structure |
| `light.css` | Input borders/backgrounds, section card, button colours     |
| `dark.css`  | Dark input surfaces, muted labels, dark section card        |
| `mlight.css`| Simplified item row columns, stacked action buttons         |
| `mdark.css` | Dark input colours on mobile                                |

## Classnames

| Class                      | Element                                             |
|----------------------------|-----------------------------------------------------|
| `quoteform-page`           | Page root `<div>` (max-width: 720px)                |
| `quoteform-heading`        | `<h1>` "New Quote" or "Edit Quote"                  |
| `quoteform-error`          | Error banner shown on API failure                   |
| `quoteform-section`        | Card wrapper for "Quote Details" and "Line Items"   |
| `quoteform-section-title`  | `<h3>` inside each section                          |
| `quoteform-field`          | Label + input wrapper                               |
| `quoteform-label`          | `<label>` text                                      |
| `quoteform-input`          | Text / date `<input>`                               |
| `quoteform-input--qty`     | Modifier: quantity column input                     |
| `quoteform-input--price`   | Modifier: unit price column input                   |
| `quoteform-select`         | `<select>` (client picker)                          |
| `quoteform-textarea`       | Notes `<textarea>`                                  |
| `quoteform-item-row`       | Grid row for one line item (desc + qty + price + ✕) |
| `quoteform-remove-btn`     | ✕ button to remove an item row                      |
| `quoteform-add-item-btn`   | "+ Add Item" button                                 |
| `quoteform-total`          | Total display row                                   |
| `quoteform-total-value`    | `<span>` containing the dollar amount               |
| `quoteform-actions`        | Submit + Cancel button row                          |
| `quoteform-submit-btn`     | Primary submit button                               |
| `quoteform-cancel-btn`     | Secondary cancel button                             |

## State

| State      | Type    | Description                          |
|------------|---------|--------------------------------------|
| `clients`  | array   | All clients for the select dropdown  |
| `form`     | object  | `{ title, client_id, notes, valid_until }` |
| `items`    | array   | Line items `{ description, quantity, unit_price }` |
| `loading`  | boolean | Disables submit button while saving  |
| `error`    | string  | Displayed in error banner on failure |

## Line Item Grid (desktop)

```
| Description (1fr) | Qty (80px) | Unit Price (110px) | ✕ (36px) |
```

Collapses to `1fr 60px 90px 32px` on mobile.

## API Calls

| Call                        | When             |
|-----------------------------|------------------|
| `clientsApi.list()`         | On mount         |
| `quotesApi.get(id)`         | On mount (edit)  |
| `quotesApi.create(payload)` | On submit (new)  |
| `quotesApi.update(id, payload)` | On submit (edit) |

On success, navigates to the quote detail page (`/quotes/:id`).
