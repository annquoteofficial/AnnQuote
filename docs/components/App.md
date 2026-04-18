# App

**Path:** `frontend/src/App/`

Root layout component. Renders the sidebar navigation and the `<main>` content area. Contains the React Router `<BrowserRouter>` and all `<Route>` definitions.

## Files

| File        | Responsibility                                        |
|-------------|-------------------------------------------------------|
| `index.js`  | Layout wrapper, nav links, route definitions          |
| `index.css` | Flex layout: sidebar fixed-width, main takes remainder |
| `light.css` | Nav dark background (`#1e293b`), main light background |
| `dark.css`  | Nav deeper dark (`#020617`), main dark background      |
| `mlight.css`| Collapses to top nav bar on mobile                    |
| `mdark.css` | Adds bottom border to top nav bar in dark mode        |

## Classnames

| Class                 | Element                                      |
|-----------------------|----------------------------------------------|
| `app-layout`          | Root `<div>` — flex container                |
| `app-nav`             | `<nav>` sidebar                              |
| `app-logo`            | "AnnQuote" wordmark                          |
| `app-nav-link`        | Each `<NavLink>`                             |
| `app-nav-link--active`| Applied by React Router when route matches   |
| `app-main`            | `<main>` content area                        |

## Routing

| Path               | Component   |
|--------------------|-------------|
| `/`                | Dashboard   |
| `/quotes`          | QuoteList   |
| `/quotes/new`      | QuoteForm   |
| `/quotes/:id`      | QuoteDetail |
| `/quotes/:id/edit` | QuoteForm   |
| `/clients`         | ClientList  |

## Mobile Behaviour

On screens ≤768px the layout switches from a left sidebar to a horizontal top bar. The logo sits on the left and nav links wrap to the right. The main content area padding reduces from 32px to 16px.
