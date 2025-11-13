# Tiller Website ROI Calculator

This repo contains a standalone, browser-based calculator that lets growth and marketing teams model Website CRO and redesign scenarios without any external dependencies.

## Getting started

1. Open `index.html` in any modern browser (Chrome, Edge, Safari, Firefox).  
2. Adjust the baseline funnel inputs that power both CRO and Redesign models.  
3. Use the sliders/numeric inputs in each scenario card to model uplifts and costs.  
4. Toggle between 12 and 24 month horizons to inspect the impact on revenue, gross profit, ROI, and payback.  
5. Download a CSV snapshot at any time via the **Export CSV** button.  

All inputs automatically persist to `localStorage`, so refreshing the page keeps your work in-progress. Select **Show the math** in the hero to review the underlying formulas.

## Tech overview

* Pure HTML/CSS/vanilla JS (no build tooling).  
* Responsive cards/grids to support desktop and tablet use cases.  
* Scenario engine clamps conversion rates, calculates funnel stages, incremental gross profit, ROI, and payback, and powers a ±10% sensitivity view on the three primary levers.  

## Next ideas

1. Hook up PDF export alongside CSV (using a print stylesheet or client-side renderer).  
2. Add shareable URLs by serializing state to `window.location.hash` or a lightweight backend.  
3. Layer in charts (bar for revenue impact, waterfall, and line for payback) using a ~10KB charting micro-lib or SVGs.  
4. Add inline warnings when conversion rates exceed typical bounds (>30% sitewide, >60% stage conversion).  
5. Prefill scenarios by industry benchmarks (enterprise SaaS, PLG, etc.) to make onboarding faster.  
