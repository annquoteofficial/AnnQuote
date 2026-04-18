# StatusBadge

**Path:** `frontend/src/components/StatusBadge/`

Shared inline badge that renders a quote status value with a colour-coded pill style. Used in Dashboard, QuoteList, and QuoteDetail.

## Props

| Prop     | Type   | Required | Description                                               |
|----------|--------|----------|-----------------------------------------------------------|
| `status` | string | yes      | One of: `draft`, `sent`, `accepted`, `rejected`, `expired` |

## Files

| File        | Responsibility                                   |
|-------------|--------------------------------------------------|
| `index.js`  | Renders `<span>` with base + modifier classname  |
| `index.css` | Pill shape: inline-block, padding, border-radius, font |
| `light.css` | Per-status background and text colours (light)   |
| `dark.css`  | Per-status colours shifted for dark backgrounds  |
| `mlight.css`| Slightly smaller font/padding on mobile          |
| `mdark.css` | Same size reduction on mobile dark               |

## Classnames

| Class                          | Applied when        |
|--------------------------------|---------------------|
| `statusbadge-root`             | Always              |
| `statusbadge-root--draft`      | status = `draft`    |
| `statusbadge-root--sent`       | status = `sent`     |
| `statusbadge-root--accepted`   | status = `accepted` |
| `statusbadge-root--rejected`   | status = `rejected` |
| `statusbadge-root--expired`    | status = `expired`  |

## Status Colours

| Status     | Light text  | Dark text   |
|------------|-------------|-------------|
| `draft`    | `#64748b`   | `#94a3b8`   |
| `sent`     | `#3b82f6`   | `#60a5fa`   |
| `accepted` | `#16a34a`   | `#4ade80`   |
| `rejected` | `#dc2626`   | `#f87171`   |
| `expired`  | `#d97706`   | `#fbbf24`   |

## Usage

```jsx
import StatusBadge from "../StatusBadge";

<StatusBadge status={quote.status} />
```
