const money = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 0
});

const state = {
  screen: "welcome",
  income: 1800,
  activeTab: "month",
  selectedItemId: "food",
  expenseAmount: 28,
  expenseLabel: "Spesa supermercato",
  savedExpense: null,
  toast: "",
  items: [
    {
      id: "rent",
      category: "Fondamentali",
      name: "Casa",
      planned: 650,
      spent: 650,
      color: "#126c5a"
    },
    {
      id: "food",
      category: "Fondamentali",
      name: "Alimentari",
      planned: 330,
      spent: 75,
      color: "#126c5a"
    },
    {
      id: "fun",
      category: "Divertimento",
      name: "Uscite",
      planned: 160,
      spent: 64,
      color: "#c78312"
    },
    {
      id: "future",
      category: "Futuro",
      name: "Fondo casa",
      planned: 220,
      spent: 0,
      color: "#3a6ea5"
    }
  ],
  expenses: [
    { itemId: "rent", label: "Affitto", amount: 650 },
    { itemId: "food", label: "Spesa mercato", amount: 42 },
    { itemId: "fun", label: "Cinema", amount: 24 },
    { itemId: "food", label: "Pane e frutta", amount: 33 },
    { itemId: "fun", label: "Pranzo fuori", amount: 40 }
  ]
};

const app = document.querySelector("#app");

function formatMoney(value) {
  return `${money.format(value)} euro`;
}

function plannedTotal() {
  return state.items.reduce((sum, item) => sum + item.planned, 0);
}

function spentTotal() {
  return state.items.reduce((sum, item) => sum + item.spent, 0);
}

function remainingTotal() {
  return plannedTotal() - spentTotal();
}

function itemById(id) {
  return state.items.find((item) => item.id === id);
}

function itemRemaining(item) {
  return item.planned - item.spent;
}

function ratio(item) {
  if (item.planned <= 0) {
    return 0;
  }
  return Math.round((item.spent / item.planned) * 100);
}

function setScreen(screen) {
  state.screen = screen;
  state.toast = "";
  render();
}

function setTab(tab) {
  state.activeTab = tab;
  state.screen = "month";
  state.toast = "";
  render();
}

function updateIncome(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    state.income = Math.max(0, parsed);
    render();
  }
}

function updateExpenseAmount(value) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    state.expenseAmount = Math.max(0, parsed);
    render();
  }
}

function updateExpenseLabel(value) {
  state.expenseLabel = value;
}

function selectItem(id) {
  state.selectedItemId = id;
  render();
}

function openExpenseForItem(id) {
  state.selectedItemId = id;
  setScreen("expense");
}

function saveExpense() {
  const item = itemById(state.selectedItemId);
  if (!item || state.expenseAmount <= 0) {
    return;
  }
  const label = state.expenseLabel.trim() || item.name;
  item.spent += state.expenseAmount;
  state.savedExpense = {
    itemId: item.id,
    label,
    amount: state.expenseAmount
  };
  state.expenses.unshift(state.savedExpense);
  state.toast = `Spesa salvata in ${item.name}.`;
  state.screen = "month";
  state.activeTab = "month";
  state.expenseAmount = 28;
  state.expenseLabel = "Spesa supermercato";
  render();
}

function render() {
  if (state.screen === "welcome") {
    renderWelcome();
    return;
  }

  if (state.screen === "income") {
    renderIncome();
    return;
  }

  if (state.screen === "plan") {
    renderPlan();
    return;
  }

  if (state.screen === "expense") {
    renderExpense();
    return;
  }

  renderMonthShell();
}

function topbar(title, subtitle, backTarget) {
  const back = backTarget
    ? `<button class="icon-button" type="button" onclick="setScreen('${backTarget}')" aria-label="Indietro">&lt;</button>`
    : "";

  return `
    <header class="topbar">
      ${back}
      <div class="topbar-title">
        <strong>${title}</strong>
        <span>${subtitle}</span>
      </div>
    </header>
  `;
}

function renderWelcome() {
  app.innerHTML = `
    <section class="screen">
      ${topbar("Oikonomos", "Primo mese")}
      <div class="content compact-bottom">
        <div class="hero">
          <div class="eyebrow">Partiamo semplice</div>
          <h1>Creiamo Luglio senza partire da zero.</h1>
          <p class="lede">Ti preparo una struttura base. Poi potrai modificarla mentre capisci come spendi davvero.</p>
        </div>

        <div class="stack">
          <div class="card">
            <div class="split">
              <strong>Fondamentali</strong>
              <span class="pill green">prima</span>
            </div>
            <p class="small muted">Casa, spesa, bollette, trasporti.</p>
          </div>

          <div class="card">
            <div class="split">
              <strong>Divertimento</strong>
              <span class="pill amber">spazio</span>
            </div>
            <p class="small muted">Uscite, desideri, cose non obbligatorie.</p>
          </div>

          <div class="card">
            <div class="split">
              <strong>Futuro</strong>
              <span class="pill blue">progetti</span>
            </div>
            <p class="small muted">Fondi e obiettivi che crescono nel tempo.</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" type="button" onclick="setScreen('income')">Crea Luglio</button>
        <button class="ghost-button" type="button" onclick="setScreen('month')">Ho gia un mese</button>
      </div>
    </section>
  `;
}

function renderIncome() {
  const toAssign = Math.max(0, state.income - plannedTotal());
  app.innerHTML = `
    <section class="screen">
      ${topbar("Entrate previste", "Luglio 2026", "welcome")}
      <div class="content compact-bottom">
        <div class="hero">
          <div class="eyebrow">Passo 1 di 2</div>
          <h1>Quanti soldi vuoi organizzare questo mese?</h1>
          <p class="lede">Usiamo questo numero solo per aiutarti a distribuire il mese. Non serve essere perfetti.</p>
        </div>

        <div class="input-panel">
          <label>
            Entrate previste
            <input type="number" min="0" value="${state.income}" inputmode="numeric" oninput="updateIncome(this.value)">
          </label>
          <div class="metric-grid">
            <div class="metric">
              <span>Entrate</span>
              <strong>${formatMoney(state.income)}</strong>
            </div>
            <div class="metric">
              <span>Base</span>
              <strong>${formatMoney(plannedTotal())}</strong>
            </div>
            <div class="metric">
              <span>Libero</span>
              <strong>${formatMoney(toAssign)}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" type="button" onclick="setScreen('plan')">Continua</button>
      </div>
    </section>
  `;
}

function renderPlan() {
  const assigned = plannedTotal();
  const remaining = state.income - assigned;
  app.innerHTML = `
    <section class="screen">
      ${topbar("Piano base", "Luglio 2026", "income")}
      <div class="content compact-bottom">
        <div class="hero">
          <div class="eyebrow">Passo 2 di 2</div>
          <h1>Questa base basta per iniziare.</h1>
          <p class="lede">Non stiamo cercando il mese perfetto. Stiamo creando un mese che puoi usare oggi.</p>
        </div>

        <div class="metric-grid">
          <div class="metric">
            <span>Assegnato</span>
            <strong>${formatMoney(assigned)}</strong>
          </div>
          <div class="metric">
            <span>Da decidere</span>
            <strong>${formatMoney(remaining)}</strong>
          </div>
          <div class="metric">
            <span>Metodo</span>
            <strong>zero base</strong>
          </div>
        </div>

        <div class="stack" style="margin-top: 14px;">
          ${state.items.map(renderPlanItem).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" type="button" onclick="setScreen('month')">Usa questa base</button>
        <button class="ghost-button" type="button" onclick="setScreen('income')">Modifica entrate</button>
      </div>
    </section>
  `;
}

function renderPlanItem(item) {
  return `
    <div class="item-row">
      <div class="item-main">
        <div class="item-title">
          <strong>${item.name}</strong>
          <span class="small muted">${item.category}</span>
        </div>
        <span class="amount">${formatMoney(item.planned)}</span>
      </div>
    </div>
  `;
}

function renderMonthShell() {
  app.innerHTML = `
    <section class="screen">
      ${topbar(tabTitle(), "Luglio 2026")}
      <div class="month-shell">
        ${renderActiveTab()}
        ${renderBottomNav()}
      </div>
    </section>
  `;
}

function tabTitle() {
  if (state.activeTab === "budget") return "Budget";
  if (state.activeTab === "funds") return "Fondi";
  if (state.activeTab === "assets") return "Patrimonio";
  return "Questo mese";
}

function renderActiveTab() {
  if (state.activeTab === "budget") return renderBudgetTab();
  if (state.activeTab === "funds") return renderFundsTab();
  if (state.activeTab === "assets") return renderAssetsTab();
  return renderMonthTab();
}

function renderBottomNav() {
  return `
    <nav class="bottom-nav" aria-label="Navigazione principale">
      ${navButton("month", "Mese")}
      ${navButton("budget", "Budget")}
      ${navButton("funds", "Fondi")}
      ${navButton("assets", "Patrimonio")}
    </nav>
  `;
}

function navButton(tab, label) {
  const active = state.activeTab === tab ? "active" : "";
  return `
    <button class="nav-button ${active}" type="button" onclick="setTab('${tab}')">
      <span class="nav-mark"></span>
      <span>${label}</span>
    </button>
  `;
}

function renderMonthTab() {
  const remaining = remainingTotal();
  const spent = spentTotal();
  const planned = plannedTotal();
  const planPercent = Math.round((planned / Math.max(state.income, 1)) * 100);
  const spentPercent = Math.round((spent / Math.max(planned, 1)) * 100);
  const warningItems = state.items.filter((item) => ratio(item) >= 75);

  return `
    <div class="content">
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}

      <div class="hero" style="margin-top: ${state.toast ? "12px" : "0"};">
        <div class="eyebrow">Piano attivo</div>
        <h1>${formatMoney(remaining)} restano nel piano.</h1>
        <p class="lede">Hai speso ${formatMoney(spent)} su ${formatMoney(planned)} gia assegnati.</p>
      </div>

      <div class="card stack">
        <div class="split">
          <strong>Mese assegnato</strong>
          <span class="pill green">${planPercent}% entrate</span>
        </div>
        <div class="progress" aria-hidden="true">
          <span style="--value: ${planPercent}%; --color: var(--primary);"></span>
        </div>
        <div class="split small muted">
          <span>Speso rispetto al piano</span>
          <span>${spentPercent}%</span>
        </div>
      </div>

      <div class="stack" style="margin-top: 14px;">
        <button class="primary-button" type="button" onclick="setScreen('expense')">Segna spesa</button>
        <button class="secondary-button" type="button" onclick="setTab('budget')">Controlla budget</button>
      </div>

      <div class="stack" style="margin-top: 18px;">
        <h2>Segnali</h2>
        ${warningItems.map(renderSignal).join("")}
        <div class="signal">
          <strong>Fondo casa in piano</strong>
          <span class="small muted">Hai messo da parte ${formatMoney(220)} in Futuro.</span>
        </div>
      </div>

      <div class="stack" style="margin-top: 18px;">
        <div class="split">
          <h2>Ultime spese</h2>
          <button class="ghost-button" type="button" onclick="setScreen('expense')">Aggiungi</button>
        </div>
        ${state.expenses.slice(0, 4).map(renderExpenseRow).join("")}
      </div>
    </div>
  `;
}

function renderSignal(item) {
  const remaining = itemRemaining(item);
  const danger = remaining < 0;
  const klass = danger ? "brick" : "amber";
  const text = danger
    ? `Hai superato ${item.name} di ${formatMoney(Math.abs(remaining))}.`
    : `${item.name} ha ancora ${formatMoney(remaining)}.`;

  return `
    <div class="signal">
      <div class="split">
        <strong>${item.name}</strong>
        <span class="pill ${klass}">${danger ? "sforata" : "attenzione"}</span>
      </div>
      <span class="small muted">${text}</span>
    </div>
  `;
}

function renderExpenseRow(expense) {
  const item = itemById(expense.itemId);
  return `
    <div class="expense-row">
      <div class="item-main">
        <div class="item-title">
          <strong>${expense.label}</strong>
          <span class="small muted">${item ? item.name : "Budget"}</span>
        </div>
        <span class="amount">-${formatMoney(expense.amount)}</span>
      </div>
    </div>
  `;
}

function renderBudgetTab() {
  return `
    <div class="content">
      <div class="hero">
        <div class="eyebrow">Voci del mese</div>
        <h1>Ogni voce mostra quanto resta.</h1>
        <p class="lede">Le percentuali servono a capire, non a giudicare il mese.</p>
      </div>
      <div class="stack">
        ${state.items.map(renderBudgetItem).join("")}
      </div>
    </div>
  `;
}

function renderBudgetItem(item) {
  const remaining = itemRemaining(item);
  const percent = ratio(item);
  const color = remaining < 0 ? "var(--brick)" : item.color;
  return `
    <button class="item-row" type="button" onclick="openExpenseForItem('${item.id}')">
      <div class="item-main">
        <div class="item-title">
          <strong>${item.name}</strong>
          <span class="small muted">${item.category}</span>
        </div>
        <span class="amount">${formatMoney(remaining)}</span>
      </div>
      <div class="progress" aria-hidden="true">
        <span style="--value: ${percent}%; --color: ${color};"></span>
      </div>
      <div class="split small muted">
        <span>Speso ${formatMoney(item.spent)}</span>
        <span>Previsto ${formatMoney(item.planned)}</span>
      </div>
    </button>
  `;
}

function renderFundsTab() {
  return `
    <div class="content">
      <div class="hero">
        <div class="eyebrow">Futuro</div>
        <h1>I progetti stanno dentro al budget.</h1>
        <p class="lede">Per ora teniamo visibile solo il fondo collegato al mese.</p>
      </div>

      <div class="card stack">
        <div class="split">
          <div>
            <strong>Fondo casa</strong>
            <p class="small muted">Collegato alla voce Futuro</p>
          </div>
          <span class="amount">${formatMoney(220)}</span>
        </div>
        <div class="progress" aria-hidden="true">
          <span style="--value: 22%; --color: var(--blue);"></span>
        </div>
        <div class="split small muted">
          <span>Obiettivo</span>
          <span>${formatMoney(1000)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAssetsTab() {
  return `
    <div class="content">
      <div class="hero">
        <div class="eyebrow">Patrimonio</div>
        <h1>Uno snapshot basta per iniziare.</h1>
        <p class="lede">Nel MVP il patrimonio resta locale e semplice. Lo colleghiamo ai fondi senza trasformarlo in una banca.</p>
      </div>

      <div class="metric-grid">
        <div class="metric">
          <span>Totale</span>
          <strong>${formatMoney(4620)}</strong>
        </div>
        <div class="metric">
          <span>Mese</span>
          <strong>+${formatMoney(140)}</strong>
        </div>
        <div class="metric">
          <span>Fondi</span>
          <strong>${formatMoney(220)}</strong>
        </div>
      </div>

      <div class="stack" style="margin-top: 14px;">
        <button class="secondary-button" type="button">Aggiorna snapshot</button>
      </div>
    </div>
  `;
}

function renderExpense() {
  const selected = itemById(state.selectedItemId);
  const after = selected ? itemRemaining(selected) - state.expenseAmount : 0;
  const afterClass = after < 0 ? "brick" : "green";
  const afterText = after < 0
    ? `Dopo questa spesa ${selected.name} sara sotto di ${formatMoney(Math.abs(after))}.`
    : `Dopo questa spesa ${selected.name} avra ${formatMoney(after)}.`;

  app.innerHTML = `
    <section class="screen">
      ${topbar("Segna spesa", "Luglio 2026", "month")}
      <div class="content compact-bottom">
        <div class="hero">
          <div class="eyebrow">Spesa manuale</div>
          <h1>Dove mettiamo questa spesa?</h1>
          <p class="lede">Importo e voce bastano. La descrizione serve solo se ti aiuta a riconoscerla dopo.</p>
        </div>

        <div class="input-panel">
          <label>
            Importo
            <input type="number" min="0" value="${state.expenseAmount}" inputmode="decimal" oninput="updateExpenseAmount(this.value)">
          </label>
          <label>
            Descrizione
            <input type="text" value="${state.expenseLabel}" oninput="updateExpenseLabel(this.value)">
          </label>
        </div>

        <div class="stack" style="margin-top: 16px;">
          <h2>Voce</h2>
          <div class="choice-grid">
            ${state.items.map(renderExpenseChoice).join("")}
          </div>
        </div>

        <div class="signal" style="margin-top: 16px;">
          <div class="split">
            <strong>Effetto sul budget</strong>
            <span class="pill ${afterClass}">${after < 0 ? "sforamento" : "ok"}</span>
          </div>
          <span class="small muted">${afterText}</span>
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" type="button" onclick="saveExpense()">Salva spesa</button>
        <button class="ghost-button" type="button" onclick="setScreen('month')">Annulla</button>
      </div>
    </section>
  `;
}

function renderExpenseChoice(item) {
  const selected = item.id === state.selectedItemId ? "selected" : "";
  const remaining = itemRemaining(item);
  return `
    <button class="choice ${selected}" type="button" onclick="selectItem('${item.id}')">
      <span>
        <strong>${item.name}</strong><br>
        <span class="small muted">${item.category}</span>
      </span>
      <span class="amount">${formatMoney(remaining)}</span>
    </button>
  `;
}

render();
