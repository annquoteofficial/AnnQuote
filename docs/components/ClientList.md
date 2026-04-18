# ClientList

**Path:** `frontend/src/components/ClientList/`

Manages clients. Shows all clients in a table and toggles an inline form for create and edit operations. Deleting a client also deletes all their quotes (cascade enforced by the database).

## Files

| File        | Responsibility                                          |
|-------------|---------------------------------------------------------|
| `index.js`  | Client list state, form toggle, submit and delete handlers |
| `index.css` | Header layout, inline form grid, table structure        |
| `light.css` | Form card background, input borders, button colours     |
| `dark.css`  | Dark form surface, dark inputs, adjusted button colours |
| `mlight.css`| Single-column form grid, stacked form actions           |
| `mdark.css` | Dark form inputs on mobile                              |

## Classnames

| Class                        | Element                                           |
|------------------------------|---------------------------------------------------|
| `clientlist-page`            | Page root `<div>`                                 |
| `clientlist-header`          | Title + "New Client" button row                   |
| `clientlist-title`           | `<h1>` "Clients"                                  |
| `clientlist-new-btn`         | Button to open the inline form                    |
| `clientlist-form-section`    | Inline form card (visible when `showForm` is true)|
| `clientlist-form-title`      | `<h3>` "New Client" or "Edit Client"              |
| `clientlist-error`           | Error text shown on API failure                   |
| `clientlist-form-grid`       | 2-column grid for form fields                     |
| `clientlist-field`           | Label + input wrapper inside the grid             |
| `clientlist-field-label`     | `<label>` text                                    |
| `clientlist-field-input`     | `<input>` for name, email, company, phone         |
| `clientlist-form-actions`    | Submit + Cancel button row                        |
| `clientlist-submit-btn`      | Primary "Create" / "Save" button                  |
| `clientlist-cancel-btn`      | Secondary "Cancel" button                         |
| `clientlist-table-wrap`      | Card wrapper for client table                     |
| `clientlist-table`           | `<table>`                                         |
| `clientlist-thead-row`       | `<tr>` in `<thead>`                               |
| `clientlist-th`              | `<th>` header cells                               |
| `clientlist-tr`              | `<tr>` in `<tbody>`                               |
| `clientlist-td`              | `<td>` data cells                                 |
| `clientlist-actions-cell`    | `<td>` containing action buttons                  |
| `clientlist-action-btn`      | Base class for Edit and Delete buttons            |
| `clientlist-action-btn--edit`  | Modifier: Edit button (blue tint)               |
| `clientlist-action-btn--delete`| Modifier: Delete button (red tint)              |
| `clientlist-empty`           | "No clients yet." empty state `<p>`               |

## State

| State      | Type    | Description                                   |
|------------|---------|-----------------------------------------------|
| `data`     | array   | Client list from API                          |
| `showForm` | boolean | Controls inline form visibility               |
| `editing`  | number  | Client ID being edited, or `null` for new     |
| `form`     | object  | `{ name, email, phone, company }`             |
| `error`    | string  | Displayed above form on API failure           |

## API Calls

| Call                          | When              |
|-------------------------------|-------------------|
| `clientsApi.list()`           | On mount          |
| `clientsApi.create(form)`     | On submit (new)   |
| `clientsApi.update(id, form)` | On submit (edit)  |
| `clientsApi.delete(id)`       | On delete confirm |

## Delete Warning

Deleting a client triggers a `window.confirm` with the message:
> "Delete this client and all their quotes?"

The cascade is handled by the PostgreSQL foreign key constraint with `CASCADE DELETE`.
