# ROI Calculator Requirements

# BACKGROUND 

Our recent Website-to-Pipleline Gap research report revealed that CMOs often struggle to prove the ROI of their website investments, which in turn makes it challenging to secure the funding they need to continue investing. 

We want to offer a tool to help them project the ROI of investments in their sites, whether it be a re-design or CRO investments. In the past, we’ve created Google Sheets and scenarios within  presentations to help tell these stories. Examples:

* [Valimail CRO ROI Calculator](https://docs.google.com/spreadsheets/d/1EDuioJEipgJl1qdHp5D_o0Svch7Dm4iK6M5hkYhTxRs/edit?usp=sharing)  
* [Patronscan ROI Scenarios](https://docs.google.com/presentation/d/1cbGV2q0auDxODq0Ktz1NLbaYw8tbvb4xoiSFCTDZUOc/edit?slide=id.p#slide=id.p)

We now want to host a self-serve web-based calculator to serve as a high value resource for our clients and prospects that builds credibility for Tiller while also supporting SEO goals.

# DRAFT REQUIREMENTS

The requirements below were created with the help of ChatGPT as a starting point, and may be more appropriate for a custom build ideal scenario vs leveraging a 3rd party widget or plugin. After Dev team review and work effort estimates, we may choose to start with a more off-the-shelf solution, depending on the time/functionality tradeoffs involved.  

## Scope 

* Let B2B SaaS CMOs model the revenue impact of website investments across two tracks:  
  1. CRO scenarios (traffic uplift, on-page conversion uplift, sales close-rate uplift) — parity with the Valimail calculator.  
  2. Full redesign scenarios (traffic growth, conversion-rate uplift, form-to-SQL rate changes, SQL→Opp→Win, ACV, payback/NPV).  
* Also Include input for financial investment and ROI calculation based on that investment.

## 

## Parity with Valimail calculator (what we’re matching)

From the Valimail sheet we must support:

* Three CRO levers: traffic %, form conversion %, close rate %.  
* Baseline fields: page views/traffic, conversions, conversion rate, sales conversion rate, avg deal size.  
* Outputs: estimated revenue, $ and % revenue increase (12-month), scenario columns side-by-side.

## Extensions beyond Valimail

* Redesign tab with funnel-wide effects and costs/payback.  
* 24-month horizon and optional NPV.  
* Sensitivity analysis and funnel transparency.  
* Save/share/export; SEO-friendly landing page.  
* Prefill integrations to reduce guesswork.

## User flows 

* Landing page: Explains what the calculator does; ungated start; optional email capture before export/share.  
* Calculator screen:  
  * Tabs or toggles: “CRO” and “Redesign.”  
  * Scenario controls: Up to 3 named scenarios side-by-side (e.g., Base, Conservative, Aggressive) with quick % sliders and direct numeric entry.  
  * Live KPIs panel: Revenue, Incremental revenue, Pipeline (SQLs/Opps/Wins), Payback, 12-mo ROI, 24-mo ROI.  
  * Guided hints: Micro-copy for “What’s typical?” and “Where to find this data” (GA4/HubSpot/SFDC).  
* Results screen:  
  * Charts (bar for revenue impact, waterfall for drivers, line for payback over months).  
  * Download PDF/CSV; copy share-link; “Email me the model” (optional gate).

## Inputs (field list & validation)

### Common baseline (both tabs)

* Traffic (sessions or target page views) — integer ≥ 0  
* Primary CTA conversion rate (visit→form) — 0–50% (decimal)  
* Form→SQL rate — 0–100%  
* SQL→Opportunity rate — 0–100  
* Win rate (Opp→Closed-Won) — 0–100%  
* ACV (or average deal size) — currency ≥ 0  
* Gross margin % — 0–100% (for profit math)  
* Attribution split (optional): % Sourced vs % Influenced (defaults display only; doesn’t change revenue, used for reporting)  
* Time horizon: 12 and 24 months (toggle; both computed)

### CRO tab (Valimail parity \+)

* Traffic uplift %  
* On-page conversion uplift % (visit→form)  
* Sales close-rate uplift % (win rate)  
* Project cost (one-time)  
* Ongoing monthly cost (e.g., experimentation stack/retainer)

### Redesign tab (new)

* Organic traffic growth % (from brand/IA/SEO lift)  
* Sitewide conversion uplift % (macro CVR change from redesign & UX)  
* Form→SQL rate change % (improved form quality/routing)  
* SQL→Opp rate change % (clearer ICP messaging)  
* Opp→Win rate change % (credibility, case studies, speed)  
* One-time redesign cost (required)  
* Ongoing monthly cost (CMS, CRO, content ops)  
* Page speed improvement (TTFB/LCP) (optional input, v2: used to suggest a CVR delta if not provided)

### Validation & UX details

* Sliders with sensible ranges and direct input boxes; show deltas (+x%) vs absolutes.  
* Inline warnings for extreme values (e.g., CVR \> 30% sitewide) with “typical range” hints.  
* Required fields highlighted; autosave to `localStorage`.

## Outputs (computed and displayed)

* Revenue (baseline & scenario): by 6, 12 and 24 months.  
* Incremental revenue and incremental gross profit.  
* Pipeline waterfall: Visits → Form fills → SQLs → Opps → Wins.  
* ROI: (Incremental Gross Profit \- Total Cost) / Total Cost.  
* Payback period (months).  
* Sensitivity view: ±10% on the three primary levers (traffic, CVR, win rate).  
* Sourced vs Influenced (cosmetic split if user supplies; labels clarify no double counting).

## Formula spec (clear, auditable)

**Let:**

* `V` \= baseline monthly visits (or page views; multiplied by 12 or 24 for horizon).  
* `CVR` \= visit→form rate.  
* `FSQL` \= form→SQL rate.  
* `S2O` \= SQL→Opp rate.  
* `W` \= win rate.  
* `ACV` \= average deal size (revenue per win).  
* `GM` \= gross margin % (0–1).  
* `H` \= horizon months (12 or 24).

**Baseline (per horizon):**

* `Visits_base = V * H`  
* `Forms_base = Visits_base * CVR`  
* `SQLs_base = Forms_base * FSQL`  
* `Opps_base = SQLs_base * S2O`  
* `Wins_base = Opps_base * W`  
* `Revenue_base = Wins_base * ACV`  
* `GrossProfit_base = Revenue_base * GM`

**CRO scenario deltas:**

* `Visits_cro = Visits_base * (1 + TrafficUplift%)`  
* `CVR_cro = CVR * (1 + CVRUplift%)`  
* `W_cro = W * (1 + WinUplift%)`  
* Recompute funnel → `Revenue_cro` and `GrossProfit_cro`.  
* **Costs:** `TotalCost_cro = OneTime + (Monthly * H)`  
* **Incremental GP:** `ΔGP = GrossProfit_cro - GrossProfit_base`  
* **ROI:** `ROI = (ΔGP - TotalCost_cro) / TotalCost_cro`  
* **Payback:** first month `m` where cumulative `(GP_cro - GP_base)` ≥ cumulative cost.

**Redesign scenario deltas:**

* `Visits_redesign = Visits_base * (1 + OrganicTrafficGrowth%)`  
* `CVR_redesign = CVR * (1 + SitewideCVRUplift%)`  
* `FSQL_redesign = FSQL * (1 + FSQLChange%)`  
* `S2O_redesign = S2O * (1 + S2OChange%)`  
* `W_redesign = W * (1 + WinRateChange%)`  
* Recompute → `Revenue_redesign`, `GrossProfit_redesign`.  
* **Costs:** `TotalCost_redesign = OneTime + (Monthly * H)`  
* **ROI/payback:** same as above.

**Notes:**

* Clamp all rates to \[0, 1\] after applying % deltas.  
* If user supplies *only* page-level traffic instead of site sessions, label accordingly; math is the same.

## SEO requirements

* Indexable explainer page at `/website-roi-calculator/` (static route).  
  Server-render title/description and structured data (`SoftwareApplication` \+ FAQ).  
* Internal links from related blogs/resources; add copy sections answering intent-matching queries (“website ROI calculator,” “CRO ROI,” “website redesign ROI”).  
* Fast LCP: inline critical CSS; lazy-load charts.

## Accessibility, performance, security

* A11y: WCAG 2.2 AA, proper labels, keyboard access, visible focus, chart data tables with `aria-describedby`.  
* Perf: Core Web Vitals budgets (LCP \<2.5s, CLS \<0.1, INP \<200ms); ship \<150KB JS on first load.  
* Privacy: No PII required to use; only collect email on export/share; cookie-less by default; CSP locked down.  
  Security: Signed share tokens; SSRF/HTML injection protections on notes; rate limit `/api/pdf`.

## Content & microcopy (in-product)

* Field tooltips: where to find metric, typical ranges.  
* Inline “What moves this metric” tips:  
  * Traffic: IA/SEO, content velocity.  
  * CVR: messaging clarity, IA, forms, speed.  
    Win rate: proof (case studies), clarity of ICP, demo quality.  
* Disclaimers: influenced vs sourced; model ≠ forecast; user-controlled assumptions.

## Reporting & exports

* PDF report: brand header, inputs summary, funnel tables, charts, ROI/payback, sensitivity.  
* CSV export: baseline & each scenario (visits, forms, SQLs, opps, wins, revenue, GP, costs, ROI).  
* Share link: `/r/{id}` read-only view with same layout; expires or can be toggled private.

## Acceptance criteria (MVP)

1. Users can complete CRO and Redesign models without logging in.  
2. Calculator renders instantly (\<1s TTI on desktop cable) and passes a11y checks.  
3. Results show baseline vs up to 3 scenarios with: revenue, Δrevenue, ROI, payback, and a funnel table.  
4. Shareable URL reproduces state; PDF export matches on-screen numbers.  
5. All inputs validated; rates clamped; “Show math” reveals formulas and numbers used.  
6. Page is indexable, has structured data, and CWV within targets.

