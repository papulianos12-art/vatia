/* Vatia alfa · lógica de la página
   Secciones: iconos, tema, rutas, inicio, Mi casa (simulación en vivo), Panel CEO, Seguridad. */
(function () {
  'use strict';
  const V = window.VATIA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clp = n => '$' + Math.round(n).toLocaleString('es-CL');
  const fmt = (n, d = 0) => n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('vatia.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('vatia.' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento: la demo sigue igual */ } }
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Iconos (trazo 1,8, 24px) ---------------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/><circle cx="12" cy="18" r="1.2"/>',
    plug: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
    plugoff: '<path d="M3 3l18 18"/><path d="M9 3v4M15 3v5"/><path d="M6 8h3M14 8h4v3a6 6 0 0 1-1.6 4.1M8.6 15.6A6 6 0 0 1 6 11"/><path d="M12 17v4"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    wifioff: '<path d="M3 3l18 18"/><path d="M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14 10.3A10 10 0 0 1 19 13M2 9.5a14 14 0 0 1 4-2.4M10.5 6.1A14 14 0 0 1 22 9.5"/><circle cx="12" cy="20" r=".8"/>',
    sort: '<path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  const icon = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  function paintIcons(root) {
    $$('svg[data-icon]', root).forEach(s => { s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = ICONS[s.dataset.icon] || ''; s.removeAttribute('data-icon'); });
  }
  paintIcons(document);

  /* ---------------- Tema ---------------- */
  const root = document.documentElement;
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  const effectiveDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : sysDark.matches;
  const savedTheme = store.get('theme', null);
  if (savedTheme) root.dataset.theme = savedTheme;
  function paintThemeBtn() {
    const b = $('#themeBtn');
    b.innerHTML = icon(effectiveDark() ? 'sun' : 'moon');
    b.setAttribute('aria-label', effectiveDark() ? 'Usar tema claro' : 'Usar tema oscuro');
  }
  paintThemeBtn();
  $('#themeBtn').addEventListener('click', () => {
    const next = effectiveDark() ? 'light' : 'dark';
    root.dataset.theme = next; store.set('theme', next); paintThemeBtn(); redrawCharts();
  });
  sysDark.addEventListener && sysDark.addEventListener('change', () => { paintThemeBtn(); redrawCharts(); });

  /* ---------------- Toasts ---------------- */
  function toast(title, body, ic = '!', col = 'var(--accent)') {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast'; el.dataset.state = 'enter';
    el.innerHTML = `<div class="tic" style="background:${col}">${esc(ic)}</div><div><b>${esc(title)}</b><span>${esc(body)}</span></div>`;
    host.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.dataset.state = ''; }));
    while (host.children.length > 3) host.firstElementChild.remove();
    setTimeout(() => { el.dataset.state = 'exit'; setTimeout(() => el.remove(), 220); }, 4200);
  }

  /* ---------------- Rutas ---------------- */
  const ROUTES = ['inicio', 'casa', 'ceo', 'seguridad'];
  let current = null;
  function route() {
    let h = (location.hash || '').replace('#', '');
    let anchor = null;
    if (h === 'piloto' || h === 'precios') { anchor = h; h = 'inicio'; }
    const sub = h.split('-');
    let view = ROUTES.includes(sub[0]) ? sub[0] : 'inicio';
    // La subsección viene en el enlace (#casa-pagar); sin ella, se muestra la primera.
    if (view === 'casa') casaPane = paneTitles[sub[1]] ? sub[1] : 'resumen';
    if (view === 'ceo') ceoPane = ceoTitles[sub[1]] ? sub[1] : 'general';
    if (view !== current) {
      $$('.view').forEach(v => { v.hidden = v.dataset.view !== view; v.classList.remove('view-enter'); });
      const shown = $('#view-' + view);
      if (!reduceMotion) { void shown.offsetWidth; shown.classList.add('view-enter'); }
      $$('.mainnav a').forEach(a => a.setAttribute('aria-current', a.dataset.route === view ? 'page' : 'false'));
      current = view;
      if (!anchor) window.scrollTo(0, 0);
      if (view === 'casa') renderCasa();
      if (view === 'ceo') renderCeo();
      if (view === 'inicio') updateHero();
    }
    else if (view === 'casa' || view === 'ceo') selectPane(view, view === 'casa' ? casaPane : ceoPane);
    if (view === 'casa' || view === 'ceo') $$(`#${view}Rail [role=tab]`).forEach(b => b.setAttribute('aria-selected', String(b.dataset.pane === (view === 'casa' ? casaPane : ceoPane))));
    if (anchor) { const t = document.getElementById(anchor); t && t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  }
  window.addEventListener('hashchange', route);
  // El salto al contenido no cambia la ruta: enfoca la vista visible.
  $('.skip').addEventListener('click', e => {
    e.preventDefault();
    const v = $('#view-' + current); const h = v && $('h1, h2', v);
    if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  });

  /* ================================================================
     INICIO
     ================================================================ */
  const SHARE = [['Estufa eléctrica', .45, 's4'], ['Termo eléctrico', .26, 's5'], ['Refrigerador', .11, 's1'], ['Hervidor', .09, 's2'], ['Televisor', .03, 's3'], ['Luces y otros', .06, 's6']];
  const bdList = $('#bdList');
  bdList.innerHTML = SHARE.map(([n, , s]) => `<li class="bd-row"><span class="nm"><i style="background:var(--${s})"></i>${n}</span><span class="trk"><span class="fill" style="display:block;background:var(--${s});transform:scaleX(0)"></span></span><span class="v num">$0</span></li>`).join('');
  function renderBill(total) {
    const max = SHARE[0][1];
    $$('.bd-row', bdList).forEach((row, i) => {
      const [, sh] = SHARE[i];
      $('.fill', row).style.transform = `scaleX(${(sh / max).toFixed(3)})`;
      $('.v', row).textContent = clp(total * sh);
    });
    $('#bdTotal').textContent = clp(total);
    const kwh = total / V.TARIFA;
    const save = total * 0.08;
    $('#bdTip').innerHTML = `Son unos <b class="num">${fmt(kwh)} kWh</b>. Con avisos y el termo programado, una casa así podría ahorrar cerca de <b class="num">${clp(save)}</b> al mes.`;
  }
  const billInput = $('#billInput');
  function readBill() { const n = parseInt(billInput.value.replace(/\D/g, ''), 10); return isFinite(n) ? n : 0; }
  billInput.addEventListener('input', () => {
    const n = Math.min(readBill(), 9999999);
    const pos = billInput.value.length - billInput.selectionStart;
    billInput.value = n ? n.toLocaleString('es-CL') : '';
    try { const p = Math.max(0, billInput.value.length - pos); billInput.setSelectionRange(p, p); } catch (e) {}
    $$('.bill-chips button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.bill === n)));
    renderBill(n);
  });
  $$('.bill-chips button').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.bill; billInput.value = n.toLocaleString('es-CL');
    $$('.bill-chips button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderBill(n);
  }));
  requestAnimationFrame(() => renderBill(readBill()));

  $$('[data-plan]').forEach(a => a.addEventListener('click', () => {
    const r = $(`#ctaForm input[name=tipo][value="${a.dataset.plan}"]`); if (r) r.checked = true;
  }));
  $('#ctaForm').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#comuna');
    const c = inp.value.trim();
    const tipo = ($('#ctaForm input[name=tipo]:checked') || {}).value === 'Pyme' ? 'tu pyme' : 'tu casa';
    const out = $('#ctaAfter');
    if (!c) { out.textContent = 'Escribe tu comuna para saber cuándo llegamos.'; out.classList.remove('ok'); inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
    inp.removeAttribute('aria-invalid');
    out.textContent = `Anotado: ${c}, para ${tipo}. En esta alfa no se envía a ningún lado; en el piloto te escribiremos cuando lleguemos.`;
    out.classList.add('ok');
  });

  /* ---- Vista en vivo del inicio (usa la misma simulación que Mi casa) ---- */
  function updateHero() {
    const ul = $('#hList'); if (!ul || sim.total == null) return;
    if (!ul.children.length) {
      ul.innerHTML = AP.filter(a => a.id !== 'otros').map(a => `<li data-h="${a.id}"><i style="background:var(--${a.series})"></i><span>${a.name}</span><span class="trk"><span class="fill" style="background:var(--${a.series})"></span></span><b class="num">0 W</b></li>`).join('');
    }
    $$('li', ul).forEach(li => {
      const a = byId(li.dataset.h);
      $('.fill', li).style.transform = `scaleX(${Math.min(1, a.p / 2000).toFixed(3)})`;
      $('b', li).textContent = fmt(a.p) + ' W';
      li.classList.toggle('off', a.p < 1);
      li.classList.toggle('flash', (sim.flash[a.id] || 0) > 0);
    });
    const amp = sim.total / 220, pct = amp / 25;
    $('#hNow').textContent = fmt(sim.total) + ' W';
    $('#hToday').textContent = clp(sim.costToday);
    $('#hAmp').textContent = `${fmt(amp, 1)} / 25 A`;
    const bar = $('#hAmpBar');
    bar.style.transform = `scaleX(${Math.min(1, pct).toFixed(3)})`;
    bar.style.background = pct > .96 ? 'var(--bad)' : pct > .8 ? 'var(--warn)' : 'var(--good)';
    $('#hAmpNote').textContent = sim.shedLeft > 0 ? 'Termo pausado por Vatia para que no salte el automático.' : 'Si la casa se acerca a 25 A, Vatia pausa el termo unos minutos.';
  }

  /* ================================================================
     MI CASA · simulación en vivo
     ================================================================ */
  const SETTINGS = Object.assign({ tarifa: V.TARIFA, meta: 65000, autoControl: true, wa: true, mail: false, app: true, protect: { c1: true, c2: false, c3: false } }, store.get('settings', {}));
  const AP = V.APPLIANCES.map(a => Object.assign({}, a, { on: !!a.always || a.id === 'tv' || a.id === 'estufa' || a.id === 'termo', p: 0, hist: [] }));
  const byId = id => AP.find(a => a.id === id);
  const HIST = 60;
  const sim = { tick: 0, shedLeft: 0, termoUser: true, termoScheduled: false, costToday: 1420, kwhToday: 5.52, events: [], hervLeft: 0, nextHerv: 14, refriCycle: 0, flash: {} };
  const recState = store.get('recs', {});
  if (recState.r1) sim.termoScheduled = true;
  const alerts = V.ALERTS.map(a => Object.assign({}, a, { unread: store.get('read.' + a.id, null) === true ? false : a.unread }));

  function stepSim(silent) {
    sim.tick++;
    const t = sim.tick;
    // refrigerador: ciclos del compresor
    sim.refriCycle = (sim.refriCycle + 1) % 26;
    byId('refri').on = sim.refriCycle < 18;
    // hervidor: aparece cada cierto rato por 6 ticks
    if (sim.hervLeft > 0) { sim.hervLeft--; if (!sim.hervLeft) { byId('hervidor').on = false; if (!silent) { flash('hervidor'); toast('Hervidor apagado', '−1.950 W · Cocina', 'HV', 'var(--s2)'); } } }
    else if (t >= sim.nextHerv) { sim.hervLeft = 6; sim.nextHerv = t + 34 + (t % 7); byId('hervidor').on = true; if (!silent) { flash('hervidor'); toast('Hervidor encendido', '+1.950 W · Cocina · resistivo, sin reactiva · 97%', 'HV', 'var(--s2)'); } }
    // termo: usuario, programación y control de sobrecarga
    if (sim.shedLeft > 0) { sim.shedLeft--; if (!sim.shedLeft && !silent) { flash('termo'); toast('Termo encendido de nuevo', 'La casa volvió a estar bajo el límite.', 'TE', 'var(--s5)'); pushEvent('Termo encendido de nuevo después de la pausa', 'control'); } }
    const termo = byId('termo');
    termo.on = sim.termoUser && !sim.termoScheduled && sim.shedLeft === 0;
    // potencias
    AP.forEach(a => {
      let p = 0;
      if (a.on) {
        if (a.id === 'refri') p = a.w + 6 * Math.sin(t * .7);
        else if (a.id === 'otros') p = a.w + 10 * Math.sin(t * .3);
        else if (a.id === 'tv') p = a.w + 4 * Math.sin(t);
        else p = a.w;
      }
      a.p = p;
    });
    let total = AP.reduce((s, a) => s + a.p, 0);
    // control automático: si se pasa de 24,5 A, pausa el termo 10 ticks
    if (SETTINGS.autoControl && total / 220 > 24.5 && termo.on && !SETTINGS.protect.c3) {
      sim.shedLeft = 10; termo.on = false; termo.p = 0; total -= termo.w;
      if (!silent) {
        flash('termo');
        toast('Termo pausado por Vatia', 'Ibas a 26,3 A y el automático es de 25 A. Vuelve en unos minutos.', '!', 'var(--accent)');
        pushEvent('Termo pausado 10 min para que no saltara el automático', 'control');
      }
    }
    AP.forEach(a => { a.hist.push(a.p); if (a.hist.length > HIST) a.hist.shift(); });
    const kwh = total / 1000 * (30 / 3600);
    sim.kwhToday += kwh; sim.costToday += kwh * SETTINGS.tarifa;
    sim.total = total;
  }
  function flash(id) { sim.flash[id] = 3; }
  function pushEvent(text, kind) {
    const now = new Date();
    alerts.unshift({ id: 'live' + Date.now(), kind, sev: 'info', when: 'Ahora, ' + now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false }), title: text, body: 'Registrado automáticamente por el control de carga.', unread: true });
    paintBadge();
    if (current === 'casa' && casaPane === 'avisos') renderAvisos();
  }
  for (let k = 0; k < HIST; k++) stepSim(true);

  /* ---- estructura de Mi casa ---- */
  let casaPane = 'resumen';
  let casaBuilt = false;
  const paneTitles = {
    resumen: ['Resumen', 'Lo que está pasando en tu casa ahora.'],
    aparatos: ['Aparatos', 'Cada aparato que Vatia reconoce, con su consumo y su costo.'],
    ahorro: ['Ahorro', 'Tu meta del mes y lo que más te conviene cambiar.'],
    avisos: ['Avisos', 'Lo que Vatia notó en tu casa.'],
    pagar: ['Pagar mi cuenta', 'Lo que vas a pagar y el enlace oficial de tu distribuidora.'],
    ajustes: ['Ajustes', 'Tu tarifa, tu meta y cómo quieres que actúe Vatia.']
  };
  function paintBadge() { const n = alerts.filter(a => a.unread).length; const b = $('#unreadBadge'); b.textContent = n; b.hidden = !n; }
  paintBadge();

  function selectPane(which, pane) {
    if (which === 'casa') {
      if (!paneTitles[pane]) return;
      casaPane = pane;
      $$('#casaRail [role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pane === pane)));
      renderCasa();
    } else {
      if (!ceoTitles[pane]) return;
      ceoPane = pane;
      $$('#ceoRail [role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pane === pane)));
      renderCeo();
    }
  }
  // Cada pestaña cambia el enlace, para que se pueda compartir (#casa-avisos, #ceo-clientes...).
  const paneHash = (which, pane) => '#' + which + (pane === (which === 'casa' ? 'resumen' : 'general') ? '' : '-' + pane);
  $$('#casaRail [role=tab]').forEach(b => b.addEventListener('click', () => { location.hash = paneHash('casa', b.dataset.pane); }));
  $$('#ceoRail [role=tab]').forEach(b => b.addEventListener('click', () => { location.hash = paneHash('ceo', b.dataset.pane); }));
  function railKeys(rail) {
    rail.addEventListener('keydown', e => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const tabs = $$('[role=tab]', rail); const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = tabs[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click();
    });
  }
  railKeys($('#casaRail')); railKeys($('#ceoRail'));

  // En celular las tablas se muestran como fichas: cada celda lleva el nombre de su columna.
  function labelTables(root) {
    $$('table.data', root).forEach(t => {
      const hs = $$('thead th', t).map(th => th.textContent.trim());
      $$('tbody tr', t).forEach(tr => $$('td', tr).forEach((td, i) => { if (hs[i]) td.dataset.label = hs[i]; }));
    });
  }
  const head = (t, s, extra = '') => `<div class="work-head"><div><h1>${t}</h1><p>${s}</p></div>${extra}</div>`;
  const demoNote = `<span class="demo-note">${icon('lock')} Hogar de ejemplo · datos simulados</span>`;

  function renderCasa() {
    const w = $('#casaWork');
    const [t, s] = paneTitles[casaPane];
    let html = head(t, s, demoNote);
    if (casaPane === 'resumen') html += resumenHTML();
    if (casaPane === 'aparatos') html += `<div class="tablewrap"><table class="data" id="apTable"></table></div><p class="k-sub" style="margin-top:10px">La confianza es qué tan seguro está el modelo de que el consumo corresponde a ese aparato.</p>`;
    if (casaPane === 'ahorro') html += ahorroHTML();
    if (casaPane === 'avisos') html += `<div class="chips" role="group" aria-label="Filtrar avisos" id="alertChips"></div><ul class="feed" id="feed"></ul>`;
    if (casaPane === 'pagar') html += pagarHTML();
    if (casaPane === 'ajustes') html += ajustesHTML();
    w.innerHTML = html;
    if (casaPane === 'resumen') { bindResumen(); updateResumen(); }
    if (casaPane === 'aparatos') renderApTable();
    if (casaPane === 'ahorro') bindAhorro();
    if (casaPane === 'avisos') renderAvisos();
    if (casaPane === 'pagar') bindPagar();
    if (casaPane === 'ajustes') bindAjustes();
    labelTables(w);
  }

  /* ---- Resumen ---- */
  function resumenHTML() {
    return `
    <div class="summary" aria-live="off">
      <div><div class="k-label"><span class="live-dot"></span>Consumo ahora</div><div class="k-val" id="kNow">0<small>W</small></div><div class="k-sub" id="kNowSub"></div></div>
      <div><div class="k-label">Gasto de hoy</div><div class="k-val" id="kToday">$0</div><div class="k-sub" id="kTodaySub"></div></div>
      <div><div class="k-label">Proyección del mes</div><div class="k-val">$71.600</div><div class="k-sub"><span class="up">+9,8%</span> vs septiembre ($65.200)</div></div>
      <div><div class="k-label">Automático general</div><div class="k-val" id="kAmp">0<small>/ 25 A</small></div><div class="meter"><i id="kAmpBar"></i></div></div>
    </div>
    <section class="panel" style="margin-top:20px" aria-labelledby="tab-h">
      <div class="panel-h"><h2 id="tab-h">Tu tablero</h2><span>Toca un circuito para ver sus aparatos</span></div>
      <div class="tablero" id="tablero"></div>
    </section>
    <div class="grid-2">
      <section class="panel chart" aria-labelledby="ch-h">
        <div class="panel-h"><h2 id="ch-h">Potencia por aparato</h2><span>Últimos 30 minutos</span></div>
        <div id="liveChart"></div>
        <div class="legend">${AP.map(a => `<span><i style="background:var(--${a.series})"></i>${a.name}</span>`).join('')}</div>
      </section>
      <section class="panel" aria-labelledby="ap-h">
        <div class="panel-h"><h2 id="ap-h">Aparatos</h2><span id="apFilter">Todos los circuitos</span></div>
        <ul class="alist" id="alist"></ul>
      </section>
    </div>`;
  }
  let circuitFilter = null;
  function bindResumen() {
    const tb = $('#tablero');
    tb.innerHTML = `<div class="din main"><div class="din-top">General <em>25 A</em></div><div class="din-lever"><i id="dinMain"></i></div><div class="din-amp" id="dinMainA">0 A</div><div class="din-sub">Empalme 220 V</div></div>` +
      V.CIRCUITS.map(c => `<button type="button" class="din" data-c="${c.id}" aria-pressed="false"><span class="din-top">${c.id.toUpperCase()} <em>${c.amp} A</em></span><span class="din-lever"><i data-lever="${c.id}"></i></span><span class="din-amp" data-amp="${c.id}">0 A</span><span class="din-sub">${c.name}<br>${c.note}</span><span class="state" data-state="${c.id}"></span></button>`).join('');
    $$('.din[data-c]', tb).forEach(b => b.addEventListener('click', () => {
      circuitFilter = circuitFilter === b.dataset.c ? null : b.dataset.c;
      $$('.din[data-c]', tb).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.c === circuitFilter)));
      buildList();
    }));
    buildList();
  }
  function buildList() {
    const ul = $('#alist'); if (!ul) return;
    const list = AP.filter(a => !circuitFilter || a.circuit === circuitFilter);
    $('#apFilter').textContent = circuitFilter ? V.CIRCUITS.find(c => c.id === circuitFilter).name : 'Todos los circuitos';
    ul.innerHTML = list.map(a => `<li data-ap="${a.id}"><span class="sw" style="background:var(--${a.series})"></span><span class="nm"><b>${a.name}</b><span data-sub></span></span><span class="w" data-w>0 W</span>${a.controllable
      ? `<label class="switch" title="Encender o apagar el termo"><input type="checkbox" id="sw-${a.id}" ${sim.termoUser ? 'checked' : ''} aria-label="Termo encendido"><span></span></label>`
      : `<span class="pill" data-pill>—</span>`}</li>`).join('');
    const sw = $('#sw-termo');
    sw && sw.addEventListener('change', () => {
      sim.termoUser = sw.checked;
      toast(sw.checked ? 'Termo encendido' : 'Termo apagado', sw.checked ? 'Lo encendiste desde la app.' : 'Lo apagaste desde la app. El contactor abrió el circuito C3.', 'TE', 'var(--s5)');
      stepSim(true); updateResumen();
    });
    updateResumen();
  }
  function updateResumen() {
    if (!$('#kNow')) return;
    const total = sim.total, amp = total / 220;
    $('#kNow').innerHTML = `${fmt(total)}<small>W</small>`;
    const on = AP.filter(a => a.p > 1).length;
    $('#kNowSub').textContent = `${on} aparatos encendidos`;
    $('#kToday').textContent = clp(sim.costToday);
    $('#kTodaySub').textContent = `${fmt(sim.kwhToday, 1)} kWh desde las 00:00`;
    $('#kAmp').innerHTML = `${fmt(amp, 1)}<small>/ 25 A</small>`;
    const bar = $('#kAmpBar'); const pct = amp / 25;
    bar.style.transform = `scaleX(${Math.min(1, pct).toFixed(3)})`;
    bar.style.background = pct > .96 ? 'var(--bad)' : pct > .8 ? 'var(--warn)' : 'var(--good)';
    // tablero
    const main = $('#dinMain');
    if (main) {
      main.style.transform = `scaleX(${Math.min(1, pct).toFixed(3)})`; main.style.background = bar.style.background;
      $('#dinMainA').textContent = fmt(amp, 1) + ' A';
      V.CIRCUITS.forEach(c => {
        const a = AP.filter(x => x.circuit === c.id).reduce((s, x) => s + x.p, 0) / 220;
        const lv = $(`[data-lever="${c.id}"]`); const r = a / c.amp;
        lv.style.transform = `scaleX(${Math.min(1, r).toFixed(3)})`;
        lv.style.background = r > .9 ? 'var(--bad)' : r > .7 ? 'var(--warn)' : 'var(--good)';
        $(`[data-amp="${c.id}"]`).textContent = fmt(a, 1) + ' A';
        const st = $(`[data-state="${c.id}"]`);
        if (c.id === 'c3' && sim.shedLeft > 0) st.innerHTML = `<span class="pill paused">${icon('pause')}Pausado por Vatia</span>`;
        else if (c.id === 'c3' && !byId('termo').on) st.innerHTML = `<span class="pill">Apagado</span>`;
        else st.innerHTML = c.protected && SETTINGS.protect[c.id] ? `<span class="pill">${icon('lock')}Protegido</span>` : (c.controllable ? `<span class="pill on">Con control</span>` : '');
      });
    }
    // lista
    $$('#alist li').forEach(li => {
      const a = byId(li.dataset.ap);
      $('[data-w]', li).textContent = fmt(a.p) + ' W';
      const todayCost = a.month / 30 * .62 + (a.p > 1 ? 0 : 0);
      $('[data-sub]', li).textContent = `${V.CIRCUITS.find(c => c.id === a.circuit).name} · hoy ${clp(todayCost)}`;
      const pill = $('[data-pill]', li);
      if (pill) { const on = a.p > 1; pill.textContent = on ? 'Encendido' : 'Apagado'; pill.className = 'pill' + (on ? ' on' : ''); }
      if (a.id === 'termo') { const s = $('#sw-termo'); if (s && s.checked !== sim.termoUser) s.checked = sim.termoUser; $('[data-sub]', li).textContent = sim.shedLeft ? 'Pausado por Vatia para evitar sobrecarga' : sim.termoScheduled ? 'Programado 6:30 a 7:30' : 'Circuito propio · con control'; }
      li.classList.toggle('flash', (sim.flash[a.id] || 0) > 0);
    });
    drawLive();
  }

  /* ---- gráficos: se dibujan al ancho real para que el texto no se achique en el celular ---- */
  const chartW = (host, max) => Math.round(Math.max(300, Math.min(max, host.clientWidth || max)));
  let resizeT = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(redrawCharts, 150); });

  /* ---- gráfico apilado (SVG) ---- */
  function drawLive() {
    const host = $('#liveChart'); if (!host) return;
    const W = chartW(host, 640), H = W < 500 ? 200 : 230, L = 46, R = 8, T = 10, B = 26, ymax = 7000;
    const x = i => L + (W - L - R) * i / (HIST - 1);
    const y = v => T + (H - T - B) * (1 - Math.min(v, ymax) / ymax);
    const order = ['otros', 'refri', 'tv', 'termo', 'hervidor', 'estufa'].map(byId);
    const acc = new Array(HIST).fill(0);
    let paths = '';
    order.forEach(a => {
      const prev = acc.slice();
      for (let i = 0; i < HIST; i++) acc[i] += a.hist[i] || 0;
      let d = `M${x(0)} ${y(acc[0])}`;
      for (let i = 1; i < HIST; i++) d += `L${x(i).toFixed(1)} ${y(acc[i]).toFixed(1)}`;
      for (let i = HIST - 1; i >= 0; i--) d += `L${x(i).toFixed(1)} ${y(prev[i]).toFixed(1)}`;
      paths += `<path d="${d}Z" fill="var(--${a.series})" fill-opacity=".85"/>`;
    });
    let grid = '';
    [0, 2000, 4000, 6000].forEach(v => { grid += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v / 1000} kW</text>`; });
    const xl = [[0, '−30 min'], [HIST / 2, '−15 min'], [HIST - 1, 'ahora']].map(([i, t], k) => `<text class="ax" x="${x(i)}" y="${H - 6}" text-anchor="${k === 0 ? 'start' : k === 2 ? 'end' : 'middle'}">${t}</text>`).join('');
    const lim = `<line class="lim" x1="${L}" x2="${W - R}" y1="${y(5500)}" y2="${y(5500)}"/><text class="limt" x="${W - R}" y="${y(5500) - 6}" text-anchor="end">Límite del automático · 25 A</text>`;
    const end = `<circle cx="${x(HIST - 1)}" cy="${y(acc[HIST - 1])}" r="5" fill="var(--fg)" stroke="var(--surface)" stroke-width="2"/>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Potencia de la casa en los últimos 30 minutos, ahora ${fmt(sim.total)} W">${grid}${paths}${lim}${xl}${end}</svg>`;
  }

  /* ---- Aparatos (tabla ordenable) ---- */
  let apSort = { k: 'month', dir: -1 };
  function renderApTable() {
    const tbl = $('#apTable'); if (!tbl) return;
    const totalMonth = AP.reduce((s, a) => s + a.month, 0);
    const rows = AP.map(a => ({ a, name: a.name, circ: V.CIRCUITS.find(c => c.id === a.circuit).name, p: a.p, today: a.month / 30 * .62, month: a.month, share: a.month / totalMonth, conf: a.conf || 0 }));
    rows.sort((r1, r2) => (r1[apSort.k] > r2[apSort.k] ? 1 : r1[apSort.k] < r2[apSort.k] ? -1 : 0) * apSort.dir);
    const th = (k, t, r) => `<th class="${r ? 'r' : ''}" aria-sort="${apSort.k === k ? (apSort.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-k="${k}">${t}${icon('sort')}</button></th>`;
    tbl.innerHTML = `<thead><tr>${th('name', 'Aparato')}${th('circ', 'Circuito')}<th>Estado</th>${th('p', 'Ahora', 1)}${th('today', 'Hoy', 1)}${th('month', 'Mes (proyección)', 1)}${th('share', 'De tu cuenta')}<th>Huella eléctrica</th>${th('conf', 'Confianza', 1)}</tr></thead><tbody>` +
      rows.map(r => `<tr><td><span class="share"><i style="width:10px;height:10px;border-radius:3px;background:var(--${r.a.series})"></i><b>${r.name}</b></span></td><td>${r.circ}</td><td>${r.a.id === 'termo' && sim.shedLeft ? '<span class="pill paused">Pausado</span>' : r.p > 1 ? '<span class="pill on">Encendido</span>' : '<span class="pill">Apagado</span>'}</td><td class="r num">${fmt(r.p)} W</td><td class="r num">${clp(r.today)}</td><td class="r num">${clp(r.month)}</td><td><span class="share"><span class="trk"><i style="width:${(r.share * 100).toFixed(1)}%;background:var(--${r.a.series})"></i></span><span class="num">${fmt(r.share * 100)}%</span></span></td><td class="huella">${r.a.sig}</td><td class="r num">${r.a.conf ? r.a.conf + '%' : '—'}</td></tr>`).join('') + '</tbody>';
    labelTables(tbl.parentNode);
    $$('th button', tbl).forEach(b => b.addEventListener('click', () => { const k = b.dataset.k; apSort = { k, dir: apSort.k === k ? -apSort.dir : (k === 'name' || k === 'circ' ? 1 : -1) }; renderApTable(); const nb = $(`th button[data-k="${k}"]`, tbl); nb && nb.focus(); }));
  }

  /* ---- Ahorro ---- */
  function ahorroHTML() {
    const spent = 41230, proj = 71600, meta = SETTINGS.meta, max = Math.max(proj, meta) * 1.08;
    return `<section class="panel goal" aria-labelledby="goal-h">
      <div class="panel-h"><h2 id="goal-h">Meta de octubre</h2><span>${proj > meta ? `Vas <b style="color:var(--warn)">${clp(proj - meta)}</b> sobre tu meta` : 'Vas dentro de tu meta'}</span></div>
      <div class="goal-track" role="img" aria-label="Gastado ${clp(spent)}, proyección ${clp(proj)}, meta ${clp(meta)}"><div class="spent" style="width:${(spent / max * 100).toFixed(1)}%"></div><div class="meta" style="left:${(meta / max * 100).toFixed(1)}%"></div><div class="proj" style="left:${(proj / max * 100).toFixed(1)}%"></div></div>
      <div class="goal-legend"><span>Gastado al día 15: <b>${clp(spent)}</b></span><span>Meta: <b>${clp(meta)}</b></span><span>Proyección: <b>${clp(proj)}</b></span></div>
    </section>
    <div class="recs" id="recs">${V.RECS.map(r => recHTML(r)).join('')}</div>
    <p class="k-sub" style="margin-top:14px">Ahorro estimado si aplicas todo: <b class="num" style="color:var(--good)">${clp(V.RECS.reduce((s, r) => s + r.save, 0))}</b> al mes.</p>`;
  }
  function recHTML(r) {
    const done = !!recState[r.id];
    return `<article class="rec ${done ? 'done' : ''}" data-rec="${r.id}"><div><h3>${r.title}</h3><p>${r.body}</p></div><div class="save">${clp(r.save)}<small>al mes</small></div><div class="act">${done ? `<span class="doneTxt">${icon('check')}${r.done}</span><button class="btn btn-ghost btn-small" type="button" data-undo="${r.id}">Deshacer</button>` : `<button class="btn btn-primary btn-small" type="button" data-do="${r.id}">${r.action}</button>`}</div></article>`;
  }
  function bindAhorro() {
    $('#recs').addEventListener('click', e => {
      const d = e.target.closest('[data-do]'), u = e.target.closest('[data-undo]');
      if (!d && !u) return;
      const id = (d || u).dataset.do || (d || u).dataset.undo;
      recState[id] = !!d; store.set('recs', recState);
      if (id === 'r1') { sim.termoScheduled = !!d; }
      const r = V.RECS.find(x => x.id === id);
      const art = $(`[data-rec="${id}"]`); art.outerHTML = recHTML(r);
      if (d) toast('Listo', r.done, 'OK', 'var(--good)');
      const nb = $(`[data-rec="${id}"] button`); nb && nb.focus();
    });
  }

  /* ---- Avisos ---- */
  let alertFilter = 'todos';
  const AF = [['todos', 'Todos'], ['nuevos', 'Sin leer'], ['falla', 'Fallas'], ['control', 'Control'], ['corte', 'Cortes'], ['seguridad', 'Seguridad']];
  const kindIcon = { control: 'pause', falla: 'wrench', consumo: 'plugoff', corte: 'bolt', seguridad: 'alert', meta: 'leaf' };
  function renderAvisos() {
    const chips = $('#alertChips'); if (!chips) return;
    chips.innerHTML = AF.map(([k, t]) => `<button type="button" class="chip" data-f="${k}" aria-pressed="${alertFilter === k}">${t}</button>`).join('') + `<button type="button" class="btn btn-ghost btn-small" id="markAll" style="margin-left:auto">Marcar todo como leído</button>`;
    const list = alerts.filter(a => alertFilter === 'todos' || (alertFilter === 'nuevos' ? a.unread : a.kind === alertFilter));
    $('#feed').innerHTML = list.length ? list.map(a => `<li data-a="${a.id}"><span class="ic ${a.sev}">${icon(kindIcon[a.kind] || 'bell')}</span><div><h3>${a.unread ? '<span class="new" aria-label="Sin leer"></span>' : ''}${esc(a.title)}</h3><p>${esc(a.body)}</p></div><time>${esc(a.when)}</time></li>`).join('') : `<li class="empty" style="display:block">No hay avisos en este filtro.</li>`;
    $$('.chip', chips).forEach(c => c.addEventListener('click', () => { alertFilter = c.dataset.f; renderAvisos(); $(`.chip[data-f="${alertFilter}"]`).focus(); }));
    $('#markAll').addEventListener('click', () => { alerts.forEach(a => { a.unread = false; store.set('read.' + a.id, true); }); paintBadge(); renderAvisos(); });
  }

  /* ---- Pagar ---- */
  function pagarHTML() {
    const sel = store.get('dist', 'cge');
    return `<div class="pay">
      <section class="panel estimate" aria-labelledby="est-h">
        <div class="panel-h"><h2 id="est-h">Próxima boleta estimada</h2><span>Octubre</span></div>
        <div class="k-val">$71.600</div>
        <div class="k-sub">Estimación de Vatia. El monto real es el que indica tu distribuidora.</div>
        <dl><dt>Energía (278 kWh × $257)</dt><dd>$71.446</dd><dt>Cargo fijo estimado</dt><dd>$1.020</dd><dt>Subsidio eléctrico</dt><dd>$0</dd><dt>Redondeo</dt><dd>−$866</dd></dl>
      </section>
      <section class="panel" aria-labelledby="dist-h">
        <div class="panel-h"><h2 id="dist-h">Tu distribuidora</h2></div>
        <div class="dists" role="radiogroup" aria-label="Distribuidora">${V.DISTRIBUIDORAS.map(d => `<label class="dist"><input type="radio" name="dist" value="${d.id}" ${d.id === sel ? 'checked' : ''}><span><b>${d.name}</b><span>${d.zona}</span></span><code>${d.dominio}</code></label>`).join('')}</div>
        <a class="btn btn-primary" id="payLink" target="_blank" rel="noopener noreferrer" href="#">Ir a pagar</a>
        <div class="safe">${icon('shield')}<span id="payNote"></span></div>
      </section>
    </div>`;
  }
  function bindPagar() {
    const paint = () => {
      const id = ($('input[name=dist]:checked') || {}).value || 'cge';
      const d = V.DISTRIBUIDORAS.find(x => x.id === id);
      const a = $('#payLink'); a.href = d.url; a.innerHTML = `Ir a pagar en el sitio de ${d.name} ${icon('external')}`;
      $('#payNote').innerHTML = `Vas a salir de Vatia hacia <b>${d.dominio}</b>. Vatia nunca te pide datos de tu tarjeta: el pago se hace solo en el sitio oficial de ${d.name}.`;
      store.set('dist', id);
    };
    $$('input[name=dist]').forEach(r => r.addEventListener('change', paint));
    paint();
  }

  /* ---- Ajustes ---- */
  function ajustesHTML() {
    const tog = (id, on, label) => `<label class="switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} aria-label="${label}"><span></span></label>`;
    return `<div class="settings">
      <div class="set"><div><b>Tarifa</b><span>Precio por kWh de tu boleta. Se usa para mostrar todo en pesos.</span></div><label class="field"><small>$</small><input id="setTarifa" inputmode="numeric" value="${SETTINGS.tarifa}" aria-label="Tarifa en pesos por kWh"><small>/kWh</small></label></div>
      <div class="set"><div><b>Meta mensual</b><span>Te avisamos si la proyección del mes la supera.</span></div><label class="field"><small>$</small><input id="setMeta" inputmode="numeric" value="${SETTINGS.meta.toLocaleString('es-CL')}" aria-label="Meta mensual en pesos"></label></div>
      <div class="set"><div><b>Evitar que salte el automático</b><span>Vatia pausa el termo unos minutos si la casa se acerca a 25 A.</span></div>${tog('setAuto', SETTINGS.autoControl, 'Control automático de carga')}</div>
      ${V.CIRCUITS.map(c => `<div class="set"><div><b>Proteger ${c.id.toUpperCase()} · ${c.name}</b><span>${c.id === 'c1' ? 'Aquí está el refrigerador. Vatia nunca lo va a apagar.' : 'Si lo proteges, Vatia nunca va a cortar este circuito.'}</span></div>${tog('setP' + c.id, SETTINGS.protect[c.id], 'Proteger ' + c.name)}</div>`).join('')}
      <div class="set"><div><b>Avisos por WhatsApp</b><span>Un resumen semanal y las alertas importantes.</span></div>${tog('setWa', SETTINGS.wa, 'Avisos por WhatsApp')}</div>
      <div class="set"><div><b>Avisos por correo</b><span>Reporte mensual con tu proyección.</span></div>${tog('setMail', SETTINGS.mail, 'Avisos por correo')}</div>
    </div>
    <p class="k-sub" style="margin-top:12px">En esta alfa, tus ajustes se guardan solo en este navegador.</p>`;
  }
  function bindAjustes() {
    const save = () => store.set('settings', SETTINGS);
    const num = (el, k, min) => el.addEventListener('change', () => { const n = parseInt(el.value.replace(/\D/g, ''), 10); if (isFinite(n) && n >= min) { SETTINGS[k] = n; save(); el.value = n.toLocaleString('es-CL'); toast('Guardado', k === 'tarifa' ? `Tarifa: $${n}/kWh` : `Meta: ${clp(n)}`, 'OK', 'var(--good)'); } else { el.value = SETTINGS[k].toLocaleString('es-CL'); toast('Revisa el número', 'Escribe solo números, por ejemplo 257.', '!', 'var(--warn)'); } });
    num($('#setTarifa'), 'tarifa', 50); num($('#setMeta'), 'meta', 1000);
    const bool = (id, set) => $('#' + id).addEventListener('change', e => { set(e.target.checked); save(); });
    bool('setAuto', v => SETTINGS.autoControl = v);
    V.CIRCUITS.forEach(c => bool('setP' + c.id, v => SETTINGS.protect[c.id] = v));
    bool('setWa', v => SETTINGS.wa = v); bool('setMail', v => SETTINGS.mail = v);
  }

  /* ================================================================
     PANEL CEO
     ================================================================ */
  const CL = V.CLIENTS;
  let ceoPane = 'general';
  const ceoTitles = {
    general: ['General', 'Cómo está el piloto hoy, jueves 15 de octubre.'],
    clientes: ['Clientes', 'Consumo, actividad y alertas de cada cliente. Toca una fila para ver el detalle.'],
    equipos: ['Equipos', 'Estado de los sensores instalados.'],
    negocio: ['Negocio', 'Ingresos, inversión y recuperación del piloto.']
  };
  const mrr = CL.reduce((s, c) => s + c.plan, 0);
  const activity = [
    ['20:31', 'VT-014', 'Termo pausado para evitar sobrecarga'], ['20:27', 'VT-006', 'Aviso de falla: refrigerador de exhibición'],
    ['20:19', 'VT-021', 'Activó programación del termo'], ['20:12', 'VT-009', 'Equipo sin señal hace 3 h'],
    ['20:05', 'VT-030', 'Fue a pagar su cuenta (CGE)'], ['19:58', 'VT-003', 'Nuevo aparato reconocido: secadora']
  ];
  const ceoCharts = [];

  function renderCeo() {
    const w = $('#ceoWork');
    const [t, s] = ceoTitles[ceoPane];
    let html = head(t, s, `<span class="demo-note">${icon('lock')} Clientes seudonimizados · datos de ejemplo</span>`);
    if (ceoPane === 'general') html += generalHTML();
    if (ceoPane === 'clientes') html += clientesHTML();
    if (ceoPane === 'equipos') html += equiposHTML();
    if (ceoPane === 'negocio') html += negocioHTML();
    w.innerHTML = html;
    if (ceoPane === 'general') { drawDemand(); paintActivity(); bindAlertRows(); }
    if (ceoPane === 'clientes') bindClientes();
    if (ceoPane === 'negocio') drawInstalls();
    labelTables(w);
  }
  function kpi(label, val, sub) { return `<div><div class="k-label">${label}</div><div class="k-val">${val}</div><div class="k-sub">${sub}</div></div>`; }
  function generalHTML() {
    const hog = CL.filter(c => c.tipo === 'Hogar').length, py = CL.length - hog;
    const online = CL.filter(c => c.online).length;
    const open = CL.reduce((s, c) => s + c.alerts, 0);
    const avgSave = CL.reduce((s, c) => s + c.saving, 0) / CL.length;
    const alertRows = CL.filter(c => c.alerts > 0).slice(0, 6);
    return `<div class="kpis">
      ${kpi('Clientes', CL.length, `${hog} hogares · ${py} pymes`)}
      ${kpi('Equipos en línea', `${online}<small>/${CL.length}</small>`, `<span class="up">${CL.length - online} sin señal</span>`)}
      ${kpi('Ingreso mensual', clp(mrr), 'Suscripciones activas')}
      ${kpi('Alertas abiertas', open, 'Fallas, cortes y equipos')}
      ${kpi('Ahorro promedio', fmt(avgSave, 1) + '%', 'vs. su cuenta anterior')}
      ${kpi('Sobrecargas evitadas', 7, 'Hoy, en 5 hogares')}
    </div>
    <div class="ceo-grid">
      <div style="display:flex;flex-direction:column;gap:20px;min-width:0">
        <section class="panel chart" aria-labelledby="dem-h"><div class="panel-h"><h2 id="dem-h">Demanda de todos los clientes</h2><span>Hoy, cada 30 minutos</span></div><div id="demandChart"></div></section>
        <section aria-labelledby="al-h"><div class="panel-h"><h2 id="al-h">Clientes con alertas</h2><span>Toca una fila para ver el detalle</span></div>
          <div class="tablewrap"><table class="data"><thead><tr><th>Cliente</th><th>Tipo</th><th>Comuna</th><th>Equipo</th><th>Último evento</th><th class="r">Alertas</th></tr></thead><tbody>
          ${alertRows.map(c => `<tr class="click" tabindex="0" data-cid="${c.id}"><td><b class="num">${c.id}</b></td><td>${c.tipo}${c.rubro ? ' · ' + c.rubro : ''}</td><td>${c.comuna}</td><td>${statusHTML(c)}</td><td>${c.online ? c.lastAct : 'Sin señal hace ' + ago(c.lastMin)}</td><td class="r"><span class="pill ${c.online ? 'warn' : 'bad'}">${c.alerts}</span></td></tr>`).join('')}
          </tbody></table></div></section>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;min-width:0">
        <section class="panel" aria-labelledby="act-h"><div class="panel-h"><h2 id="act-h">Actividad</h2><span><span class="live-dot" style="display:inline-block;margin-right:6px"></span>En vivo</span></div><ul class="activity" id="activity"></ul></section>
        <section class="panel" aria-labelledby="eq-h"><div class="panel-h"><h2 id="eq-h">Equipos</h2><span>${online} de ${CL.length} en línea</span></div>
          ${CL.filter(c => !c.online).map(c => `<div class="status off" style="margin-top:6px">${'<i></i>'}<b class="num">${c.id}</b>&nbsp;${c.comuna} · sin señal hace ${ago(c.lastMin)}</div>`).join('')}
          <button class="btn btn-ghost btn-small" type="button" style="margin-top:12px" data-goto="equipos">Ver todos los equipos</button>
        </section>
      </div>
    </div>`;
  }
  const ago = m => m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min';
  const statusHTML = c => c.online ? `<span class="status"><i></i>En línea</span>` : `<span class="status off"><i></i>Sin señal</span>`;
  function paintActivity(newOne) {
    const ul = $('#activity'); if (!ul) return;
    ul.innerHTML = activity.slice(0, 8).map((a, i) => `<li class="${newOne && i === 0 ? 'new' : ''}"><time>${a[0]}</time><span><b class="num">${a[1]}</b> ${esc(a[2])}</span></li>`).join('');
  }
  function bindAlertRows() {
    $$('#ceoWork tr[data-cid]').forEach(tr => {
      tr.addEventListener('click', () => openClient(tr.dataset.cid, tr));
      tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openClient(tr.dataset.cid, tr); } });
    });
    const g = $('[data-goto]'); g && g.addEventListener('click', () => { location.hash = '#ceo-' + g.dataset.goto; });
  }
  function drawDemand() {
    const host = $('#demandChart'); if (!host) return;
    const D = V.DEMAND, W = chartW(host, 720), H = W < 500 ? 210 : 240, L = 46, R = 10, T = 14, B = 26, ymax = 60;
    const x = i => L + (W - L - R) * i / (D.length - 1), y = v => T + (H - T - B) * (1 - v / ymax);
    let line = '', area = `M${x(0)} ${y(0)}`;
    D.forEach((v, i) => { line += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); area += `L${x(i).toFixed(1)} ${y(v).toFixed(1)}`; });
    area += `L${x(D.length - 1)} ${y(0)}Z`;
    const pk = D.indexOf(Math.max(...D));
    let grid = '';
    [0, 20, 40, 60].forEach(v => grid += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v} kW</text>`);
    const xs = [0, 6, 12, 18, 24].map(h => `<text class="ax" x="${x(Math.min(h * 2, D.length - 1))}" y="${H - 6}" text-anchor="${h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}">${String(h).padStart(2, '0')}:00</text>`).join('');
    const nowI = 41;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Demanda agregada de hoy, máximo ${D[pk]} kW a las ${Math.floor(pk / 2)}:${pk % 2 ? '30' : '00'}">${grid}
      <path d="${area}" fill="var(--accent)" fill-opacity=".18"/><path d="${line}" fill="none" stroke="var(--accent-text)" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="${x(nowI)}" x2="${x(nowI)}" y1="${T}" y2="${H - B}" stroke="var(--fg)" stroke-dasharray="3 4" stroke-width="1"/><text class="ax" x="${x(nowI) - 6}" y="${T + 10}" text-anchor="end">ahora</text>
      <circle cx="${x(pk)}" cy="${y(D[pk])}" r="5" fill="var(--accent-text)" stroke="var(--surface)" stroke-width="2"/><text class="limt" style="fill:var(--fg)" x="${x(pk) - 10}" y="${y(D[pk]) - 4}" text-anchor="end">Máximo ${fmt(D[pk], 1)} kW</text>${xs}</svg>`;
  }

  /* ---- Clientes ---- */
  let cliQ = '', cliTipo = 'todos', cliEstado = 'todos', cliSort = { k: 'month', dir: -1 };
  function clientesHTML() {
    return `<div class="filters">
      <label class="search">${icon('search')}<span class="sr">Buscar</span><input id="cliQ" placeholder="Buscar por código o comuna…" spellcheck="false" autocomplete="off" value="${esc(cliQ)}"></label>
      <label><span class="sr">Tipo</span><select class="sel" id="cliTipo"><option value="todos">Todos los tipos</option><option value="Hogar">Hogares</option><option value="Pyme">Pymes</option></select></label>
      <label><span class="sr">Estado</span><select class="sel" id="cliEstado"><option value="todos">Todos los estados</option><option value="alertas">Con alertas</option><option value="off">Sin señal</option></select></label>
      <span class="k-sub" id="cliCount"></span>
    </div>
    <div class="tablewrap"><table class="data" id="cliTable"></table></div>
    <p class="privacy-note">${icon('lock')}<span>El panel muestra códigos de cliente, no nombres. Los datos de contacto solo los ve soporte, con un motivo y quedando registrado.</span></p>`;
  }
  function bindClientes() {
    $('#cliTipo').value = cliTipo; $('#cliEstado').value = cliEstado;
    $('#cliQ').addEventListener('input', e => { cliQ = e.target.value; paintClientes(); });
    $('#cliTipo').addEventListener('change', e => { cliTipo = e.target.value; paintClientes(); });
    $('#cliEstado').addEventListener('change', e => { cliEstado = e.target.value; paintClientes(); });
    paintClientes();
  }
  function paintClientes() {
    const q = cliQ.trim().toLowerCase();
    let rows = CL.filter(c => (!q || c.id.toLowerCase().includes(q) || c.comuna.toLowerCase().includes(q)) && (cliTipo === 'todos' || c.tipo === cliTipo) && (cliEstado === 'todos' || (cliEstado === 'alertas' ? c.alerts > 0 : !c.online)));
    const key = { id: c => c.id, tipo: c => c.tipo, comuna: c => c.comuna, kwhDay: c => c.kwhDay, month: c => c.month, saving: c => c.saving, lastMin: c => c.lastMin, alerts: c => c.alerts }[cliSort.k];
    rows.sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0) * cliSort.dir);
    $('#cliCount').textContent = `${rows.length} de ${CL.length} clientes`;
    const th = (k, t, r) => `<th class="${r ? 'r' : ''}" aria-sort="${cliSort.k === k ? (cliSort.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-k="${k}">${t}${icon('sort')}</button></th>`;
    const tbl = $('#cliTable');
    tbl.innerHTML = `<thead><tr>${th('id', 'Cliente')}${th('tipo', 'Tipo')}${th('comuna', 'Comuna')}<th>Distribuidora</th>${th('kwhDay', 'Consumo hoy', 1)}${th('month', 'Proyección mes', 1)}${th('saving', 'Ahorro', 1)}<th>Equipo</th>${th('lastMin', 'Última actividad')}${th('alerts', 'Alertas', 1)}</tr></thead><tbody>` +
      (rows.length ? rows.map(c => `<tr class="click" tabindex="0" data-cid="${c.id}"><td><b class="num">${c.id}</b></td><td>${c.tipo}${c.rubro ? ' · ' + c.rubro : ''}</td><td>${c.comuna}</td><td>${V.DISTRIBUIDORAS.find(d => d.id === c.dist).name}</td><td class="r num">${fmt(c.kwhDay, 1)} kWh</td><td class="r num">${clp(c.month)}</td><td class="r num">${fmt(c.saving, 1)}%</td><td>${statusHTML(c)}</td><td>${c.online ? 'hace ' + ago(c.lastMin) : 'hace ' + ago(c.lastMin)}</td><td class="r">${c.alerts ? `<span class="pill ${c.online ? 'warn' : 'bad'}">${c.alerts}</span>` : '<span class="k-sub">—</span>'}</td></tr>`).join('')
        : `<tr><td colspan="10" class="empty">Ningún cliente coincide con "${esc(cliQ)}". Prueba con un código como VT-014 o una comuna.</td></tr>`) + '</tbody>';
    labelTables(tbl.parentNode);
    $$('th button', tbl).forEach(b => b.addEventListener('click', () => { const k = b.dataset.k; cliSort = { k, dir: cliSort.k === k ? -cliSort.dir : (['id', 'tipo', 'comuna', 'lastMin'].includes(k) ? 1 : -1) }; paintClientes(); const nb = $(`th button[data-k="${k}"]`, tbl); nb && nb.focus(); }));
    $$('tr[data-cid]', tbl).forEach(tr => {
      tr.addEventListener('click', () => openClient(tr.dataset.cid, tr));
      tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openClient(tr.dataset.cid, tr); } });
    });
  }

  /* ---- Detalle de cliente (panel lateral) ---- */
  let lastFocus = null;
  const MIXC = ['var(--s4)', 'var(--s5)', 'var(--s1)', 'var(--s2)', 'var(--s6)'];
  function openClient(id, fromEl) {
    const c = CL.find(x => x.id === id); if (!c) return;
    lastFocus = fromEl || document.activeElement;
    const host = $('#drawerHost');
    const tot = c.mix.reduce((s, m) => s + m[1], 0);
    const evs = [[c.online ? 'hace ' + ago(c.lastMin) : 'hace ' + ago(c.lastMin), c.online ? c.lastAct : 'El equipo dejó de enviar datos'], ['ayer, 21:40', 'Pico de consumo del día'], ['hace ' + c.days + ' días', 'Instalación completada']];
    host.innerHTML = `<div class="drawer-back" id="dBack"></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="dTitle">
      <div class="drawer-h"><div><h2 id="dTitle" class="num">${c.id}</h2><p>${c.tipo}${c.rubro ? ' · ' + c.rubro : ''} · ${c.comuna} · ${V.DISTRIBUIDORAS.find(d => d.id === c.dist).name}</p></div><button class="iconbtn" type="button" id="dClose" aria-label="Cerrar detalle">${icon('x')}</button></div>
      ${statusHTML(c)}
      <section><h3>Resumen</h3><div class="facts">
        <div><b>${fmt(c.kwhDay, 1)} kWh</b><span>Consumo hoy</span></div><div><b>${clp(c.month)}</b><span>Proyección del mes</span></div>
        <div><b>${fmt(c.saving, 1)}%</b><span>Ahorro vs. antes</span></div><div><b>${c.days} días</b><span>Con Vatia</span></div>
      </div></section>
      <section><h3>En qué se va su consumo</h3><div class="mixbar">${c.mix.map((m, i) => `<i style="flex:${m[1]};background:${MIXC[i % MIXC.length]}"></i>`).join('')}</div>
        <div class="mixleg">${c.mix.map((m, i) => `<span><i style="background:${MIXC[i % MIXC.length]}"></i>${m[0]}</span><b class="num">${fmt(m[1] / tot * 100)}%</b>`).join('')}</div></section>
      <section><h3>Actividad reciente</h3><ul class="activity">${evs.map(e => `<li><time>${e[0]}</time><span>${e[1]}</span></li>`).join('')}</ul></section>
      <section><h3>Equipo</h3><div class="facts"><div><b>${c.fw}</b><span>Firmware</span></div><div><b>${c.online ? 'Buena' : 'Sin señal'}</b><span>Conexión WiFi</span></div></div></section>
      <section style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary btn-small" type="button" id="dVisit">Agendar visita técnica</button><button class="btn btn-ghost btn-small" type="button" id="dContact">Ver datos de contacto</button></section>
      <p class="privacy-note" id="dNote">${icon('lock')}<span>Los datos de contacto requieren el rol de soporte y quedan registrados en la bitácora de accesos.</span></p>
    </aside>`;
    const back = $('#dBack'), dr = $('.drawer', host);
    requestAnimationFrame(() => requestAnimationFrame(() => { back.classList.add('show'); dr.classList.add('show'); }));
    $('#dClose').focus();
    const close = () => { back.classList.remove('show'); dr.classList.remove('show'); document.removeEventListener('keydown', onKey); setTimeout(() => { host.innerHTML = ''; }, 300); lastFocus && lastFocus.focus && lastFocus.focus(); };
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('button, a, input, [tabindex="0"]', dr); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', onKey);
    back.addEventListener('click', close); $('#dClose').addEventListener('click', close);
    $('#dVisit').addEventListener('click', () => toast('Visita propuesta', `Para ${c.id}. En la alfa no se agenda de verdad.`, 'OK', 'var(--good)'));
    $('#dContact').addEventListener('click', () => toast('Acceso restringido', 'Tu rol no puede ver datos de contacto. Pídelo a soporte con un motivo.', '!', 'var(--warn)'));
  }

  /* ---- Equipos ---- */
  function equiposHTML() {
    const v42 = CL.filter(c => c.fw === 'v0.4.2').length, v41 = CL.length - v42;
    const sorted = CL.slice().sort((a, b) => (a.online === b.online ? b.lastMin - a.lastMin : a.online ? 1 : -1));
    return `<div class="grid-2" style="margin-top:0">
      <section class="panel"><div class="panel-h"><h2>Firmware</h2><span>${v42} de ${CL.length} actualizados</span></div>
        <div class="fwbar" role="img" aria-label="${v42} equipos en v0.4.2 y ${v41} en v0.4.1"><i style="flex:${v42};background:var(--good)"></i><i style="flex:${v41};background:var(--warn)"></i></div>
        <div class="goal-legend"><span><b>${v42}</b> en v0.4.2</span><span><b>${v41}</b> en v0.4.1 (actualización pendiente)</span></div></section>
      <section class="panel"><div class="panel-h"><h2>Conexión</h2><span>Últimos datos recibidos</span></div>
        <div class="goal-legend"><span><b>${CL.filter(c => c.online).length}</b> en línea</span><span><b>${CL.filter(c => !c.online).length}</b> sin señal</span><span>Un equipo sin señal guarda sus mediciones y las envía al volver.</span></div></section>
    </div>
    <div class="tablewrap" style="margin-top:20px"><table class="data"><thead><tr><th>Equipo</th><th>Cliente</th><th>Comuna</th><th>Estado</th><th>Último dato</th><th>Firmware</th></tr></thead><tbody>
      ${sorted.map((c, i) => `<tr><td class="num">VS-${String(101 + i)}</td><td class="num">${c.id}</td><td>${c.comuna}</td><td>${statusHTML(c)}</td><td>hace ${ago(c.lastMin)}</td><td>${c.fw === 'v0.4.2' ? c.fw : `<span class="pill warn">${c.fw}</span>`}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  /* ---- Negocio ---- */
  function negocioHTML() {
    const inv = CL.length * 52000;
    const months = inv / mrr;
    return `<div class="kpis" style="grid-template-columns:repeat(4,minmax(0,1fr))">
      ${kpi('Ingreso mensual', clp(mrr), `${CL.filter(c => c.tipo === 'Hogar').length} × $3.990 + ${CL.filter(c => c.tipo === 'Pyme').length} × $9.990`)}
      ${kpi('Inversión instalada', clp(inv), '$42.000 equipo + $10.000 instalación')}
      ${kpi('Recuperación', fmt(months, 1) + ' meses', 'Con los clientes actuales')}
      ${kpi('Bajas', '0', 'Desde el inicio del piloto')}
    </div>
    <div class="grid-2">
      <section class="panel chart"><div class="panel-h"><h2>Instalaciones por semana</h2><span>Últimas 8 semanas</span></div><div id="instChart"></div></section>
      <section class="panel"><div class="panel-h"><h2>Por tipo de cliente</h2></div>
        <div class="mixbar" style="height:16px"><i style="flex:${CL.filter(c => c.tipo === 'Hogar').length * 3990};background:var(--accent)"></i><i style="flex:${CL.filter(c => c.tipo === 'Pyme').length * 9990};background:var(--s1)"></i></div>
        <div class="mixleg"><span><i style="background:var(--accent)"></i>Hogares</span><b class="num">${clp(CL.filter(c => c.tipo === 'Hogar').length * 3990)}</b><span><i style="background:var(--s1)"></i>Pymes</span><b class="num">${clp(CL.filter(c => c.tipo === 'Pyme').length * 9990)}</b></div>
        <p class="k-sub" style="margin-top:14px">Las pymes son el 19% de los clientes y el 37% del ingreso.</p></section>
    </div>
    <p class="privacy-note">${icon('alert')}<span>Precios y costos son estimaciones del equipo, a validar en el piloto.</span></p>`;
  }
  function drawInstalls() {
    const host = $('#instChart'); if (!host) return;
    const weeks = new Array(8).fill(0);
    CL.forEach(c => { const w = Math.min(7, Math.floor(c.days / 7)); weeks[7 - w]++; });
    const W = chartW(host, 560), H = W < 500 ? 200 : 220, L = 34, R = 8, T = 16, B = 26, ymax = Math.max(...weeks) + 1;
    const bw = (W - L - R) / 8;
    const y = v => T + (H - T - B) * (1 - v / ymax);
    let g = '';
    for (let v = 0; v <= ymax; v += 2) g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    const bars = weeks.map((v, i) => `<rect x="${L + i * bw + 6}" y="${y(v)}" width="${bw - 12}" height="${y(0) - y(v)}" rx="3" fill="${i === 7 ? 'var(--accent)' : 'var(--s1)'}" fill-opacity="${i === 7 ? 1 : .75}"/><text class="ax" x="${L + i * bw + bw / 2}" y="${y(v) - 6}" text-anchor="middle">${v}</text><text class="ax" x="${L + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${i === 7 ? 'esta' : 'S' + (i + 1)}</text>`).join('');
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Instalaciones por semana: ${weeks.join(', ')}">${g}${bars}</svg>`;
  }

  /* ---------------- Seguridad ---------------- */
  const BETA = [
    ['Inicio de sesión con doble verificación para el equipo', 'Pendiente'], ['Cada cliente ve solo su casa (permisos por cuenta)', 'Diseñado'],
    ['Cifrado de mediciones en tránsito y guardadas', 'Diseñado'], ['Bitácora de quién accede a datos de contacto', 'Pendiente'],
    ['Respaldo diario y prueba de recuperación', 'Pendiente'], ['Política de privacidad revisada por un abogado', 'Pendiente'],
    ['Revisión de seguridad externa antes del piloto', 'Pendiente'], ['Certificación SEC del equipo de tablero', 'Pendiente']
  ];
  $('#betaList').innerHTML = BETA.map(([t, s]) => `<li><span>${t}</span><span class="pill ${s === 'Diseñado' ? 'on' : ''}">${s}</span></li>`).join('');
  $$('[data-jump]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.getElementById(a.dataset.jump);
    const d = a.closest('details'); if (d) d.open = false;
    if (t) { t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }));

  /* ---------------- Reloj de la simulación ---------------- */
  function redrawCharts() { if (current === 'casa' && casaPane === 'resumen') drawLive(); if (current === 'ceo') { drawDemand(); drawInstalls(); } }
  const ACT_POOL = ['Termo pausado para evitar sobrecarga', 'Revisó sus recomendaciones', 'Aviso de consumo fantasma', 'Fue a pagar su cuenta', 'Nuevo aparato reconocido: microondas', 'Activó programación del termo', 'Volvió la señal del equipo'];
  let actN = 0;
  setInterval(() => {
    if (document.hidden) return;
    stepSim(current !== 'casa');
    Object.keys(sim.flash).forEach(k => { sim.flash[k]--; if (sim.flash[k] <= 0) delete sim.flash[k]; });
    if (current === 'casa' && casaPane === 'resumen') updateResumen();
    if (current === 'inicio') updateHero();
    if (current === 'casa' && casaPane === 'aparatos' && sim.tick % 3 === 0) renderApTable();
    if (sim.tick % 6 === 0) {
      actN++;
      const c = CL[(actN * 7) % CL.length];
      const d = new Date(); d.setHours(20, 31 + actN);
      activity.unshift([d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false }), c.id, ACT_POOL[actN % ACT_POOL.length]]);
      if (current === 'ceo' && ceoPane === 'general') paintActivity(true);
    }
  }, 1000);

  route();
})();
