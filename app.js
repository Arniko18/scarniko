/* ============================================================
   SCARNIKO · APP
   ============================================================ */

/* ---------- ICONS (simple line set) ---------- */
const I = {
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  radar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><path d="M12 12 L20 7"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 8 L12 3 L3 8 v8 l9 5 9-5 Z"/><path d="M3 8 l9 5 9-5"/><path d="M12 13 v8"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20 a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5 a3 3 0 0 1 0 5.5"/><path d="M17.5 14.5 a5.5 5.5 0 0 1 3 5"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9 h18 M8 2.5 v4 M16 2.5 v4"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20 h4 L19 9 a2.1 2.1 0 0 0-3-3 L5 17 Z"/><path d="M14 6 l3 3"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 14.5 A8 8 0 1 1 9.5 4 a6.2 6.2 0 0 0 10.5 10.5Z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12l5 5L20 6"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15 V5 a2 2 0 0 1 2-2 h10"/></svg>',
  coin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6 v6 c0 1.7 3.6 3 8 3 s8-1.3 8-3 V6"/><path d="M4 12 v6 c0 1.7 3.6 3 8 3 s8-1.3 8-3 v-6"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5M21 7h-5"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11 V4 a1 1 0 0 1 1-1 h7 l9 9 a1.5 1.5 0 0 1 0 2 l-7 7 a1.5 1.5 0 0 1-2 0 Z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></svg>',
  fire:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 c2 3 5 5 5 9 a5 5 0 0 1-10 0 c0-1.6.7-2.8 1.5-3.8 C9 10 10 8.5 12 3Z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8Z"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9.5 4c-2.5 4.5-9.5 9-9.5 9Z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>',
  euro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 6a7 7 0 1 0 0 12M4 10h9M4 14h9"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>'
};

/* ---------- SUPABASE ---------- */
const SUPA_URL = "https://fklsetwqfdmangromprj.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHNldHdxZmRtYW5ncm9tcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjU1NTEsImV4cCI6MjA5NzA0MTU1MX0.RcOvY3R1SDegUJEz3eohOgVF-daDiz-OSnGPh1rCgQ4";
const supa = supabase.createClient(SUPA_URL, SUPA_KEY);
let _user = null;

/* ---------- STATE ---------- */
let DB = { accounts: [], house: [], activeId: "all", theme: "dark", seeded: false };

async function load() {
  try {
    const { data } = await supa.from("user_data").select("data").eq("user_id", _user.id).maybeSingle();
    if (data && data.data) DB = Object.assign(DB, data.data);
  } catch (e) {}
  if (!DB.house) DB.house = [];
  // Migrate: stage field + move house items from accounts to global pool
  if (DB.accounts) {
    DB.accounts.forEach(a => {
      a.items = (a.items || []).map(it => {
        if (!it.stage) it.stage = it.sold ? 'sold' : 'listed';
        return it;
      });
      const houseItems = a.items.filter(it => it.stage === 'house');
      houseItems.forEach(it => { if (!DB.house.find(h => h.id === it.id)) DB.house.push(it); });
      a.items = a.items.filter(it => it.stage !== 'house');
    });
  }
  if (!DB.seeded || !DB.accounts || !DB.accounts.length) {
    const seed = JSON.parse(JSON.stringify(SEED_ACCOUNTS));
    DB.house = [];
    seed.forEach(a => {
      a.items.filter(it => it.stage === 'house').forEach(it => DB.house.push({ id: rid(), ...it }));
      a.items = a.items.filter(it => it.stage !== 'house').map(it => ({ id: rid(), ...it }));
    });
    DB.accounts = seed;
    DB.seeded = true;
    DB.activeId = "all";
    await save();
  }
}
async function save() {
  if (!_user) return;
  try {
    await supa.from("user_data").upsert({ user_id: _user.id, data: DB, updated_at: new Date().toISOString() });
  } catch (e) {}
}
function rid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

/* ---------- AUTH ---------- */
function showLogin() {
  document.getElementById("loginOverlay").removeAttribute("hidden");
  setupLoginForm();
}

function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (form._wired) return;
  form._wired = true;
  const emailEl = document.getElementById("loginEmail");
  const passEl  = document.getElementById("loginPass");
  const errEl   = document.getElementById("loginErr");
  const submitBtn = document.getElementById("loginSubmit");
  const toggleBtn = document.getElementById("loginToggle");
  const titleEl = document.getElementById("loginTitle");
  let isSignup = false;

  toggleBtn.onclick = () => {
    isSignup = !isSignup;
    titleEl.textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
    submitBtn.textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
    toggleBtn.textContent = isSignup ? "¿Ya tienes cuenta? Iniciar sesión" : "¿Primera vez? Crear cuenta";
    errEl.textContent = ""; errEl.style.color = "";
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    errEl.textContent = ""; errEl.style.color = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Cargando…";
    let result;
    if (isSignup) {
      result = await supa.auth.signUp({ email: emailEl.value.trim(), password: passEl.value });
      if (!result.error && result.data.user && !result.data.session) {
        errEl.style.color = "var(--lime)";
        errEl.textContent = "Revisa tu email para confirmar la cuenta.";
        submitBtn.disabled = false;
        submitBtn.textContent = "Crear cuenta";
        return;
      }
    } else {
      result = await supa.auth.signInWithPassword({ email: emailEl.value.trim(), password: passEl.value });
    }
    if (result.error) {
      errEl.textContent = result.error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
      return;
    }
    location.reload();
  };
}

/* ---------- HELPERS ---------- */
const STALE = 21;
const daysSince = ts => Math.floor((Date.now() - ts) / 86400000);
function status(it) {
  if (it.stage === 'sold') return 'sold';
  if (it.stage === 'house') return 'house';
  return daysSince(it.added) >= STALE ? 'stale' : 'stock';
}
function fmt(n, d = 0) { return n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function eur(n, d = 0) { return fmt(n, d) + " €"; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function activeAccounts() { return DB.activeId === "all" ? DB.accounts : DB.accounts.filter(a => a.id === DB.activeId); }
function scopeItems() {
  const out = [];
  activeAccounts().forEach(a => a.items.forEach(it => out.push({ ...it, _acc: a })));
  return out;
}
function accColor(a) { return a.color; }
function initials(name) { return name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

/* ============================================================
   TOPBAR: ticker + account switcher
   ============================================================ */
function renderTicker() {
  const items = [...MARKET_BRANDS].sort((a, b) => b.trend - a.trend);
  const html = items.map(b => {
    const up = b.trend >= 0;
    return `<span class="tick"><b>${esc(b.name)}</b> <span class="${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(b.trend).toFixed(1)}%</span><span class="dot"></span></span>`;
  }).join("");
  $("#ticker").innerHTML = `<div class="ticker-track">${html}${html}</div>`;
}

function renderAcctSwitcher() {
  const cur = DB.activeId === "all"
    ? { name: "Todas las cuentas", handle: DB.accounts.length + " perfiles", color: "all" }
    : DB.accounts.find(a => a.id === DB.activeId);
  $("#acctBtn").innerHTML = `
    <div class="avatar av-${cur.color === "all" ? "all" : accColor(cur)}">${cur.color === "all" ? "∑" : initials(cur.name)}</div>
    <div class="meta"><b>${esc(cur.name)}</b><span>${esc(cur.handle)}</span></div>
    ${I.chev.replace("<svg", '<svg class="chev"')}`;

  const opt = (a) => {
    const live = a.items.filter(x => x.stage !== 'sold').reduce((s, x) => s + (x.qty || 1), 0);
    return `<div class="acct-opt ${DB.activeId === a.id ? "active" : ""}" data-acc="${a.id}">
      <div class="avatar av-${a.color}">${initials(a.name)}</div>
      <div class="meta"><b>${esc(a.name)}</b><span>${esc(a.handle)}</span></div>
      <span class="live">${live} act.</span>
      ${I.check.replace("<svg", '<svg class="check"')}</div>`;
  };
  $("#acctMenu").innerHTML = `
    <div class="acct-opt ${DB.activeId === "all" ? "active" : ""}" data-acc="all">
      <div class="avatar av-all">∑</div>
      <div class="meta"><b>Todas las cuentas</b><span>Vista combinada</span></div>
      <span class="live">${DB.accounts.length}</span>
      ${I.check.replace("<svg", '<svg class="check"')}</div>
    <div style="height:1px;background:var(--border-2);margin:5px 8px"></div>
    ${DB.accounts.map(opt).join("")}`;

  $$("#acctMenu .acct-opt").forEach(el => el.onclick = () => {
    switchAccount(el.dataset.acc);
    $("#acctMenu").classList.remove("open");
  });
}

function switchAccount(id) {
  DB.activeId = id;
  save();
  renderAcctSwitcher();
  renderAll();
  const cur = id === "all" ? "Todas las cuentas" : DB.accounts.find(a => a.id === id).name;
  toast(`Cambiado a ${cur}`);
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const items = [...scopeItems(), ...DB.house.map(it => ({ ...it, _acc: null }))];
  const inStock = items.filter(x => x.stage !== 'sold');
  const sold = items.filter(x => x.stage === 'sold');
  const totalUnitsInStock = inStock.reduce((s, x) => s + (x.qty || 1), 0);
  const totalUnitsSold = sold.reduce((s, x) => s + (x.qty || 1), 0);
  const invested = items.reduce((s, x) => s + x.cost * (x.qty || 1), 0);
  const stockValue = inStock.reduce((s, x) => s + x.price * (x.qty || 1), 0);
  const profit = sold.reduce((s, x) => s + (x.price - x.cost) * (x.qty || 1), 0);
  const revenue = sold.reduce((s, x) => s + x.price * (x.qty || 1), 0);
  const stale = inStock.filter(x => status(x) === 'stale').reduce((s, x) => s + (x.qty || 1), 0);
  const totalUnits = totalUnitsInStock + totalUnitsSold;
  const sellThrough = totalUnits ? Math.round((totalUnitsSold / totalUnits) * 100) : 0;

  // Dynamic heading
  const titleEl = document.getElementById("dashTitle");
  const subtitleEl = document.getElementById("dashSubtitle");
  if (titleEl) {
    titleEl.textContent = DB.activeId === "all"
      ? "Panel Global"
      : (DB.accounts.find(a => a.id === DB.activeId)?.name || "Panel de Control");
  }
  if (subtitleEl) {
    const listed = items.filter(x => x.stage === 'listed');
    const house = items.filter(x => x.stage === 'house');
    const listedUnits = listed.reduce((s, x) => s + (x.qty || 1), 0);
    const houseUnits = house.reduce((s, x) => s + (x.qty || 1), 0);
    const staleNote = stale > 0 ? ` · ${stale} parada${stale !== 1 ? "s" : ""}` : "";
    subtitleEl.textContent = `${listedUnits} en Vinted · ${houseUnits} en casa · ${totalUnitsSold} vendidas${staleNote}`;
  }

  const tiles = [
    { lbl: "En venta", val: totalUnitsInStock, ic: I.bag, cls: "neu", delta: `${stale} parados`, dcls: stale ? "down" : "up", seed: 3, color: "var(--teal)" },
    { lbl: "Vendidas", val: totalUnitsSold, ic: I.check, cls: "up", delta: `${sellThrough}% sell-through`, dcls: "up", seed: 7, color: "var(--lime)" },
    { lbl: "Beneficio neto", val: profit, suffix: " €", ic: I.coin, cls: profit >= 0 ? "up" : "down", delta: `de ${eur(revenue)} ventas`, dcls: "neu", seed: 11, color: "var(--lime)" },
    { lbl: "Valor en stock", val: stockValue, suffix: " €", ic: I.euro, cls: "neu", delta: `${eur(invested)} invertido`, dcls: "neu", seed: 5, color: "var(--violet)" }
  ];
  $("#dashStats").innerHTML = tiles.map(t => `
    <div class="stat">
      <div class="top"><span class="lbl">${t.lbl}</span><span class="ic">${t.ic}</span></div>
      <div class="num ${t.cls}" data-cnt="${t.val}" data-suffix="${t.suffix || ""}">0</div>
      <div class="delta ${t.dcls}">${t.delta}</div>
      ${sparkline(seriesFromSeed(t.seed, 14, 40, 22), { color: t.color })}
    </div>`).join("");
  $$("#dashStats .num").forEach(el => countUp(el, +el.dataset.cnt, { suffix: el.dataset.suffix }));

  // health gauge
  const health = Math.min(100, Math.round(sellThrough * 0.5 + (100 - Math.min(100, stale * 12)) * 0.3 + Math.min(100, totalUnitsSold * 6) * 0.2));
  $("#healthGauge").innerHTML = `
    <div class="gauge">
      ${gaugeRing(health, { color: "var(--primary)" })}
      <div><div class="gv">${health}<span style="font-size:14px;color:var(--faint)">/100</span></div>
      <div class="gl">Salud de ventas</div></div>
    </div>`;
  animateGauges($("#healthGauge"));

  // recommendations
  const recos = [];
  if (stale > 0) {
    const names = inStock.filter(x => status(x) === "stale").map(x => x.name).slice(0, 2).join(", ");
    recos.push({ c: "amber", ic: I.clock, t: `<b>${stale} prenda(s)</b> llevan +${STALE} días sin vender (${esc(names)}). Republica bajando precio y renueva las fotos.` });
  }
  if (totalUnitsSold >= 3) {
    const byCat = {}; sold.forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + (x.qty || 1));
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    recos.push({ c: "lime", ic: I.trend, t: `Tu categoría estrella es <b>${esc(top[0])}</b> (${top[1]} ventas). Compra más de ahí: es tu dinero fácil.` });
  }
  const hotInStock = inStock.filter(x => MARKET_BRANDS.find(b => b.name.toLowerCase() === (x.brand || "").toLowerCase() && (b.heat === "hot" || b.heat === "rising")));
  if (hotInStock.length) {
    const hotUnits = hotInStock.reduce((s, x) => s + (x.qty || 1), 0);
    recos.push({ c: "teal", ic: I.fire, t: `Tienes <b>${hotUnits} prenda(s)</b> de marcas que vuelan ahora (${esc(hotInStock.slice(0,2).map(x=>x.brand).join(", "))}). Súbelas en hora punta esta semana.` });
  }
  recos.push({ c: "violet", ic: I.clock, t: `El <b>domingo 20–22h</b> es el mejor momento global para publicar. Mira el <b>Calendario</b> para programar tus drops.` });
  recos.push({ c: "teal", ic: I.radar, t: `Antes de tu próxima compra, revisa el <b>Radar de Mercado</b>: Salomon (+18%) y New Balance (+14%) están explotando.` });

  $("#dashRecos").innerHTML = recos.map(r => `
    <div class="reco"><div class="ric reco-${r.c}">${r[ "ic"]}</div><div class="rtxt">${r.t}</div></div>`).join("");

  // mini account overview
  $("#dashAccts").innerHTML = DB.accounts.map(a => {
    const insItems = a.items.filter(x => x.stage !== 'sold');
    const sldItems = a.items.filter(x => x.stage === 'sold');
    const ins = insItems.reduce((s, x) => s + (x.qty || 1), 0);
    const sld = sldItems.reduce((s, x) => s + (x.qty || 1), 0);
    const prof = sldItems.reduce((s, x) => s + (x.price - x.cost) * (x.qty || 1), 0);
    return `<div class="rank-item" style="cursor:pointer" data-acc="${a.id}">
      <div class="avatar av-${a.color}">${initials(a.name)}</div>
      <div class="info"><b>${esc(a.name)}</b><span>${ins} en venta · ${sld} vendidas</span></div>
      <div class="tr up">+${eur(prof)}</div></div>`;
  }).join("");
  $$("#dashAccts [data-acc]").forEach(el => el.onclick = () => { switchAccount(el.dataset.acc); navigate("accounts"); });
}

/* ============================================================
   RADAR VIEW
   ============================================================ */
let radarStarted = false;
let radarTries = 0;
let radarLiveLoaded = false;

async function loadRadarData() {
  if (radarLiveLoaded) return;
  const statusEl = document.getElementById("radarDataStatus");
  if (statusEl) statusEl.innerHTML = '<span class="pulse-dot"></span>Actualizando datos desde Vinted...';
  try {
    const res = await fetch("/api/radar");
    if (res.status === 401) {
      const d = await res.json().catch(() => ({}));
      if (statusEl) statusEl.innerHTML = '<span class="pulse-dot" style="background:var(--amber)"></span>Token Vinted caducado · actualiza VINTED_TOKEN en Vercel';
      toast("Token Vinted caducado — datos estáticos activos");
      return;
    }
    if (!res.ok) {
      if (statusEl) statusEl.innerHTML = '<span class="pulse-dot" style="background:var(--faint)"></span>Datos de mercado · jun 2026';
      return;
    }
    const data = await res.json();
    if (data.error) {
      if (statusEl) statusEl.innerHTML = '<span class="pulse-dot" style="background:var(--faint)"></span>Datos de mercado · jun 2026';
      return;
    }
    // Merge live demand into MARKET_BRANDS (keep static heat/trend/note)
    data.brands.forEach(live => {
      const b = MARKET_BRANDS.find(m => m.name === live.name);
      if (b) {
        b.demand = live.demand;
        b.heat = live.heat;
      }
    });
    radarLiveLoaded = true;
    renderRadarSide();
    renderTicker();
    if (radarStarted) Radar.update(MARKET_BRANDS);
    const ts = new Date(data.updatedAt);
    const mins = Math.round((Date.now() - ts.getTime()) / 60000);
    const minsLabel = mins < 2 ? "ahora mismo" : `hace ${mins} min`;
    if (statusEl) statusEl.innerHTML = `<span class="pulse-dot"></span>Datos en tiempo real · Vinted API · ${minsLabel}`;
  } catch (_) {
    if (statusEl) statusEl.innerHTML = '<span class="pulse-dot" style="background:var(--faint)"></span>Datos de mercado · jun 2026';
  }
}

function startRadar() {
  if (radarStarted) return;
  const c = $("#radarCanvas");
  if (!c) return;
  if (c.parentElement.clientWidth === 0 || c.parentElement.clientHeight === 0) {
    if (radarTries++ < 30) setTimeout(startRadar, 90);
    return;
  }
  Radar.init(c, MARKET_BRANDS);
  radarStarted = true;
  const skeleton = document.getElementById("radarSkeleton");
  if (skeleton) skeleton.style.display = "none";
  loadRadarData();
}
function renderRadarSide() {
  const ranked = [...MARKET_BRANDS].sort((a, b) => b.demand - a.demand).slice(0, 12);
  $("#radarRank").innerHTML = ranked.map((b, i) => {
    const up = b.trend >= 0;
    const hcls = { hot: "h-hot", rising: "h-rising", warm: "h-warm", cool: "h-cool" }[b.heat];
    const htxt = { hot: "VUELA", rising: "SUBE", warm: "ALTA", cool: "FRÍA" }[b.heat];
    return `<div class="rank-item ${i < 3 ? "top3" : ""}">
      <div class="rk">${i + 1}</div>
      <div class="info"><b>${esc(b.name)}</b><span>${esc(b.note)}</span></div>
      <span class="heat-tag ${hcls}">${htxt}</span>
      <div class="tr ${up ? "up" : "down"}" style="width:54px">${up ? "+" : ""}${b.trend.toFixed(1)}%</div>
    </div>`;
  }).join("");

  // categories
  $("#radarCats").innerHTML = MARKET_CATS.map(c => `
    <div class="bar-row">
      <div class="bl">${esc(c.name)}</div>
      <div class="bar-track"><div class="bar-fill" data-w="${c.pct}"></div></div>
      <div class="bt ${c.trend >= 0 ? "up" : "down"}">${c.trend >= 0 ? "+" : ""}${c.trend.toFixed(1)}%</div>
    </div>`).join("");
  animateBars($("#radarCats"));
}

/* ============================================================
   INVENTORY — KANBAN PIPELINE
   ============================================================ */
function renderInventory() {
  const single = DB.activeId !== "all";
  const targetName = single ? DB.accounts.find(a => a.id === DB.activeId)?.name : null;

  // Account selector: only needed when listing (not house) from all-accounts view
  const accWrap = document.getElementById("f-acc-wrap");
  const accSelect = document.getElementById("f-acc");
  if (accSelect) accSelect.innerHTML = DB.accounts.map(a => `<option value="${esc(a.id)}">${esc(a.name)}</option>`).join("");
  const curStageBtn = document.querySelector("#stageToggle .stage-opt.on");
  const curStage = curStageBtn ? curStageBtn.dataset.stage : 'house';
  if (accWrap) accWrap.style.display = (!single && curStage === 'listed') ? "" : "none";

  $("#invFormNote").textContent = single
    ? `En Vinted: cuenta "${targetName}". En casa: pool global.`
    : "En casa: pool global. En Vinted: elige cuenta.";
  $("#invAddBtn").disabled = false;
  $("#invAddBtn").style.opacity = "1";

  const accountItems = scopeItems().sort((a, b) => b.added - a.added);
  const houseItems = [...DB.house].sort((a, b) => b.added - a.added).map(it => ({ ...it, _acc: null }));

  // Auto-collapse the add form when items already exist
  const formEl = $("#itemForm");
  const formToggle = $("#formToggle");
  const formIcon = document.getElementById("formToggleIcon");
  const hasItems = accountItems.length > 0 || houseItems.length > 0;
  const shouldCollapse = hasItems;
  if (formEl) formEl.style.display = shouldCollapse ? "none" : "";
  if (formToggle) formToggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
  if (formIcon) formIcon.setAttribute("d", shouldCollapse ? "M6 9l6 6 6-6" : "M18 15l-6-6-6 6");

  const kanban = $("#kanban");
  const empty = $("#stockEmpty");
  if (!accountItems.length && !houseItems.length) { empty.style.display = "block"; kanban.style.display = "none"; return; }
  empty.style.display = "none"; kanban.style.display = "";

  const COLS = [
    { stage: 'house',  label: 'En casa',   dotCls: 'kb-dot-house',  emptyMsg: 'Sin prendas en casa.<br>Aquí van las que aún no has listado.' },
    { stage: 'listed', label: 'En Vinted', dotCls: 'kb-dot-listed', emptyMsg: 'Nada listado ahora.<br>Mueve prendas desde "En casa".' },
    { stage: 'sold',   label: 'Vendido',   dotCls: 'kb-dot-sold',   emptyMsg: '¡Sin ventas aún!<br>Mueve prendas listadas cuando se vendan.' }
  ];

  const grouped = {
    house: houseItems,
    listed: accountItems.filter(it => it.stage === 'listed'),
    sold: accountItems.filter(it => it.stage === 'sold')
  };

  function cardActions(it) {
    const qty = it.qty || 1;
    if (it.stage === 'house') {
      const del = `<button class="kb-btn icon-only danger" aria-label="Eliminar" data-del-house="${it.id}">${I.trash}</button>`;
      if (DB.activeId !== 'all') {
        return `<button class="kb-btn primary" data-list="${it.id}" data-to-acc="${DB.activeId}">${I.bolt} Listar en Vinted</button>${del}`;
      }
      const accOpts = DB.accounts.map(a => `<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('');
      return `<select class="kb-acc-sel" data-sel-for="${it.id}">${accOpts}</select><button class="kb-btn primary" data-list="${it.id}">${I.bolt} Listar</button>${del}`;
    }
    const del = `<button class="kb-btn icon-only danger" aria-label="Eliminar" data-del="${it.id}" data-acc="${it._acc.id}">${I.trash}</button>`;
    if (it.stage === 'listed') {
      const backBtn = `<button class="kb-btn" data-return-house="${it.id}" data-acc="${it._acc.id}">${I.box} A casa</button>`;
      if (qty > 1) {
        return `${backBtn}<button class="kb-btn" data-sell1="${it.id}" data-acc="${it._acc.id}">${I.coin} Vender 1</button><button class="kb-btn primary" data-move="${it.id}" data-acc="${it._acc.id}" data-to="sold">${I.coin} Vender todo</button>${del}`;
      }
      return `${backBtn}<button class="kb-btn primary" data-move="${it.id}" data-acc="${it._acc.id}" data-to="sold">${I.coin} Vendida</button>${del}`;
    }
    return del;
  }

  function renderCard(it) {
    const qty = it.qty || 1;
    const margin = it.price - it.cost;
    const totalMargin = margin * qty;
    const staleTag = it.stage === 'listed' && daysSince(it.added) >= STALE
      ? `<span class="kb-stale">${daysSince(it.added)}d parada</span>` : '';
    const soldInfo = it.stage === 'sold' && it.soldDate
      ? `<span class="kb-sold-date">· hace ${daysSince(it.soldDate)}d</span>` : '';
    const accBadge = DB.activeId === 'all'
      ? `<div class="avatar av-${it._acc.color}" style="width:16px;height:16px;border-radius:4px;font-size:8px;flex-shrink:0">${initials(it._acc.name)}</div>` : '';
    const qtyBadge = qty > 1 ? `<span class="kb-qty-badge">×${qty}</span>` : '';
    const qtyTotal = qty > 1 ? `<span class="kb-qty-total">(${totalMargin >= 0 ? '+' : ''}${eur(totalMargin, 2)} total)</span>` : '';
    return `<div class="kb-card">
      <div class="kb-card-top">
        <div class="kb-thumb">${I.bag}</div>
        <div class="kb-info">
          <div class="kb-name" title="${esc(it.name)}">${esc(it.name)}${qtyBadge}</div>
          <div class="kb-meta">${accBadge}<span>${esc(it.brand)}</span><span>·</span><span>${esc(it.cat)}</span>${soldInfo}</div>
        </div>
      </div>
      ${staleTag}
      <div class="kb-nums">
        <span class="kb-cost">${eur(it.cost, 2)}</span>
        <span class="kb-arrow">→</span>
        <span class="kb-price">${eur(it.price, 2)}</span>
        <span class="kb-margin ${margin >= 0 ? 'up' : 'down'}"><b>${margin >= 0 ? '+' : ''}${eur(margin, 2)}</b></span>
        ${qtyTotal}
      </div>
      <div class="kb-actions">${cardActions(it)}</div>
    </div>`;
  }

  kanban.innerHTML = COLS.map(col => {
    const its = grouped[col.stage];
    const unitCount = its.reduce((s, it) => s + (it.qty || 1), 0);
    const val = its.reduce((s, it) => s + it.price * (it.qty || 1), 0);
    return `<div class="kb-col">
      <div class="kb-head">
        <span class="kb-dot ${col.dotCls}"></span>
        <span class="kb-label-text">${col.label}</span>
        <span class="kb-count">${unitCount}</span>
        ${val > 0 ? `<span class="kb-val">${eur(val, 0)}</span>` : ''}
      </div>
      <div class="kb-items">
        ${its.length ? its.map(renderCard).join('') : `<div class="kb-empty">${col.emptyMsg}</div>`}
      </div>
    </div>`;
  }).join('');

  $$("#kanban [data-move]").forEach(b => b.onclick = () => moveStage(b.dataset.acc, b.dataset.move, b.dataset.to));
  $$("#kanban [data-sell1]").forEach(b => b.onclick = () => sellOne(b.dataset.acc, b.dataset.sell1));
  $$("#kanban [data-del]").forEach(b => b.onclick = () => delItem(b.dataset.acc, b.dataset.del));
  $$("#kanban [data-del-house]").forEach(b => b.onclick = () => delHouseItem(b.dataset.delHouse));
  $$("#kanban [data-return-house]").forEach(b => b.onclick = () => returnToHouse(b.dataset.acc, b.dataset.returnHouse));
  $$("#kanban [data-list]").forEach(b => b.onclick = () => {
    const itemId = b.dataset.list;
    const accId = b.dataset.toAcc || document.querySelector(`[data-sel-for="${itemId}"]`)?.value || DB.accounts[0]?.id;
    if (accId) listItem(itemId, accId);
  });
}

function addItem(e) {
  e.preventDefault();
  const stageBtn = document.querySelector("#stageToggle .stage-opt.on");
  const stage = stageBtn ? stageBtn.dataset.stage : 'house';
  const item = {
    id: rid(),
    name: $("#f-name").value.trim(),
    brand: $("#f-brand").value.trim() || "—",
    cat: $("#f-cat").value,
    cost: parseFloat($("#f-cost").value) || 0,
    price: parseFloat($("#f-price").value) || 0,
    qty: Math.max(1, parseInt($("#f-qty").value) || 1),
    added: Date.now(), stage, sold: false, soldDate: null
  };
  if (stage === 'house') {
    DB.house.unshift(item);
    save(); e.target.reset(); document.getElementById("f-qty").value = "1"; renderAll();
    toast("Prenda añadida a En casa");
  } else {
    const targetId = DB.activeId !== "all" ? DB.activeId : document.getElementById("f-acc")?.value;
    const acc = DB.accounts.find(a => a.id === targetId);
    if (!acc) { toast("Elige una cuenta para listar"); return; }
    acc.items.unshift(item);
    save(); e.target.reset(); document.getElementById("f-qty").value = "1"; renderAll();
    toast(`Prenda añadida a Vinted (${esc(acc.name)})`);
  }
}
function listItem(itemId, accId) {
  const it = DB.house.find(x => x.id === itemId);
  const acc = DB.accounts.find(a => a.id === accId);
  if (!it || !acc) return;
  DB.house = DB.house.filter(x => x.id !== itemId);
  acc.items.unshift({ ...it, stage: 'listed', sold: false, soldDate: null });
  save(); renderAll();
  toast(`Listada en ${esc(acc.name)}`);
}

function returnToHouse(accId, itemId) {
  const acc = DB.accounts.find(a => a.id === accId);
  const it = acc && acc.items.find(x => x.id === itemId);
  if (!it) return;
  const snap = { ...it };
  acc.items = acc.items.filter(x => x.id !== itemId);
  DB.house.unshift({ ...it, stage: 'house', sold: false, soldDate: null });
  save(); renderAll();
  toastWithUndo('Movida a En casa', () => {
    const a = DB.accounts.find(a => a.id === accId);
    if (a) { DB.house = DB.house.filter(x => x.id !== itemId); a.items.unshift(snap); save(); renderAll(); }
  });
}

function delHouseItem(id) {
  const snap = DB.house.find(x => x.id === id);
  if (!snap) return;
  const copy = { ...snap };
  DB.house = DB.house.filter(x => x.id !== id);
  save(); renderAll();
  toastWithUndo('Prenda eliminada', () => { DB.house.push(copy); save(); renderAll(); });
}

function sellOne(accId, itemId) {
  const acc = DB.accounts.find(a => a.id === accId);
  const it = acc && acc.items.find(x => x.id === itemId);
  if (!it) return;
  const qty = it.qty || 1;
  if (qty <= 1) { moveStage(accId, itemId, 'sold'); return; }
  it.qty = qty - 1;
  acc.items.push({
    id: rid(), name: it.name, brand: it.brand, cat: it.cat,
    cost: it.cost, price: it.price, qty: 1,
    added: it.added, stage: 'sold', sold: true, soldDate: Date.now()
  });
  save(); renderAll();
  toast(`1 unidad vendida · quedan ${it.qty}`);
}

function moveStage(accId, itemId, newStage) {
  const acc = DB.accounts.find(a => a.id === accId);
  const it = acc && acc.items.find(x => x.id === itemId);
  if (!it) return;
  const prevStage = it.stage;
  const prevSoldDate = it.soldDate;
  it.stage = newStage;
  it.sold = newStage === 'sold';
  it.soldDate = newStage === 'sold' ? Date.now() : null;
  save(); renderAll();
  const labels = { house: 'Movida a En casa', listed: 'Listada en Vinted', sold: 'Marcada como vendida' };
  toastWithUndo(labels[newStage], () => {
    const a = DB.accounts.find(a => a.id === accId);
    const item = a && a.items.find(x => x.id === itemId);
    if (item) { item.stage = prevStage; item.sold = prevStage === 'sold'; item.soldDate = prevSoldDate; save(); renderAll(); }
  });
}
function delItem(accId, id) {
  const acc = DB.accounts.find(a => a.id === accId);
  if (!acc) return;
  const snapshot = acc.items.find(x => x.id === id);
  if (!snapshot) return;
  const copy = { ...snapshot };
  acc.items = acc.items.filter(x => x.id !== id);
  save(); renderAll();
  toastWithUndo('Prenda eliminada', () => {
    const a = DB.accounts.find(a => a.id === accId);
    if (a) { a.items.push(copy); save(); renderAll(); }
  });
}

/* ============================================================
   ACCOUNTS (multicuenta)
   ============================================================ */
function renderAccounts() {
  // aggregate header
  const all = [];
  DB.accounts.forEach(a => a.items.forEach(it => all.push(it)));
  const totProfit = all.filter(x => x.stage === 'sold').reduce((s, x) => s + (x.price - x.cost) * (x.qty || 1), 0);
  const houseUnits = DB.house.reduce((s, x) => s + (x.qty || 1), 0);
  const totStock = all.filter(x => x.stage !== 'sold').reduce((s, x) => s + (x.qty || 1), 0) + houseUnits;
  const totSold = all.filter(x => x.stage === 'sold').reduce((s, x) => s + (x.qty || 1), 0);
  $("#acctAgg").innerHTML = `
    <div class="stat"><div class="top"><span class="lbl">Perfiles</span><span class="ic">${I.users}</span></div><div class="num neu">${DB.accounts.length}</div><div class="delta neu">cuentas conectadas</div></div>
    <div class="stat"><div class="top"><span class="lbl">Stock total</span><span class="ic">${I.bag}</span></div><div class="num">${totStock}</div><div class="delta neu">prendas en venta</div></div>
    <div class="stat"><div class="top"><span class="lbl">Ventas totales</span><span class="ic">${I.check}</span></div><div class="num up">${totSold}</div><div class="delta up">en todas las cuentas</div></div>
    <div class="stat"><div class="top"><span class="lbl">Beneficio global</span><span class="ic">${I.coin}</span></div><div class="num up">${eur(totProfit)}</div><div class="delta up">combinado</div></div>`;

  $("#acctCards").innerHTML = DB.accounts.map(a => {
    const insItems = a.items.filter(x => x.stage !== 'sold');
    const sldItems = a.items.filter(x => x.stage === 'sold');
    const ins = insItems.reduce((s, x) => s + (x.qty || 1), 0);
    const sld = sldItems.reduce((s, x) => s + (x.qty || 1), 0);
    const prof = sldItems.reduce((s, x) => s + (x.price - x.cost) * (x.qty || 1), 0);
    const stale = insItems.filter(x => status(x) === "stale").length;
    return `<div class="acct-card ${DB.activeId === a.id ? "active" : ""}" data-acc="${a.id}">
      <div class="ah">
        <div class="avatar av-${a.color}">${initials(a.name)}</div>
        <div class="meta"><b>${esc(a.name)}</b><span>${esc(a.handle)}</span></div>
        <span class="live-badge"><span class="pulse-dot"></span>LIVE</span>
      </div>
      <div class="acct-mini">
        <div class="m"><b>${ins}</b><span>En venta</span></div>
        <div class="m"><b class="up">${sld}</b><span>Vendidas</span></div>
        <div class="m"><b class="up">${eur(prof)}</b><span>Beneficio</span></div>
      </div>
      <div class="acct-foot">
        <span class="it">${I.star}${a.rating} <span style="color:var(--faint)">(${a.reviews})</span></span>
        <span class="it">${I.heart}${fmt(a.followers)}</span>
        ${stale ? `<span class="it" style="color:var(--amber)">${I.clock}${stale} parados</span>` : ""}
        <span class="switch-hint">${DB.activeId === a.id ? "Activa ✓" : "Cambiar →"}</span>
      </div></div>`;
  }).join("");
  $$("#acctCards .acct-card").forEach(el => el.onclick = () => switchAccount(el.dataset.acc));
}

/* ============================================================
   CALENDAR (heatmap)
   ============================================================ */
function heatColorFor(v) {
  // 0..100 -> teal scale
  const t = v / 100;
  return `color-mix(in oklab, var(--primary) ${Math.round(8 + t * 84)}%, var(--surface-2))`;
}
function renderCalendar() {
  let html = `<div class="heat-axis"></div>`;
  HEAT_HOURS.forEach(h => html += `<div class="heat-axis h">${String(h).padStart(2,"0")}h</div>`);
  HEAT_DAYS.forEach((d, di) => {
    html += `<div class="heat-axis">${d}</div>`;
    HEAT_MATRIX[di].forEach((v, hi) => {
      html += `<div class="heat-cell" style="background:${heatColorFor(v)}" title="${d} ${HEAT_HOURS[hi]}:00 · demanda ${v}/100"></div>`;
    });
  });
  $("#heatGrid").innerHTML = html;

  $("#slotList").innerHTML = BEST_SLOTS.map(s => `
    <div class="slot">
      <span class="st st-${s.tag}">${s.tag}</span>
      <div class="meta"><b>${esc(s.d)}</b><span>${esc(s.note)}</span></div>
      <span class="time">${esc(s.h)}</span>
    </div>`).join("");

  const nowMonth = new Date().getMonth();
  const seasonIdx = Math.floor(nowMonth / 2);
  $("#seasonGrid").innerHTML = SEASONS.map((s, i) => `
    <div class="season ${i === seasonIdx ? "now" : ""}">
      ${i === seasonIdx ? '<span class="badge-now">AHORA</span>' : ""}
      <b>${s.m}</b><p>${esc(s.t)}</p></div>`).join("");
}

/* ============================================================
   OPTIMIZER
   ============================================================ */
function renderOptimizerStatic() {
  $("#priceTips").innerHTML = PRICE_TIPS.map(t => `
    <div class="reco"><div class="ric reco-teal">${I.euro}</div><div class="rtxt">${t}</div></div>`).join("");
}
function genAd(e) {
  e.preventDefault();
  const v = id => $("#" + id).value.trim();
  const brand = v("o-brand"), type = v("o-type"), color = v("o-color"), size = v("o-size"),
    cond = $("#o-cond").value, style = v("o-style");
  const title = [brand, type, color, style, size ? "talla " + size : ""].filter(Boolean).join(" ");
  const kw = [brand, type, color, style].filter(Boolean);
  const extra = ["segunda mano", "buen estado"];
  if (/nike|adidas|new balance|vans|converse|jordan|salomon/i.test(brand)) extra.push("original", "auténtico");
  if (/y2k|vintage/i.test(style)) extra.push("retro", "años 2000");
  const condNote = /satisfactorio/i.test(cond) ? " Consulta las fotos para ver el estado en detalle." : "";
  const desc = `${[brand, type].filter(Boolean).join(" ")}${color ? " en color " + color : ""}${size ? ", talla " + size : ""}. Estado: ${cond.toLowerCase()}.${condNote} `
    + `${style ? "Perfecto para " + style + ". " : ""}`
    + `Fotos 100% reales. Envío rápido y bien embalado 📦. Acepto ofertas razonables. ¡Mira mi armario y combina prendas para ahorrar en envío!`;
  const r = $("#optResult");
  r.classList.add("show");
  r.innerHTML = `
    <div class="opt-row"><div class="ql">Título optimizado <span class="copy-mini" data-cp="cp-title">${I.copy}Copiar</span></div><div class="qv" id="cp-title">${esc(title)}</div></div>
    <div class="opt-row"><div class="ql">Descripción <span class="copy-mini" data-cp="cp-desc">${I.copy}Copiar</span></div><div class="qv" id="cp-desc">${esc(desc)}</div></div>
    <div class="opt-row"><div class="ql">Palabras clave a incluir</div><div class="chips">${[...kw, ...extra].filter(Boolean).map(k => `<span class="tag">${esc(k)}</span>`).join("")}</div></div>
    <p class="note">💡 Sube 4–6 fotos con fondo neutro y desde varios ángulos. Los anuncios con buenas fotos se venden mucho antes.</p>`;
  $$("#optResult [data-cp]").forEach(b => b.onclick = () => {
    const txt = $("#" + b.dataset.cp).innerText;
    navigator.clipboard && navigator.clipboard.writeText(txt);
    b.innerHTML = I.check + "Copiado"; setTimeout(() => b.innerHTML = I.copy + "Copiar", 1400);
  });
}

/* ============================================================
   BARS / TOAST / THEME / NAV
   ============================================================ */
function animateBars(root) {
  root.querySelectorAll(".bar-fill[data-w]").forEach(el => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `scaleX(${parseInt(el.dataset.w) / 100})`;
    }));
  });
}

let toastT, _toastUndoFn = null;
function toast(msg) {
  _toastUndoFn = null;
  const t = $("#toast");
  t.innerHTML = `${I.check} ${esc(msg)}`;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2200);
}
function toastWithUndo(msg, undoFn) {
  _toastUndoFn = undoFn;
  const t = $("#toast");
  t.innerHTML = `${I.check} ${esc(msg)} <button class="toast-undo" id="toastUndo">Deshacer</button>`;
  t.classList.add("show");
  clearTimeout(toastT);
  const undoBtn = t.querySelector("#toastUndo");
  if (undoBtn) {
    undoBtn.onclick = (e) => {
      e.stopPropagation();
      if (_toastUndoFn) { _toastUndoFn(); _toastUndoFn = null; }
      t.classList.remove("show");
      clearTimeout(toastT);
    };
  }
  toastT = setTimeout(() => { t.classList.remove("show"); _toastUndoFn = null; }, 4000);
}
function setTheme(mode) {
  DB.theme = mode; save();
  document.documentElement.classList.toggle("theme-light", mode === "light");
  document.documentElement.classList.toggle("theme-dark", mode === "dark");
  $("#thDark").classList.toggle("on", mode === "dark");
  $("#thLight").classList.toggle("on", mode === "light");
  if (radarStarted) setTimeout(() => Radar.refreshColors(), 60);
}

function navigate(view) {
  $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  $$(".view").forEach(v => v.classList.toggle("active", v.id === view));
  $(".scroll").scrollTop = 0;
  if (view === "radar") { setTimeout(startRadar, 60); }
}

function renderBrandList() {
  const set = new Set([...MARKET_BRANDS.map(b => b.name), ...DB.accounts.flatMap(a => a.items.map(i => i.brand).filter(b => b && b !== "—")), ...DB.house.map(i => i.brand).filter(b => b && b !== "—")]);
  $("#brands").innerHTML = [...set].map(b => `<option value="${esc(b)}">`).join("") + "<option value=\"Otros\">";
}

function renderAll() {
  renderDashboard();
  renderRadarSide();
  renderInventory();
  renderAccounts();
  renderBrandList();
}

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  const { data: { session } } = await supa.auth.getSession();
  if (!session) { showLogin(); return; }
  _user = session.user;
  await load();
  setTheme(DB.theme || "dark");

  // nav
  $$(".nav-item").forEach(n => n.onclick = () => navigate(n.dataset.view));

  // theme toggle
  $("#thDark").onclick = () => setTheme("dark");
  $("#thLight").onclick = () => setTheme("light");

  // account switcher open/close
  $("#acctBtn").onclick = () => {
    const isOpen = $("#acctMenu").classList.toggle("open");
    $("#acctBtn").setAttribute("aria-expanded", isOpen ? "true" : "false");
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".acct-switch")) {
      $("#acctMenu").classList.remove("open");
      $("#acctBtn").setAttribute("aria-expanded", "false");
    }
  });

  // forms
  $("#itemForm").onsubmit = addItem;
  $("#optForm").onsubmit = genAd;

  // form collapse toggle (add form header click)
  const addFormHead = document.getElementById("addFormHead");
  if (addFormHead) {
    addFormHead.addEventListener("click", () => {
      const formEl = document.getElementById("itemForm");
      const toggle = document.getElementById("formToggle");
      const icon = document.getElementById("formToggleIcon");
      const isHidden = formEl && formEl.style.display === "none";
      if (formEl) formEl.style.display = isHidden ? "" : "none";
      if (toggle) toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
      if (icon) icon.setAttribute("d", isHidden ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6");
    });
  }

  // stage toggle (En casa / Ya en Vinted)
  const stageToggle = document.getElementById("stageToggle");
  if (stageToggle) {
    stageToggle.addEventListener("click", e => {
      const btn = e.target.closest(".stage-opt");
      if (!btn) return;
      stageToggle.querySelectorAll(".stage-opt").forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      const accWrap = document.getElementById("f-acc-wrap");
      if (accWrap) accWrap.style.display = (btn.dataset.stage === 'listed' && DB.activeId === 'all') ? "" : "none";
    });
  }

  // "Otros" in brand datalist → clear field so user can type freely
  ["f-brand", "o-brand"].forEach(id => {
    const el = $("#" + id);
    if (!el) return;
    el.addEventListener("change", () => {
      if (el.value === "Otros") {
        el.value = "";
        el.placeholder = "Escribe la marca...";
        el.focus();
      }
    });
  });
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.onclick = async () => {
      if (confirm("¿Restaurar los datos de demostración? Se borrará tu inventario actual.")) {
        await supa.from("user_data").delete().eq("user_id", _user.id);
        DB = { accounts: [], activeId: "all", theme: DB.theme, seeded: false };
        await load(); renderAcctSwitcher(); renderAll(); toast("Datos restaurados");
      }
    };
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = async () => {
    await supa.auth.signOut();
    location.reload();
  };

  // Keyboard shortcuts: 1–6 to switch views
  const VIEWS = ["dashboard", "radar", "stock", "accounts", "calendar", "optimizer"];
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, select, textarea")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const idx = parseInt(e.key, 10) - 1;
    if (idx >= 0 && idx < VIEWS.length) navigate(VIEWS[idx]);
  });

  // Search wiring
  let _searchQ = "";
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      _searchQ = e.target.value.trim().toLowerCase();
      if (_searchQ && !$("#stock").classList.contains("active")) navigate("stock");
      _applySearch();
    });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { searchInput.value = ""; _searchQ = ""; _applySearch(); }
    });
  }
  function _applySearch() {
    $$(".kb-card").forEach(card => {
      card.style.display = (!_searchQ || card.textContent.toLowerCase().includes(_searchQ)) ? "" : "none";
    });
  }

  renderTicker();
  renderAcctSwitcher();
  renderOptimizerStatic();
  renderCalendar();
  renderAll();
}
document.addEventListener("DOMContentLoaded", init);
