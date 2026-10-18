// Vatia — panel interno (CEO). Datos de ejemplo para la demo de Gearbox.
(() => {
  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");

  /* ---------- Stat cards ---------- */
  const stats = [
    { label: "Clientes activos", value: "184", delta: "+12% vs mes anterior", dir: "up" },
    { label: "Ingreso recurrente (MRR)", value: clp(2450000), delta: "+8% vs mes anterior", dir: "up" },
    { label: "Unidades instaladas", value: "212", delta: "+15 este mes", dir: "up" },
    { label: "Tasa de abandono", value: "2.1%", delta: "−0.4 pp vs mes anterior", dir: "up" },
  ];

  const statGrid = document.getElementById("statGrid");
  stats.forEach((s) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-delta ${s.dir}">${s.dir === "up" ? "↑" : "↓"} ${s.delta}</div>`;
    statGrid.appendChild(card);
  });

  /* ---------- Growth chart ---------- */
  const months = [
    { label: "Mar", value: 98 },
    { label: "Abr", value: 121 },
    { label: "May", value: 138 },
    { label: "Jun", value: 155 },
    { label: "Jul", value: 168 },
    { label: "Ago", value: 184 },
  ];
  const chart = document.getElementById("growthChart");
  const max = Math.max(...months.map((m) => m.value));
  months.forEach((m, i) => {
    const col = document.createElement("div");
    col.className = "chart-col";
    const pct = Math.round((m.value / max) * 100);
    col.innerHTML = `
      <div class="chart-bar" style="height:0%" data-h="${pct}"></div>
      <div class="chart-label">${m.label}</div>`;
    chart.appendChild(col);
    requestAnimationFrame(() => {
      setTimeout(() => {
        col.querySelector(".chart-bar").style.height = pct + "%";
      }, i * 70);
    });
  });

  /* ---------- Alerts ---------- */
  const alerts = [
    { level: "crit", text: "Sensor #084 (Villa Las Encinas): batería de respaldo al 18%", time: "Hace 12 min" },
    { level: "warn", text: "12 sensores sin reportar datos hace más de 24 h", time: "Hace 1 h" },
    { level: "warn", text: "Circuito \"Cocina\" del cliente #142 al 92% de su capacidad", time: "Hace 3 h" },
    { level: "info", text: "Actualización de firmware disponible para 56 unidades", time: "Hoy" },
  ];
  const alertList = document.getElementById("alertList");
  alerts.forEach((a) => {
    const row = document.createElement("div");
    row.className = "alert-item";
    row.innerHTML = `
      <span class="alert-dot ${a.level}"></span>
      <div>
        <div class="alert-text">${a.text}</div>
        <div class="alert-time">${a.time}</div>
      </div>`;
    alertList.appendChild(row);
  });
  document.getElementById("alertCount").textContent = `${alerts.length} activas`;
  document.getElementById("alertBadge").textContent = alerts.filter(a => a.level === "crit").length || "";
  if (!alerts.some(a => a.level === "crit")) document.getElementById("alertBadge").style.display = "none";

  /* ---------- Installs table ---------- */
  const installs = [
    { name: "Minimarket Don Luis", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Concepción", date: "14 oct 2026", status: "ok" },
    { name: "Familia Soto Reyes", sub: "Hogar", plan: "Comodato", comuna: "Talcahuano", date: "13 oct 2026", status: "ok" },
    { name: "Panadería Santa Fe", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Chiguayante", date: "12 oct 2026", status: "pending" },
    { name: "SolarTech Biobío (alianza)", sub: "Instalador", plan: "Alianza solar", comuna: "Hualpén", date: "10 oct 2026", status: "ok" },
    { name: "Familia Muñoz Vidal", sub: "Hogar", plan: "Comodato", comuna: "San Pedro de la Paz", date: "9 oct 2026", status: "offline" },
    { name: "Ferretería El Tornillo", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Coronel", date: "7 oct 2026", status: "ok" },
    { name: "Familia Araya Pino", sub: "Hogar", plan: "Comodato", comuna: "Los Ángeles", date: "5 oct 2026", status: "ok" },
    { name: "Farmacia Vida Sur", sub: "Pyme", plan: "Suscripción + equipo", comuna: "Concepción", date: "3 oct 2026", status: "pending" },
  ];

  const statusLabel = { ok: "En línea", pending: "Instalando", offline: "Sin señal" };
  const tbody = document.getElementById("installsBody");
  installs.forEach((i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><div class="cell-name">${i.name}</div><div class="cell-sub">${i.sub}</div></td>
      <td>${i.plan}</td>
      <td>${i.comuna}</td>
      <td>${i.date}</td>
      <td><span class="status-pill ${i.status}">${statusLabel[i.status]}</span></td>`;
    tbody.appendChild(tr);
  });

  /* ---------- Revenue split ---------- */
  const revenue = [
    { name: "Comodato (hogares)", amount: 1180000, color: "var(--accent)" },
    { name: "Suscripción + equipo (pymes)", amount: 980000, color: "var(--accent-2)" },
    { name: "Alianza instaladores solares", amount: 290000, color: "#8b7bff" },
  ];
  const total = revenue.reduce((s, r) => s + r.amount, 0);
  document.getElementById("mrrTotal").textContent = `Total: ${clp(total)}/mes`;

  const track = document.createElement("div");
  track.className = "split-track";
  revenue.forEach((r) => {
    const seg = document.createElement("div");
    seg.className = "split-seg";
    seg.style.width = Math.round((r.amount / total) * 100) + "%";
    seg.style.background = r.color;
    track.appendChild(seg);
  });

  const splitWrap = document.getElementById("revenueSplit");
  splitWrap.appendChild(track);
  const legend = document.createElement("div");
  legend.style.display = "grid";
  legend.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";
  legend.style.gap = "10px";
  legend.style.marginTop = "4px";
  revenue.forEach((r) => {
    const item = document.createElement("div");
    item.className = "split-row-top";
    item.innerHTML = `<span style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:50%;background:${r.color};display:inline-block;"></span>${r.name}</span><span>${clp(r.amount)}</span>`;
    legend.appendChild(item);
  });
  splitWrap.appendChild(legend);
})();
