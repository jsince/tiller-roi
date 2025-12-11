# Tiller ROI Calculator — Context Summary

> Use this file to onboard AI assistants to the project state.

## Project Location
- **Path:** `~/projects/work/tiller-roi`
- **Git:** `jsince/tiller-roi`
- **Local server:** `python3 -m http.server 8080`

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Layout, sections (Scenario Focus, Baseline, Results, Scenario Cards) |
| `src/main.js` | State management, calculations, rendering, event handlers |
| `styles.css` | All styling (CSS variables, BEM-ish classes) |
| `dev-session-notes/` | Session documentation |

## Current State Model (`src/main.js`)

```javascript
state = {
  tab: "cro" | "redesign",
  horizon: 12 | 24,
  inputPeriod: "monthly" | "annual",
  costOneTime: 30000,      // Global — applies to all scenarios
  costMonthly: 6000,       // Global — applies to all scenarios
  baseline: {
    traffic, cvr, fsql, s2o, win,
    arpu,              // Revenue per customer
    lifespanMonths,    // Customer lifespan (months)
    gm                 // Gross margin %
  },
  scenarios: {
    cro: [{ name, levers: { traffic, cvr, win } }, ...],
    redesign: [{ name, levers: { traffic, cvr, fsql, s2o, win } }, ...]
  }
}
```

## Key Calculations

```javascript
// LTV Model
LTV = (inputPeriod === "annual" ? arpu/12 : arpu) × lifespanMonths

// Funnel
visits → forms → SQLs → opps → wins → revenue (wins × LTV) → grossProfit

// ROI
totalCost = costOneTime + (costMonthly × horizon)
incrementalGP = scenarioGrossProfit - baselineGrossProfit
ROI = (incrementalGP - totalCost) / totalCost
```

## UI Structure

```
┌─ Scenario Focus ─────────────────────────────────────────┐
│ [CRO|Redesign]  [12mo|24mo]  One-time:[___] Monthly:[___]│
└──────────────────────────────────────────────────────────┘

┌─ Baseline Funnel ────────────────────────────────────────┐
│ Traffic, CVR, F→SQL, SQL→Opp, Win Rate                   │
│ Revenue/customer [Mo|Yr], Lifespan (mo), Gross margin    │
└──────────────────────────────────────────────────────────┘

┌─ Scenario Cards (×3) ────────────────────────────────────┐
│ Uplift levers only (no costs — costs are global now)     │
└──────────────────────────────────────────────────────────┘
```

## Recent Changes (Dec 2024)

1. **Removed unused fields:** Attribution split, Page speed delta
2. **Replaced ACV with LTV model:** `arpu` + `lifespanMonths`
3. **Added inline period toggle:** Mo/Yr chips next to ARPU field, dynamic hints
4. **Moved costs to Scenario Focus:** Global `costOneTime` and `costMonthly`

## Coding Conventions (from `AGENTS.md`)

- ES modules, const/let, camelCase
- BEM-ish CSS classes (`panel__header`, `focus-group`)
- No bundler — vanilla JS, direct browser load
- Manual testing only (no test suite)

## Git Workflow

This repo uses the `jsince` work profile:
- **Push:** `gp` (or `gacp "message"`)
- **Pull:** `gl`
- **Identity:** jsince / jeremy@tillerdigital.ca

