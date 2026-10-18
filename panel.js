// Vatia — panel de cliente (demo local, sin backend real)
(() => {
  const user = JSON.parse(localStorage.getItem("vatia-user") || "null");
  if (!user) {
    location.href = "cuenta.html";
    return;
  }

  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");
  const VOLTAGE = 220;

  const COMPANIES = {
    cge: { name: "CGE", url: "https://www.cge.cl" },
    enel: { name: "Enel", url: "https://www.enel.cl" },
    chilquinta: { name: "Chilquinta", url: "https://www.chilquinta.cl" },
    saesa: { name: "Saesa", url: "https://www.saesa.cl" },
    frontel: { name: "Frontel", url: "https://www.frontel.cl" },
  };

  /* ---------- Aparatos (ligados a un circuito) ---------- */
  const APPLIANCES = [
    { id: "refri",    name: "Refrigerador",    circuit: "c1", baseWatts: 151,  on: true,  variance: 0.15, cycle: true,  color: "#4fb0ff", today: 163 },
    { id: "hervidor", name: "Hervidor",        circuit: "c1", baseWatts: 1950, on: false, variance: 0,    cycle: false, color: "#ffb020", today: 141 },
    { id: "tv",       name: "Televisor",       circuit: "c2", baseWatts: 109,  on: true,  variance: 0.08, cycle: false, color: "#8b7bff", today: 43 },
    { id: "estufa",   name: "Estufa eléctrica", circuit: "c2", baseWatts: 2000, on: true,  variance: 0.3,  cycle: true,  color: "#ff6b8a", today: 661 },
    { id: "termo",    name: "Termo eléctrico", circuit: "c3", baseWatts: 1500, on: true,  variance: 0.05, cycle: false, color: "#19b79a", today: 95, controllable: true },
    { id: "otros",    name: "Otros",           circuit: "c2", baseWatts: 74,   on: true,  variance: 0.1,  cycle: false, color: "#9aa6b8", today: 89 },
  ];

  const CIRCUITS = [
    { id: "general", name: "General", amp: 25, desc: "Empalme 220 V", badge: null },
    { id: "c1", name: "C1", amp: 16, desc: "Cocina · Enchufes", badge: "PROTEGIDO" },
    { id: "c2", name: "C2", amp: 16, desc: "Living y dormitorios · Enchufes y luces", badge: null },
    { id: "c3", name: "C3", amp: 16, desc: "Termo · Circuito propio, con contactor", badge: "CON CONTROL" },
  ];

  /* ---------- Identidad ---------- */
  const company = COMPANIES[user.compania] || COMPANIES.cge;
  const firstName = (user.nombre || user.email || "Cliente Vatia").split(" ")[0];
  document.getElementById("homeTitle").textContent = user.nombre ? `Hola, ${firstName} 👋` : "Tu hogar";
  document.getElementById("homeSub").textContent = `${user.comuna || "Tu comuna"} · ${company.name} · plan ${user.tipo === "pyme" ? "Pyme" : "Hogar"}`;
  document.getElementById("sidebarUser").textContent = user.nombre || user.email;
  document.getElementById("logoutLink").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("vatia-user");
    location.href = "index.html";
  });

  /* ---------- Simulación de potencia en vivo ---------- */
  function currentWatts(a) {
    if (!a.on) return 0;
    let w = a.baseWatts;
    if (a.cycle) {
      // ciclo lento tipo termostato/compresor
      const phase = (Date.now() / 9000 + a.baseWatts) % (Math.PI * 2);
      w *= 0.55 + 0.45 * (Math.sin(phase) * 0.5 + 0.5);
    }
    w *= 1 + (Math.random() - 0.5) * a.variance;
    return Math.max(0, w);
  }

  /* ---------- Stat cards ---------- */
  const statGrid = document.getElementById("statGrid");
  function renderStats() {
    const watts = APPLIANCES.reduce((s, a) => s + currentWatts(a), 0);
    const onCount = APPLIANCES.filter((a) => a.on).length;
    const todayCost = APPLIANCES.reduce((s, a) => s + a.today, 0);
    const todayKwh = todayCost / 195;
    const monthProjection = 71600;
    const amps = watts / VOLTAGE;
    const ampPct = Math.min(100, Math.round((amps / 25) * 100));

    statGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Potencia actual</div>
        <div class="stat-value">${Math.round(watts).toLocaleString("es-CL")}<small class="stat-unit">W</small></div>
        <div class="stat-delta">${onCount} aparatos encendidos</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Consumo de hoy</div>
        <div class="stat-value">${clp(todayCost)}</div>
        <div class="stat-delta">${todayKwh.toFixed(1)} kWh desde las 00:00</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Proyección del mes</div>
        <div class="stat-value">${clp(monthProjection)}</div>
        <div class="stat-delta up">↑ +9,8% vs mes anterior (${clp(65200)})</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Amperaje / límite general</div>
        <div class="stat-value">${amps.toFixed(1)}<small class="stat-unit">/ 25 A</small></div>
        <div class="amp-track"><div class="amp-fill" style="width:${ampPct}%"></div></div>
      </div>`;
  }

  /* ---------- Tu tablero (circuitos) ---------- */
  const breakerGrid = document.getElementById("breakerGrid");
  function circuitAmps(circuitId) {
    if (circuitId === "general") return APPLIANCES.reduce((s, a) => s + currentWatts(a), 0) / VOLTAGE;
    return APPLIANCES.filter((a) => a.circuit === circuitId).reduce((s, a) => s + currentWatts(a), 0) / VOLTAGE;
  }
  function renderBreakers() {
    breakerGrid.innerHTML = "";
    CIRCUITS.forEach((c) => {
      const amps = circuitAmps(c.id);
      const pct = Math.min(100, Math.round((amps / c.amp) * 100));
      const card = document.createElement("button");
      card.type = "button";
      card.className = "breaker-card" + (c.id === "general" ? " breaker-card-general" : "");
      card.innerHTML = `
        <div class="breaker-card-top">
          <span class="breaker-card-name">${c.name}</span>
          <span class="breaker-card-amp">${c.amp} A</span>
        </div>
        <div class="amp-track"><div class="amp-fill" style="width:${pct}%"></div></div>
        <div class="breaker-card-value">${amps.toFixed(1)} A</div>
        <div class="breaker-card-desc">${c.desc}</div>
        ${c.badge ? `<span class="breaker-card-badge ${c.badge === "CON CONTROL" ? "with-control" : ""}">${c.badge}</span>` : ""}`;
      card.addEventListener("click", () => {
        document.querySelectorAll(".appliance-live-item").forEach((el) => {
          el.classList.toggle("highlight", el.dataset.circuit === c.id && c.id !== "general");
        });
        document.getElementById("aparatos").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      breakerGrid.appendChild(card);
    });
  }

  /* ---------- Aparatos (lista) ---------- */
  const applianceLiveList = document.getElementById("applianceLiveList");
  const circuitLabel = { c1: "Cocina", c2: "Living y dormitorios", c3: "Circuito propio · con control" };

  // Se construye una sola vez: así el interruptor no se destruye en cada
  // actualización y no pierde el foco ni los listeners mientras alguien lo usa.
  function buildApplianceList() {
    applianceLiveList.innerHTML = "";
    APPLIANCES.forEach((a) => {
      const li = document.createElement("li");
      li.className = "appliance-live-item";
      li.dataset.circuit = a.circuit;
      li.innerHTML = `
        <span class="appliance-dot" style="background:${a.color}"></span>
        <div class="appliance-live-main">
          <div class="appliance-name">${a.name}</div>
          <div class="appliance-meta">${circuitLabel[a.circuit]} · hoy ${clp(a.today)}</div>
        </div>
        <div class="appliance-live-right">
          <div class="appliance-watts" data-watts></div>
          ${a.controllable
            ? `<button type="button" class="switch ${a.on ? "on" : ""}" role="switch" aria-checked="${a.on}" aria-label="Encender o apagar ${a.name}"><span class="switch-knob"></span></button>`
            : `<span class="status-pill ${a.on ? "ok" : "offline"}" data-status>${a.on ? "ENCENDIDO" : "APAGADO"}</span>`
          }
        </div>`;
      if (a.controllable) {
        li.querySelector(".switch").addEventListener("click", (e) => {
          a.on = !a.on;
          e.currentTarget.classList.toggle("on", a.on);
          e.currentTarget.setAttribute("aria-checked", String(a.on));
          const pill = li.querySelector("[data-status]");
          if (pill) { pill.textContent = a.on ? "ENCENDIDO" : "APAGADO"; pill.className = `status-pill ${a.on ? "ok" : "offline"}`; }
        });
      }
      applianceLiveList.appendChild(li);
    });
  }

  function updateApplianceList() {
    const rows = applianceLiveList.querySelectorAll(".appliance-live-item");
    rows.forEach((row, i) => {
      const a = APPLIANCES[i];
      row.querySelector("[data-watts]").textContent = `${Math.round(currentWatts(a))} W`;
      const pill = row.querySelector("[data-status]");
      if (pill) { pill.textContent = a.on ? "ENCENDIDO" : "APAGADO"; pill.className = `status-pill ${a.on ? "ok" : "offline"}`; }
    });
  }

  /* ---------- Gráfico de potencia en vivo (SVG, área apilada) ---------- */
  const chartSvg = document.getElementById("liveChart");
  const chartLegend = document.getElementById("chartLegend");
  const W = 640, H = 220, PAD_L = 38, PAD_R = 8, PAD_T = 14, PAD_B = 24;
  const POINTS = 40;
  const LIMIT_KW = 25 * VOLTAGE / 1000;
  let history = [];

  function seedHistory() {
    history = [];
    for (let i = 0; i < POINTS; i++) {
      history.push(APPLIANCES.map((a) => currentWatts(a)));
    }
  }

  function buildChart() {
    const maxStack = Math.max(LIMIT_KW * 1000 * 1.1, ...history.map((row) => row.reduce((s, w) => s + w, 0)));
    const x = (i) => PAD_L + (i / (POINTS - 1)) * (W - PAD_L - PAD_R);
    const y = (watts) => H - PAD_B - (watts / maxStack) * (H - PAD_T - PAD_B);

    let svg = "";

    // gridlines + y labels
    const steps = 3;
    for (let s = 0; s <= steps; s++) {
      const kw = (maxStack / 1000) * (s / steps);
      const yy = y(kw * 1000);
      svg += `<line x1="${PAD_L}" y1="${yy}" x2="${W - PAD_R}" y2="${yy}" stroke="var(--border)" stroke-width="1"/>`;
      svg += `<text x="${PAD_L - 8}" y="${yy + 3}" text-anchor="end" class="chart-axis-label">${kw.toFixed(0)} kW</text>`;
    }

    // stacked areas
    let cum = new Array(POINTS).fill(0);
    APPLIANCES.forEach((a, idx) => {
      const topPts = history.map((row, i) => { cum[i] += row[idx]; return [x(i), y(cum[i])]; });
      const prevCum = new Array(POINTS).fill(0);
      for (let i = 0; i < POINTS; i++) prevCum[i] = cum[i] - history[i][idx];
      const bottomPts = prevCum.map((v, i) => [x(i), y(v)]).reverse();
      const d = "M" + topPts.map((p) => p.join(",")).join("L") + "L" + bottomPts.map((p) => p.join(",")).join("L") + "Z";
      svg += `<path d="${d}" fill="${a.color}" fill-opacity="0.82"/>`;
    });

    // límite del automático general
    const limitY = y(LIMIT_KW * 1000);
    svg += `<line x1="${PAD_L}" y1="${limitY}" x2="${W - PAD_R}" y2="${limitY}" stroke="var(--danger)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    svg += `<text x="${W - PAD_R}" y="${limitY - 6}" text-anchor="end" class="chart-limit-label">Límite del automático · 25 A</text>`;

    // punto "ahora"
    const lastX = x(POINTS - 1), lastY = y(cum[POINTS - 1]);
    svg += `<circle cx="${lastX}" cy="${lastY}" r="3.5" fill="var(--text)"/>`;

    // x labels
    svg += `<text x="${x(0)}" y="${H - 6}" text-anchor="start" class="chart-axis-label">-30 min</text>`;
    svg += `<text x="${x(POINTS / 2)}" y="${H - 6}" text-anchor="middle" class="chart-axis-label">-15 min</text>`;
    svg += `<text x="${x(POINTS - 1)}" y="${H - 6}" text-anchor="end" class="chart-axis-label">ahora</text>`;

    chartSvg.innerHTML = svg;
  }

  function renderLegend() {
    chartLegend.innerHTML = APPLIANCES.map((a) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${a.color}"></span>${a.name}</span>`
    ).join("");
  }

  /* ---------- Ahorro ---------- */
  const tips = [
    { title: "Tu estufa es el 32% de tu cuenta", text: "Bajar 1 hora diaria de uso te ahorraría cerca de $8.800 al mes.", save: 8800 },
    { title: "El termo se mantiene caliente toda la noche", text: "Prográmalo para calentar solo 2 horas antes de ducharte y ahorra cerca de $5.200 al mes.", save: 5200 },
    { title: "Tu refrigerador consume 10% más que el promedio", text: "Revisa el sello de la puerta y limpia la parrilla trasera.", save: 2100 },
  ];
  function renderTips() {
    const total = tips.reduce((s, t) => s + t.save, 0);
    document.getElementById("ahorroTotal").textContent = `Hasta ${clp(total)}/mes si aplicas todo`;
    document.getElementById("tipList").innerHTML = tips.map((t) => `
      <li class="tip-item">
        <div>
          <div class="tip-title">${t.title}</div>
          <p>${t.text}</p>
        </div>
        <div class="tip-save">${clp(t.save)}<span>/mes</span></div>
      </li>`).join("");
  }

  /* ---------- Avisos ---------- */
  const notifications = [
    { level: "crit", text: "Tu estufa eléctrica lleva 3 h encendida sin nadie en casa.", detail: "Detectamos que el circuito C2 sigue consumiendo cerca de 2.000 W desde las 14:10, pero tu celular no se ha movido de la zona de tu trabajo desde las 13:00. Si fue intencional, ignora este aviso.", time: "Hace 20 min" },
    { level: "warn", text: "El refrigerador está consumiendo 18% más que tu promedio.", detail: "En las últimas 48 horas el compresor se ha activado con más frecuencia de lo normal. Puede ser el sello de la puerta o que necesite limpieza en la parrilla trasera.", time: "Hace 2 h" },
    { level: "info", text: "Reporte semanal listo: gastaste $11.200 esta semana.", detail: "La estufa eléctrica fue el 58% de tu consumo. El resto se repartió entre refrigerador (22%), termo (12%) y otros (8%).", time: "Ayer" },
    { level: "info", text: "Circuito C2 al 85% de su capacidad durante la cena.", detail: "Entre las 20:00 y las 20:40 varios aparatos estuvieron encendidos a la vez. No se cortó el automático, pero si se repite seguido, evita usar el microondas y la estufa al mismo tiempo.", time: "Hace 2 días" },
  ];
  const notifBadge = document.getElementById("notifBadge");
  function renderNotifs() {
    const notifList = document.getElementById("notifList");
    notifList.innerHTML = "";
    notifications.forEach((n) => {
      const item = document.createElement("div");
      item.className = "alert-item notif-item";
      item.innerHTML = `
        <span class="alert-dot ${n.level}"></span>
        <div class="notif-body">
          <div class="alert-text">${n.text}</div>
          <div class="alert-time">${n.time}</div>
          <div class="notif-detail" hidden>${n.detail}</div>
        </div>`;
      item.addEventListener("click", () => {
        item.querySelector(".notif-detail").hidden = !item.querySelector(".notif-detail").hidden;
        n.read = true;
        updateNotifBadge();
      });
      notifList.appendChild(item);
    });
    document.getElementById("notifCount").textContent = `${notifications.length} en total`;
    updateNotifBadge();
  }
  function updateNotifBadge() {
    const unread = notifications.filter((n) => !n.read).length;
    notifBadge.textContent = unread || "";
    notifBadge.style.display = unread ? "inline-block" : "none";
  }

  /* ---------- Pagar ---------- */
  document.getElementById("payCompanyName").textContent = company.name;
  document.getElementById("payLink").href = company.url;
  document.getElementById("payLink").innerHTML = `Ir a pagar a ${company.name} <svg viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- Ajustes ---------- */
  document.getElementById("cfgNombre").value = user.nombre || "";
  document.getElementById("cfgEmail").value = user.email || "";
  document.getElementById("cfgTelefono").value = user.telefono || "";
  document.getElementById("cfgComuna").value = user.comuna || "";
  document.getElementById("cfgCompania").value = user.compania || "cge";
  document.getElementById("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    user.nombre = document.getElementById("cfgNombre").value;
    user.email = document.getElementById("cfgEmail").value;
    user.telefono = document.getElementById("cfgTelefono").value;
    user.comuna = document.getElementById("cfgComuna").value;
    user.compania = document.getElementById("cfgCompania").value;
    localStorage.setItem("vatia-user", JSON.stringify(user));
    document.getElementById("sidebarUser").textContent = user.nombre || user.email;
    document.getElementById("settingsNote").textContent = "Cambios guardados. Algunos (como la compañía) se aplican al volver a entrar.";
    setTimeout(() => { document.getElementById("settingsNote").textContent = ""; }, 3500);
  });

  /* ---------- Navegación por pestañas ---------- */
  const tabLinks = Array.from(document.querySelectorAll(".sidebar-link[data-tab]"));
  function showTab(tab) {
    tabLinks.forEach((l) => l.classList.toggle("active", l.dataset.tab === tab));
    document.querySelector('[data-panel="resumen"]').hidden = !(tab === "resumen" || tab === "aparatos");
    ["ahorro", "avisos", "pagar", "ajustes"].forEach((t) => {
      document.querySelector(`[data-panel="${t}"]`).hidden = t !== tab;
    });
    if (tab === "aparatos") {
      setTimeout(() => document.getElementById("aparatos").scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }
  tabLinks.forEach((l) => l.addEventListener("click", (e) => {
    e.preventDefault();
    showTab(l.dataset.tab);
  }));

  /* ---------- Loop de simulación ---------- */
  function tick() {
    history.shift();
    history.push(APPLIANCES.map((a) => currentWatts(a)));
    renderStats();
    renderBreakers();
    updateApplianceList();
    buildChart();
  }

  seedHistory();
  renderLegend();
  renderTips();
  renderNotifs();
  buildApplianceList();
  tick();
  setInterval(tick, 1000);
})();
