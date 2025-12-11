const STORAGE_KEY = "tiller-roi-calculator";

const baselineFields = [
  {
    id: "traffic",
    label: "Monthly traffic (sessions)",
    kind: "number",
    min: 0,
    step: 100,
    default: 45000,
    hint: "Pull from GA4: Reports → Engagement → Pages & screens."
  },
  {
    id: "cvr",
    label: "Primary CTA conversion rate",
    kind: "percent",
    min: 0,
    max: 50,
    step: 0.1,
    default: 1.6,
    hint: "Visit → form rate. Most teams land between 0.5% and 3%."
  },
  {
    id: "fsql",
    label: "Form → SQL rate",
    kind: "percent",
    min: 0,
    max: 100,
    step: 1,
    default: 35,
    hint: "How many form fills qualify for sales."
  },
  {
    id: "s2o",
    label: "SQL → Opportunity rate",
    kind: "percent",
    min: 0,
    max: 100,
    step: 1,
    default: 45,
    hint: "Sales acceptance rate from CRM."
  },
  {
    id: "win",
    label: "Win rate (Opp → Closed Won)",
    kind: "percent",
    min: 0,
    max: 100,
    step: 1,
    default: 28,
    hint: "Calculated from opportunities forecast."
  },
  {
    id: "arpu",
    label: "Avg revenue per customer",
    kind: "currency",
    min: 0,
    step: 100,
    default: 3500,
    hint: "Monthly or annual recurring revenue per customer."
  },
  {
    id: "lifespanMonths",
    label: "Avg customer lifespan",
    kind: "number",
    min: 1,
    max: 120,
    step: 1,
    default: 36,
    hint: "How long customers typically stay (in months)."
  },
  {
    id: "gm",
    label: "Gross margin %",
    kind: "percent",
    min: 0,
    max: 100,
    step: 1,
    default: 75,
    hint: "Needed for ROI math. SaaS averages 70-85%."
  }
];

const scenarioLevers = {
  cro: [
    {
      id: "traffic",
      label: "Traffic uplift",
      kind: "percent",
      min: -20,
      max: 150,
      step: 1,
      default: 10,
      tip: "Content velocity, technical SEO, IA."
    },
    {
      id: "cvr",
      label: "On-page conversion uplift",
      kind: "percent",
      min: -10,
      max: 150,
      step: 1,
      default: 15,
      tip: "Messaging clarity, forms, offer testing."
    },
    {
      id: "win",
      label: "Sales close-rate uplift",
      kind: "percent",
      min: 0,
      max: 100,
      step: 1,
      default: 5,
      tip: "Demo quality, proof, better qualification."
    },
    {
      id: "costOneTime",
      label: "Project cost (one-time)",
      kind: "currency",
      min: 0,
      step: 1000,
      default: 30000
    },
    {
      id: "costMonthly",
      label: "Ongoing monthly cost",
      kind: "currency",
      min: 0,
      step: 500,
      default: 6000
    }
  ],
  redesign: [
    {
      id: "traffic",
      label: "Organic traffic growth",
      kind: "percent",
      min: -10,
      max: 200,
      step: 1,
      default: 35,
      tip: "Foundational IA + SEO lifts."
    },
    {
      id: "cvr",
      label: "Sitewide conversion uplift",
      kind: "percent",
      min: -10,
      max: 150,
      step: 1,
      default: 25,
      tip: "UX, offer clarity, speed."
    },
    {
      id: "fsql",
      label: "Form → SQL rate change",
      kind: "percent",
      min: -10,
      max: 100,
      step: 1,
      default: 10,
      tip: "Routing, better questions."
    },
    {
      id: "s2o",
      label: "SQL → Opp rate change",
      kind: "percent",
      min: -10,
      max: 100,
      step: 1,
      default: 8,
      tip: "ICP clarity, qualification."
    },
    {
      id: "win",
      label: "Opp → Win rate change",
      kind: "percent",
      min: -10,
      max: 100,
      step: 1,
      default: 5,
      tip: "Proof, case studies, urgency."
    },
    {
      id: "costOneTime",
      label: "One-time redesign investment",
      kind: "currency",
      min: 0,
      step: 1000,
      default: 120000
    },
    {
      id: "costMonthly",
      label: "Monthly operating cost",
      kind: "currency",
      min: 0,
      step: 500,
      default: 15000
    }
  ]
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});
const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const toDecimal = (value) => (Number.isFinite(value) ? value / 100 : 0);
const fromDecimal = (value) => value * 100;

const defaultBaseline = baselineFields.reduce((acc, field) => {
  switch (field.kind) {
    case "percent":
      acc[field.id] = toDecimal(field.default ?? 0);
      break;
    default:
      acc[field.id] = field.default ?? 0;
  }
  return acc;
}, {});

function createScenarioDefaults(key) {
  return ["Base", "Conservative", "Aggressive"].map((name, index) => {
    const levers = scenarioLevers[key].reduce((acc, lever) => {
      if (lever.kind === "percent") {
        const baseValue = lever.default ?? 0;
        const multiplier = index === 0 ? 0.5 : index === 2 ? 1.5 : 1;
        const percentValue = clamp(
          baseValue * multiplier,
          lever.min ?? baseValue * multiplier,
          lever.max ?? baseValue * multiplier
        );
        acc[lever.id] = toDecimal(percentValue);
      } else {
        acc[lever.id] = lever.default ?? 0;
      }
      return acc;
    }, {});
    return { name, levers };
  });
}

const defaultScenarios = {
  cro: createScenarioDefaults("cro"),
  redesign: createScenarioDefaults("redesign")
};

function loadState() {
  const baseState = {
    tab: "cro",
    horizon: 12,
    inputPeriod: "monthly",
    baseline: { ...defaultBaseline },
    scenarios: {
      cro: defaultScenarios.cro.map((s) => ({ ...s, levers: { ...s.levers } })),
      redesign: defaultScenarios.redesign.map((s) => ({ ...s, levers: { ...s.levers } }))
    }
  };

  if (typeof localStorage === "undefined") {
    return baseState;
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return baseState;
    return {
      tab: stored.tab === "redesign" ? "redesign" : "cro",
      horizon: stored.horizon === 24 ? 24 : 12,
      inputPeriod: stored.inputPeriod === "annual" ? "annual" : "monthly",
      baseline: { ...baseState.baseline, ...stored.baseline },
      scenarios: {
        cro: mergeScenarioArrays(baseState.scenarios.cro, stored.scenarios?.cro),
        redesign: mergeScenarioArrays(baseState.scenarios.redesign, stored.scenarios?.redesign)
      }
    };
  } catch (err) {
    console.warn("Unable to parse saved state:", err);
    return baseState;
  }
}

function mergeScenarioArrays(defaultArr, storedArr = []) {
  return defaultArr.map((scenario, index) => {
    const stored = storedArr[index];
    if (!stored) return { ...scenario, levers: { ...scenario.levers } };
    return {
      name: stored.name || scenario.name,
      levers: { ...scenario.levers, ...stored.levers }
    };
  });
}

const state = loadState();
let needsRecalculation = false;

const baselineForm = document.getElementById("baseline-form");
const scenariosContainer = document.getElementById("scenarios");
const kpiContainer = document.getElementById("kpi-cards");
const waterfallContainer = document.getElementById("waterfall-table");
const sensitivityContainer = document.getElementById("sensitivity");
const tabGroup = document.querySelector("[data-tab-group]");
const horizonGroup = document.querySelector(".horizon-toggle");
const showMathBtn = document.querySelector('[data-action="show-math"]');
const exportBtn = document.querySelector('[data-action="export"]');
const recalculateBtn = document.getElementById("recalculate-btn");
const mathModal = document.getElementById("math-modal");

function persistState() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderBaselineForm() {
  const html = baselineFields
    .map((field) => {
      const value = state.baseline[field.id] ?? 0;
      const displayValue =
        field.kind === "percent" ? fromDecimal(value).toFixed(2).replace(/\.?0+$/, "") : value;
      const suffix =
        field.kind === "percent"
          ? "%"
          : field.kind === "currency"
          ? ""
          : field.id === "traffic"
          ? "sessions"
          : "";

      // Special rendering for ARPU field with inline period toggle
      if (field.id === "arpu") {
        const isMonthly = state.inputPeriod === "monthly";
        const hint = isMonthly ? "MRR per customer" : "ARR per customer (÷12 for LTV)";
        return `
          <div class="field field--with-toggle">
            <div class="field__label-row">
              <label for="${field.id}">Revenue per customer</label>
              <div class="mini-toggle" role="radiogroup">
                <button type="button" class="mini-chip ${isMonthly ? "is-active" : ""}" data-period="monthly">Mo</button>
                <button type="button" class="mini-chip ${!isMonthly ? "is-active" : ""}" data-period="annual">Yr</button>
              </div>
            </div>
            <input
              id="${field.id}"
              type="number"
              inputmode="decimal"
              min="${field.min ?? 0}"
              step="${field.step ?? 1}"
              value="${displayValue}"
              data-baseline-field="${field.id}"
              data-kind="${field.kind}"
              aria-label="Revenue per customer"
            />
            <small>${hint}</small>
          </div>
        `;
      }

      return `
        <div class="field">
          <label for="${field.id}">
            ${field.label}
          </label>
          <input
            id="${field.id}"
            type="number"
            inputmode="decimal"
            min="${field.min ?? 0}"
            ${field.max !== undefined ? `max="${field.max}"` : ""}
            step="${field.step ?? 1}"
            value="${displayValue}"
            data-baseline-field="${field.id}"
            data-kind="${field.kind}"
            aria-label="${field.label}"
          />
          <small>${field.hint ?? ""}${suffix ? ` - ${suffix}` : ""}</small>
        </div>
      `;
    })
    .join("");

  baselineForm.innerHTML = html;
}

function renderTabs() {
  tabGroup
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === state.tab));
}

function renderHorizonToggle() {
  horizonGroup
    .querySelectorAll(".chip")
    .forEach((chip) => chip.classList.toggle("is-active", Number(chip.dataset.horizon) === state.horizon));
}

function renderScenarioCards() {
  const cards = state.scenarios[state.tab]
    .map((scenario, idx) => {
      const leverHtml = scenarioLevers[state.tab]
        .map((lever) => renderLeverControl(scenario, idx, lever))
        .join("");
      return `
        <article class="scenario-card" data-scenario-index="${idx}">
          <header>
            <span>Scenario</span>
            <input
              type="text"
              value="${scenario.name}"
              maxlength="30"
              data-scenario-name="${idx}"
              aria-label="Scenario name"
            />
          </header>
          ${leverHtml}
        </article>
      `;
    })
    .join("");
  scenariosContainer.innerHTML = cards;
}

function renderLeverControl(scenario, idx, lever) {
  const value = scenario.levers[lever.id] ?? 0;
  if (lever.kind === "percent") {
    const percentValue = value * 100;
    const sliderValue = percentValue.toFixed(0);
    const display = percentValue.toFixed(1).replace(/\.0$/, "");
    return `
      <div class="lever" data-lever="${lever.id}">
        <label>
          ${lever.label}
          <span>${display}%</span>
        </label>
        <input
          type="range"
          min="${lever.min}"
          max="${lever.max}"
          step="${lever.step}"
          value="${sliderValue}"
          data-scenario-index="${idx}"
          data-lever="${lever.id}"
          data-kind="percent"
        />
        <input
          type="number"
          inputmode="decimal"
          min="${lever.min}"
          max="${lever.max}"
          step="${lever.step}"
          value="${display}"
          data-scenario-index="${idx}"
          data-lever="${lever.id}"
          data-kind="percent"
        />
        ${lever.tip ? `<small>${lever.tip}</small>` : ""}
      </div>
    `;
  }

  return `
    <div class="lever" data-lever="${lever.id}">
      <label>${lever.label}</label>
      <input
        type="number"
        inputmode="decimal"
        min="${lever.min ?? 0}"
        ${lever.max !== undefined ? `max="${lever.max}"` : ""}
        step="${lever.step ?? 1}"
        value="${value}"
        data-scenario-index="${idx}"
        data-lever="${lever.id}"
        data-kind="${lever.kind}"
      />
      ${lever.tip ? `<small>${lever.tip}</small>` : ""}
    </div>
  `;
}

function runFunnel(inputs, horizon, inputPeriod = "monthly") {
  const visits = Math.max(inputs.traffic, 0) * horizon;
  const forms = visits * clamp(inputs.cvr, 0, 0.8);
  const sqls = forms * clamp(inputs.fsql, 0, 1);
  const opps = sqls * clamp(inputs.s2o, 0, 1);
  const wins = opps * clamp(inputs.win, 0, 1);
  // Convert ARPU to monthly if entered as annual
  const monthlyArpu = inputPeriod === "annual" ? inputs.arpu / 12 : inputs.arpu;
  const ltv = monthlyArpu * Math.max(inputs.lifespanMonths, 1);
  const revenue = wins * ltv;
  const grossProfit = revenue * clamp(inputs.gm, 0, 1);
  return { visits, forms, sqls, opps, wins, revenue, grossProfit, ltv };
}

function deriveScenarioInputs(tab, baseline, levers, overrides = {}) {
  const factor = (id, fallback = 0) => 1 + (levers[id] ?? fallback);
  const overrideFactor = (key) => overrides[key] ?? 1;

  if (tab === "cro") {
    return {
      traffic: baseline.traffic * factor("traffic") * overrideFactor("traffic"),
      cvr: clamp(baseline.cvr * factor("cvr") * overrideFactor("cvr"), 0, 0.7),
      fsql: baseline.fsql,
      s2o: baseline.s2o,
      win: clamp(baseline.win * factor("win") * overrideFactor("win"), 0, 1),
      arpu: baseline.arpu,
      lifespanMonths: baseline.lifespanMonths,
      gm: baseline.gm
    };
  }

  return {
    traffic: baseline.traffic * factor("traffic") * overrideFactor("traffic"),
    cvr: clamp(baseline.cvr * factor("cvr") * overrideFactor("cvr"), 0, 0.7),
    fsql: clamp(baseline.fsql * factor("fsql"), 0, 1),
    s2o: clamp(baseline.s2o * factor("s2o"), 0, 1),
    win: clamp(baseline.win * factor("win") * overrideFactor("win"), 0, 1),
    arpu: baseline.arpu,
    lifespanMonths: baseline.lifespanMonths,
    gm: baseline.gm
  };
}

function calcPayback(baseMonthly, scenarioMonthly, costOneTime, costMonthly, horizon) {
  const incremental = scenarioMonthly - baseMonthly;
  if (incremental <= 0) return null;
  let cumulativeProfit = 0;
  let cumulativeCost = costOneTime;

  for (let month = 1; month <= horizon; month += 1) {
    cumulativeProfit += incremental;
    cumulativeCost += costMonthly;
    if (cumulativeProfit >= cumulativeCost) {
      return month;
    }
  }
  return null;
}

function computeResults() {
  const baselineTotals = runFunnel(state.baseline, state.horizon, state.inputPeriod);
  const baselineMonthly = runFunnel(state.baseline, 1, state.inputPeriod);
  const scenarioResults = state.scenarios[state.tab].map((scenario) => {
    const derived = deriveScenarioInputs(state.tab, state.baseline, scenario.levers);
    const scenarioTotals = runFunnel(derived, state.horizon, state.inputPeriod);
    const scenarioMonthly = runFunnel(derived, 1, state.inputPeriod);
    const totalCost =
      (scenario.levers.costOneTime ?? 0) + (scenario.levers.costMonthly ?? 0) * state.horizon;
    const incrementalGP = scenarioTotals.grossProfit - baselineTotals.grossProfit;
    const roi =
      totalCost > 0 ? (incrementalGP - totalCost) / totalCost : incrementalGP > 0 ? Infinity : null;
    const payback = calcPayback(
      baselineMonthly.grossProfit,
      scenarioMonthly.grossProfit,
      scenario.levers.costOneTime ?? 0,
      scenario.levers.costMonthly ?? 0,
      state.horizon
    );

    return {
      name: scenario.name,
      totals: scenarioTotals,
      incrementalRevenue: scenarioTotals.revenue - baselineTotals.revenue,
      incrementalGP,
      totalCost,
      roi,
      payback,
      levers: scenario.levers
    };
  });

  return { baselineTotals, scenarioResults };
}

function renderKpis(results) {
  const { baselineTotals, scenarioResults } = results;
  const cards = [
    `
      <article class="kpi-card">
        <h4>Baseline revenue (${state.horizon} mo)</h4>
        <strong>${currencyFormatter.format(baselineTotals.revenue)}</strong>
        <p>Gross profit: ${currencyFormatter.format(baselineTotals.grossProfit)}</p>
      </article>
    `,
    ...scenarioResults.map(
      (scenario) => `
        <article class="kpi-card">
          <h4>${scenario.name}</h4>
          <strong>${currencyFormatter.format(scenario.totals.revenue)}</strong>
          <p>
            ΔRevenue ${formatDelta(scenario.incrementalRevenue)} ·
            ROI ${formatPercent(scenario.roi)}
          </p>
          <p>Payback ${formatPayback(scenario.payback)}</p>
        </article>
      `
    )
  ];
  kpiContainer.innerHTML = cards.join("");
}

function renderWaterfall(results) {
  const { baselineTotals, scenarioResults } = results;
  const header = `
    <table aria-describedby="waterfall">
      <thead>
        <tr>
          <th>Stage</th>
          <th>Baseline</th>
          ${scenarioResults.map((s) => `<th>${s.name}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${renderWaterfallRow("Visits", baselineTotals.visits, scenarioResults, (s) => s.totals.visits)}
        ${renderWaterfallRow("Form fills", baselineTotals.forms, scenarioResults, (s) => s.totals.forms)}
        ${renderWaterfallRow("SQLs", baselineTotals.sqls, scenarioResults, (s) => s.totals.sqls)}
        ${renderWaterfallRow("Opportunities", baselineTotals.opps, scenarioResults, (s) => s.totals.opps)}
        ${renderWaterfallRow("Wins", baselineTotals.wins, scenarioResults, (s) => s.totals.wins)}
        ${renderWaterfallRow(
          "Revenue",
          baselineTotals.revenue,
          scenarioResults,
          (s) => s.totals.revenue,
          true
        )}
      </tbody>
    </table>
  `;
  waterfallContainer.innerHTML = header;
}

function renderWaterfallRow(label, baselineValue, scenarios, accessor, isCurrency = false) {
  return `
    <tr>
      <td>${label}</td>
      <td>${isCurrency ? currencyFormatter.format(baselineValue) : numberFormatter.format(baselineValue)}</td>
      ${scenarios
        .map((scenario) => {
          const value = accessor(scenario);
          return `<td>${
            isCurrency ? currencyFormatter.format(value) : numberFormatter.format(value)
          }</td>`;
        })
        .join("")}
    </tr>
  `;
}

function renderSensitivity(results) {
  const { scenarioResults } = results;
  const rows = [];
  scenarioResults.forEach((scenario, idx) => {
    ["traffic", "cvr", "win"].forEach((leverKey) => {
      const label =
        leverKey === "traffic"
          ? "Traffic"
          : leverKey === "cvr"
          ? "Conversion"
          : "Win rate";
      const minus = computeScenarioWithOverride(idx, leverKey, 0.9);
      const plus = computeScenarioWithOverride(idx, leverKey, 1.1);
      rows.push({
        scenario: scenario.name,
        lever: label,
        minus: minus.totals.revenue,
        baseline: scenario.totals.revenue,
        plus: plus.totals.revenue
      });
    });
  });

  const table = `
    <table>
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Lever</th>
          <th>-10%</th>
          <th>Base</th>
          <th>+10%</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${row.scenario}</td>
                <td>${row.lever}</td>
                <td>${currencyFormatter.format(row.minus)}</td>
                <td>${currencyFormatter.format(row.baseline)}</td>
                <td>${currencyFormatter.format(row.plus)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
  sensitivityContainer.innerHTML = table;
}

function computeScenarioWithOverride(index, leverKey, multiplier) {
  const scenario = state.scenarios[state.tab][index];
  const derived = deriveScenarioInputs(state.tab, state.baseline, scenario.levers, {
    [leverKey]: multiplier
  });
  const totals = runFunnel(derived, state.horizon, state.inputPeriod);
  const baselineTotals = runFunnel(state.baseline, state.horizon, state.inputPeriod);
  const baselineMonthly = runFunnel(state.baseline, 1, state.inputPeriod);
  const scenarioMonthly = runFunnel(derived, 1, state.inputPeriod);
  const totalCost =
    (scenario.levers.costOneTime ?? 0) + (scenario.levers.costMonthly ?? 0) * state.horizon;
  const incrementalGP = totals.grossProfit - baselineTotals.grossProfit;
  const roi = totalCost > 0 ? (incrementalGP - totalCost) / totalCost : null;
  const payback = calcPayback(
    baselineMonthly.grossProfit,
    scenarioMonthly.grossProfit,
    scenario.levers.costOneTime ?? 0,
    scenario.levers.costMonthly ?? 0,
    state.horizon
  );

  return {
    name: scenario.name,
    totals,
    incrementalRevenue: totals.revenue - baselineTotals.revenue,
    incrementalGP,
    totalCost,
    roi,
    payback
  };
}

function formatDelta(value) {
  if (!Number.isFinite(value)) return "N/A";
  const formatted = currencyFormatter.format(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}`;
}

function formatPercent(value) {
  if (value === Infinity) return "∞";
  if (!Number.isFinite(value)) return "N/A";
  return percentFormatter.format(value);
}

function formatPayback(value) {
  if (!value) return "No payback";
  return `${value} mo`;
}

function markRecalculationNeeded() {
  needsRecalculation = true;
  const btn = document.getElementById("recalculate-btn");
  if (btn) {
    btn.classList.add("needs-recalc");
    btn.textContent = "Recalculate";
  }
}

function updateResults() {
  const results = computeResults();
  renderKpis(results);
  renderWaterfall(results);
  renderSensitivity(results);
  needsRecalculation = false;
  const btn = document.getElementById("recalculate-btn");
  if (btn) {
    btn.classList.remove("needs-recalc");
    btn.textContent = "Recalculate";
  }
}

function updateUI() {
  const results = computeResults();
  renderTabs();
  renderHorizonToggle();
  renderBaselineForm();
  renderScenarioCards();
  renderKpis(results);
  renderWaterfall(results);
  renderSensitivity(results);
  needsRecalculation = false;
  const btn = document.getElementById("recalculate-btn");
  if (btn) {
    btn.classList.remove("needs-recalc");
    btn.textContent = "Recalculate";
  }
}

function handleBaselineInput(event) {
  const field = event.target.dataset.baselineField;
  if (!field) return;
  const def = baselineFields.find((item) => item.id === field);
  if (!def) return;
  let value = Number(event.target.value);
  if (!Number.isFinite(value)) value = 0;
  if (def.kind === "percent") {
    value = clamp(value, def.min ?? 0, def.max ?? 100);
    state.baseline[field] = toDecimal(value);
  } else {
    value = Math.max(def.min ?? 0, value);
    state.baseline[field] = value;
  }
  persistState();
  markRecalculationNeeded();
}

function handleScenarioInput(event) {
  const index = Number(event.target.dataset.scenarioIndex);
  const leverId = event.target.dataset.lever;
  if (!Number.isInteger(index) || leverId === undefined) return;
  const leverDef = scenarioLevers[state.tab].find((lever) => lever.id === leverId);
  if (!leverDef) return;
  let value = Number(event.target.value);
  if (!Number.isFinite(value)) value = leverDef.kind === "percent" ? 0 : leverDef.min ?? 0;

  if (leverDef.kind === "percent") {
    value = clamp(value, leverDef.min ?? -100, leverDef.max ?? 200);
    state.scenarios[state.tab][index].levers[leverId] = toDecimal(value);
  } else {
    value = Math.max(leverDef.min ?? 0, value);
    state.scenarios[state.tab][index].levers[leverId] = value;
  }

  persistState();
  markRecalculationNeeded();
}

function handleScenarioNameChange(event) {
  const index = Number(event.target.dataset.scenarioName);
  if (!Number.isInteger(index)) return;
  state.scenarios[state.tab][index].name = event.target.value || "Scenario";
  persistState();
  // Update results to reflect name change in KPI cards and waterfall (name doesn't affect math)
  updateResults();
}

function handleTabChange(event) {
  const tab = event.target.dataset.tab;
  if (!tab) return;
  state.tab = tab;
  persistState();
  updateUI();
}

function handleHorizonChange(event) {
  const horizon = Number(event.target.dataset.horizon);
  if (![12, 24].includes(horizon)) return;
  state.horizon = horizon;
  persistState();
  updateUI();
}

function handlePeriodChange(event) {
  const period = event.target.dataset.period;
  if (!["monthly", "annual"].includes(period)) return;
  state.inputPeriod = period;
  persistState();
  updateUI();
}

function handleRecalculate() {
  // Ensure we're using the current tab's scenarios
  updateResults();
}

function handleShowMath() {
  if (typeof mathModal?.showModal === "function") {
    mathModal.showModal();
  }
}

function handleExport() {
  // Ensure we have the latest calculations
  if (needsRecalculation) {
    updateResults();
  }
  const { baselineTotals, scenarioResults } = computeResults();
  const header = [
    "Name",
    "Horizon (months)",
    "Visits",
    "Forms",
    "SQLs",
    "Opportunities",
    "Wins",
    "Revenue",
    "Gross Profit",
    "Incremental Revenue",
    "Incremental Gross Profit",
    "Total Cost",
    "ROI",
    "Payback (months)"
  ];

  const rows = [
    [
      "Baseline",
      state.horizon,
      baselineTotals.visits,
      baselineTotals.forms,
      baselineTotals.sqls,
      baselineTotals.opps,
      baselineTotals.wins,
      baselineTotals.revenue,
      baselineTotals.grossProfit,
      0,
      0,
      0,
      "",
      ""
    ],
    ...scenarioResults.map((scenario) => [
      scenario.name,
      state.horizon,
      scenario.totals.visits,
      scenario.totals.forms,
      scenario.totals.sqls,
      scenario.totals.opps,
      scenario.totals.wins,
      scenario.totals.revenue,
      scenario.totals.grossProfit,
      scenario.incrementalRevenue,
      scenario.incrementalGP,
      scenario.totalCost,
      Number.isFinite(scenario.roi) ? scenario.roi : "",
      scenario.payback ?? ""
    ])
  ];

  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((value) => {
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tiller-website-roi-${state.tab}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function init() {
  updateUI();
  baselineForm.addEventListener("input", handleBaselineInput);
  baselineForm.addEventListener("click", handlePeriodChange);
  scenariosContainer.addEventListener("input", handleScenarioInput);
  scenariosContainer.addEventListener("change", handleScenarioNameChange);
  tabGroup.addEventListener("click", handleTabChange);
  horizonGroup.addEventListener("click", handleHorizonChange);
  if (recalculateBtn) {
    recalculateBtn.addEventListener("click", handleRecalculate);
  }
  showMathBtn.addEventListener("click", handleShowMath);
  exportBtn.addEventListener("click", handleExport);
}

document.addEventListener("DOMContentLoaded", init);
