// Vatia — panel interno (CEO). Datos de ejemplo para la demo de Gearbox.
(() => {
  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");

  /* ---------- Datos por período ---------- */
  const PERIODS = {
    "1m": {
      stats: [
        { label: "Clientes activos", value: "184", delta: "+15 nuevos este mes", dir: "up" },
        { label: "Ingreso del mes", value: clp(2450000), delta: "+8% vs mes anterior", dir: "up" },
        { label: "Unidades instaladas", value: "15", delta: "en octubre", dir: "up" },
        { label: "Tasa de abandono", value: "0.4%", delta: "este mes", dir: "up" },
      ],
      chart: [
        { label: "Sem 1", value: 171 },
        { label: "Sem 2", value: 176 },
        { label: "Sem 3", value: 180 },
        { label: "Sem 4", value: 184 },
      ],
      revenue: [
        { name: "Comodato (hogares)", amount: 1180000, color: "var(--accent)" },
        { name: "Suscripción + equipo (pymes)", amount: 980000, color: "var(--accent-2)" },
        { name: "Alianza instaladores solares", amount: 290000, color: "#8b7bff" },
      ],
    },
    "3m": {
      stats: [
        { label: "Clientes activos", value: "184", delta: "+46 en 3 meses", dir: "up" },
        { label: "Ingreso del trimestre", value: clp(6980000), delta: "+22% vs trimestre anterior", dir: "up" },
        { label: "Unidades instaladas", value: "52", delta: "en el trimestre", dir: "up" },
        { label: "Tasa de abandono", value: "1.3%", delta: "acumulada", dir: "up" },
      ],
      chart: [
        { label: "Jun", value: 155 },
        { label: "Jul", value: 168 },
        { label: "Ago", value: 184 },
      ],
      revenue: [
        { name: "Comodato (hogares)", amount: 3350000, color: "var(--accent)" },
        { name: "Suscripción + equipo (pymes)", amount: 2800000, color: "var(--accent-2)" },
        { name: "Alianza instaladores solares", amount: 830000, color: "#8b7bff" },
      ],
    },
    "6m": {
      stats: [
        { label: "Clientes activos", value: "184", delta: "+88% en 6 meses", dir: "up" },
        { label: "Ingreso del semestre", value: clp(13400000), delta: "+87% vs semestre anterior", dir: "up" },
        { label: "Unidades instaladas", value: "114", delta: "en el semestre", dir: "up" },
        { label: "Tasa de abandono", value: "2.1%", delta: "acumulada", dir: "up" },
      ],
      chart: [
        { label: "Mar", value: 98 },
        { label: "Abr", value: 121 },
        { label: "May", value: 138 },
        { label: "Jun", value: 155 },
        { label: "Jul", value: 168 },
        { label: "Ago", value: 184 },
      ],
      revenue: [
        { name: "Comodato (hogares)", amount: 6400000, color: "var(--accent)" },
        { name: "Suscripción + equipo (pymes)", amount: 5400000, color: "var(--accent-2)" },
        { name: "Alianza instaladores solares", amount: 1600000, color: "#8b7bff" },
      ],
    },
  };

  const statGrid = document.getElementById("statGrid");
  function renderStats(period) {
    statGrid.innerHTML = "";
    PERIODS[period].stats.forEach((s) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML = `
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-delta ${s.dir}">${s.dir === "up" ? "↑" : "↓"} ${s.delta}</div>`;
      statGrid.appendChild(card);
    });
  }

  /* ---------- Growth chart (con valores visibles) ---------- */
  const chartEl = document.getElementById("growthChart");
  function renderChart(period) {
    const months = PERIODS[period].chart;
    chartEl.innerHTML = "";
    const max = Math.max(...months.map((m) => m.value));
    months.forEach((m, i) => {
      const col = document.createElement("div");
      col.className = "chart-col";
      const pct = Math.round((m.value / max) * 100);
      col.innerHTML = `
        <div class="chart-value">${m.value}</div>
        <div class="chart-bar" style="height:0%"></div>
        <div class="chart-label">${m.label}</div>`;
      chartEl.appendChild(col);
      requestAnimationFrame(() => {
        setTimeout(() => {
          col.querySelector(".chart-bar").style.height = pct + "%";
        }, i * 70);
      });
    });
  }

  /* ---------- Revenue split ---------- */
  const splitWrap = document.getElementById("revenueSplit");
  const mrrTotal = document.getElementById("mrrTotal");
  function renderRevenue(period) {
    const revenue = PERIODS[period].revenue;
    const total = revenue.reduce((s, r) => s + r.amount, 0);
    const periodLabel = { "1m": "este mes", "3m": "estos 3 meses", "6m": "estos 6 meses" }[period];
    mrrTotal.textContent = `Total ${periodLabel}: ${clp(total)}`;

    splitWrap.innerHTML = "";
    const track = document.createElement("div");
    track.className = "split-track";
    revenue.forEach((r) => {
      const seg = document.createElement("div");
      seg.className = "split-seg";
      seg.style.width = Math.round((r.amount / total) * 100) + "%";
      seg.style.background = r.color;
      track.appendChild(seg);
    });
    splitWrap.appendChild(track);

    const legend = document.createElement("div");
    legend.className = "split-legend";
    revenue.forEach((r) => {
      const item = document.createElement("div");
      item.className = "split-row-top";
      item.innerHTML = `<span style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:50%;background:${r.color};display:inline-block;"></span>${r.name}</span><span>${clp(r.amount)}</span>`;
      legend.appendChild(item);
    });
    splitWrap.appendChild(legend);
  }

  /* ---------- Selector de período ---------- */
  function renderPeriod(period) {
    renderStats(period);
    renderChart(period);
    renderRevenue(period);
  }
  const periodSelect = document.getElementById("periodSelect");
  periodSelect.addEventListener("change", () => renderPeriod(periodSelect.value));
  renderPeriod(periodSelect.value);

  /* ---------- Alertas (clic para ver detalle) ---------- */
  const alerts = [
    { level: "crit", text: "Sensor #084 (Villa Las Encinas): batería de respaldo al 18%", time: "Hace 12 min",
      detail: "El sensor lleva 6 horas funcionando con la batería de respaldo porque el circuito principal no entrega los 5V que necesita. Si baja del 10% dejará de reportar datos. Conviene agendar una visita técnica esta semana." },
    { level: "warn", text: "12 sensores sin reportar datos hace más de 24 h", time: "Hace 1 h",
      detail: "Los 12 sensores están repartidos en Talcahuano (5), Coronel (4) y Los Ángeles (3). La causa más probable es un corte de WiFi en esas zonas. Si no vuelven a reportar en 24 h más, hay que contactar a cada cliente." },
    { level: "warn", text: "Circuito \"Cocina\" del cliente #142 al 92% de su capacidad", time: "Hace 3 h",
      detail: "Panadería Santa Fe (cliente #142) tuvo un pico de 92% de capacidad en el circuito de cocina entre las 7:00 y 9:00 AM, probablemente por el horno y la batidora funcionando juntos. Vale la pena sugerirles separar esos consumos." },
    { level: "info", text: "Actualización de firmware disponible para 56 unidades", time: "Hoy",
      detail: "La versión 2.3.1 mejora la detección de hervidores y termos, y corrige un bug menor de reconexión WiFi. Se puede enviar por OTA sin visita técnica; toma unos 3 minutos por unidad y el sensor sigue midiendo mientras se actualiza." },
  ];
  const alertList = document.getElementById("alertList");
  alertList.innerHTML = "";
  alerts.forEach((a) => {
    const row = document.createElement("div");
    row.className = "alert-item notif-item";
    row.innerHTML = `
      <span class="alert-dot ${a.level}"></span>
      <div class="notif-body">
        <div class="alert-text">${a.text}</div>
        <div class="alert-time">${a.time}</div>
        <div class="notif-detail" hidden>${a.detail}</div>
      </div>`;
    row.addEventListener("click", () => {
      row.querySelector(".notif-detail").hidden = !row.querySelector(".notif-detail").hidden;
    });
    alertList.appendChild(row);
  });
  document.getElementById("alertCount").textContent = `${alerts.length} activas`;
  const alertBadge = document.getElementById("alertBadge");
  const critCount = alerts.filter((a) => a.level === "crit").length;
  alertBadge.textContent = critCount || "";
  if (!critCount) alertBadge.style.display = "none";

  /* ---------- Instalaciones: tabla + buscador + filtros ---------- */
  const installs = [
    { name: "Minimarket Don Luis", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Concepción", date: "14 oct 2026", status: "ok" },
    { name: "Familia Soto Reyes", sub: "Hogar", plan: "Comodato", comuna: "Talcahuano", date: "13 oct 2026", status: "ok" },
    { name: "Panadería Santa Fe", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Chiguayante", date: "12 oct 2026", status: "pending" },
    { name: "SolarTech Biobío (alianza)", sub: "Instalador", plan: "Alianza solar", comuna: "Hualpén", date: "10 oct 2026", status: "ok" },
    { name: "Familia Muñoz Vidal", sub: "Hogar", plan: "Comodato", comuna: "San Pedro de la Paz", date: "9 oct 2026", status: "offline" },
    { name: "Ferretería El Tornillo", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Coronel", date: "7 oct 2026", status: "ok" },
    { name: "Familia Araya Pino", sub: "Hogar", plan: "Comodato", comuna: "Los Ángeles", date: "5 oct 2026", status: "ok" },
    { name: "Farmacia Vida Sur", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Concepción", date: "3 oct 2026", status: "pending" },
    { name: "Familia Pizarro Lagos", sub: "Hogar", plan: "Comodato", comuna: "Chillán", date: "1 oct 2026", status: "ok" },
    { name: "Taller Mecánico Rivas", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Talcahuano", date: "28 sep 2026", status: "ok" },
    { name: "EnergíaSur Instaladores", sub: "Instalador", plan: "Alianza solar", comuna: "Concepción", date: "25 sep 2026", status: "ok" },
    { name: "Familia Bravo Núñez", sub: "Hogar", plan: "Comodato", comuna: "San Pedro de la Paz", date: "22 sep 2026", status: "offline" },
  ];
  const statusLabel = { ok: "En línea", pending: "Instalando", offline: "Sin señal" };
  const tbody = document.getElementById("installsBody");
  const installsCount = document.getElementById("installsCount");
  const searchInput = document.getElementById("installSearch");
  const filterTipo = document.getElementById("filterTipo");
  const filterPlan = document.getElementById("filterPlan");

  function renderInstalls() {
    const q = searchInput.value.trim().toLowerCase();
    const tipo = filterTipo.value;
    const plan = filterPlan.value;
    const filtered = installs.filter((i) => {
      const matchesQuery = !q || i.name.toLowerCase().includes(q) || i.comuna.toLowerCase().includes(q);
      const matchesTipo = !tipo || i.sub === tipo;
      const matchesPlan = !plan || i.plan === plan;
      return matchesQuery && matchesTipo && matchesPlan;
    });
    tbody.innerHTML = "";
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-faint); padding:28px;">Sin resultados para ese filtro.</td></tr>`;
    } else {
      filtered.forEach((i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><div class="cell-name">${i.name}</div><div class="cell-sub">${i.sub}</div></td>
          <td>${i.plan}</td>
          <td>${i.comuna}</td>
          <td>${i.date}</td>
          <td><span class="status-pill ${i.status}">${statusLabel[i.status]}</span></td>`;
        tbody.appendChild(tr);
      });
    }
    installsCount.textContent = `${filtered.length} de ${installs.length}`;
  }
  [searchInput, filterTipo, filterPlan].forEach((el) => el.addEventListener("input", renderInstalls));
  renderInstalls();

  /* ---------- Configuración ---------- */
  const darkToggle = document.getElementById("cfgDarkToggle");
  darkToggle.checked = document.documentElement.getAttribute("data-theme") === "dark";
  darkToggle.addEventListener("change", () => {
    document.getElementById("themeToggle").click();
  });
  // mantener sincronizado si cambian el tema desde el botón del sidebar
  const observer = new MutationObserver(() => {
    darkToggle.checked = document.documentElement.getAttribute("data-theme") === "dark";
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  document.getElementById("ceoSettingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.getElementById("ceoSettingsNote");
    note.textContent = "Cambios guardados.";
    setTimeout(() => { note.textContent = ""; }, 2500);
  });
})();
