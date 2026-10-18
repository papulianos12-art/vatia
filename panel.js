// Vatia — panel de cliente (demo local, sin backend real)
(() => {
  const user = JSON.parse(localStorage.getItem("vatia-user") || "null");
  if (!user) {
    location.href = "cuenta.html";
    return;
  }

  const TARIFF_CLP_PER_KWH = 195;
  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");

  const APPLIANCES = [
    { id: "hervidor", name: "Hervidor",        watts: 1950, color: "#ffb020", hoursMonth: 6,   confidence: 97 },
    { id: "refri",    name: "Refrigerador",    watts: 180,  color: "#38e8c6", hoursMonth: 720, confidence: 94 },
    { id: "estufa",   name: "Estufa eléctrica", watts: 2000, color: "#ff6b6b", hoursMonth: 90,  confidence: 91 },
    { id: "termo",    name: "Termo eléctrico", watts: 1500, color: "#8b7bff", hoursMonth: 45,  confidence: 96 },
    { id: "lavadora", name: "Lavadora",        watts: 500,  color: "#4fb0ff", hoursMonth: 10,  confidence: 88 },
    { id: "tv",       name: "TV + cargadores", watts: 120,  color: "#ff9ed2", hoursMonth: 150, confidence: 82 },
    { id: "cocina",   name: "Cocina eléctrica", watts: 2500, color: "#ffd166", hoursMonth: 30,  confidence: 90 },
  ];
  const monthlyCost = (a) => (a.watts * a.hoursMonth / 1000) * TARIFF_CLP_PER_KWH;
  const dayCost = (a) => monthlyCost(a) / 30;

  /* ---------- Identidad ---------- */
  const firstName = (user.nombre || user.email || "Cliente Vatia").split(" ")[0];
  document.getElementById("welcomeTitle").textContent = `Hola, ${firstName} 👋`;
  document.getElementById("sidebarUser").textContent = user.nombre || user.email;
  document.getElementById("logoutLink").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("vatia-user");
    location.href = "index.html";
  });

  /* ---------- Artefactos activos (dashboard en vivo) ---------- */
  const active = new Set(["refri", "tv"]);
  const applianceList = document.getElementById("applianceList");
  const monthTotalEl = document.getElementById("monthTotal");
  const summaryBars = document.getElementById("summaryBars");

  function renderAppliances() {
    const list = APPLIANCES.filter((a) => active.has(a.id));
    if (!list.length) {
      applianceList.innerHTML = `<li class="appliance-empty">Ningún artefacto encendido ahora mismo.</li>`;
    } else {
      applianceList.innerHTML = "";
      list.forEach((a, i) => {
        const li = document.createElement("li");
        li.className = "appliance-item";
        li.style.animationDelay = `${i * 0.05}s`;
        li.innerHTML = `
          <div class="appliance-left">
            <span class="appliance-dot" style="background:${a.color}"></span>
            <div>
              <div class="appliance-name">${a.name}</div>
              <div class="appliance-meta">${a.watts} W · encendido</div>
            </div>
          </div>
          <div class="appliance-right">
            <div class="appliance-cost">${clp(dayCost(a))}/día</div>
            <div class="appliance-confidence">${a.confidence}% confianza</div>
          </div>`;
        applianceList.appendChild(li);
      });
    }
    const total = list.reduce((s, a) => s + monthlyCost(a), 0);
    monthTotalEl.textContent = clp(total || 0);
    summaryBars.innerHTML = "";
    const maxCost = Math.max(...list.map(monthlyCost), 1);
    list.slice().sort((a, b) => monthlyCost(b) - monthlyCost(a)).forEach((a) => {
      const pct = Math.round((monthlyCost(a) / maxCost) * 100);
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <div class="bar-row-top"><span>${a.name}</span><span>${clp(monthlyCost(a))}/mes</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${a.color}"></div></div>`;
      summaryBars.appendChild(row);
    });
    renderStats(list);
  }

  /* ---------- Stat cards ---------- */
  const statGrid = document.getElementById("statGrid");
  function renderStats(activeList) {
    const todayCost = activeList.reduce((s, a) => s + dayCost(a), 0);
    const monthCost = activeList.reduce((s, a) => s + monthlyCost(a), 0);
    const stats = [
      { label: "Consumo de hoy", value: clp(todayCost) },
      { label: "Proyección del mes", value: clp(monthCost) },
      { label: "Artefactos activos", value: String(activeList.length) },
      { label: "Alertas sin leer", value: String(notifications.filter(n => !n.read).length) },
    ];
    statGrid.innerHTML = "";
    stats.forEach((s) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML = `<div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div>`;
      statGrid.appendChild(card);
    });
  }

  // chips para elegir artefactos activos (se insertan antes del dash-main)
  const chipsWrap = document.createElement("div");
  chipsWrap.className = "dash-controls";
  chipsWrap.setAttribute("role", "group");
  chipsWrap.setAttribute("aria-label", "Simular artefactos encendidos");
  document.querySelector("#artefactos .dash-main").before(chipsWrap);

  APPLIANCES.forEach((a) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (active.has(a.id) ? " active" : "");
    chip.innerHTML = `<span class="chip-dot" style="color:${a.color}"></span>${a.name}`;
    chip.addEventListener("click", () => {
      if (active.has(a.id)) active.delete(a.id); else active.add(a.id);
      chip.classList.toggle("active");
      renderAppliances();
    });
    chipsWrap.appendChild(chip);
  });

  /* ---------- Simulador de 1 día ---------- */
  const simActive = new Set();
  const simControls = document.getElementById("simControls");
  const simTotal = document.getElementById("simTotal");

  APPLIANCES.forEach((a) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.innerHTML = `<span class="chip-dot" style="color:${a.color}"></span>${a.name}`;
    chip.addEventListener("click", () => {
      if (simActive.has(a.id)) simActive.delete(a.id); else simActive.add(a.id);
      chip.classList.toggle("active");
      renderSim();
    });
    simControls.appendChild(chip);
  });

  function renderSim() {
    const total = APPLIANCES.filter((a) => simActive.has(a.id)).reduce((s, a) => s + dayCost(a), 0);
    simTotal.textContent = clp(total);
  }

  /* ---------- Diferenciales ---------- */
  const breakers = [
    { name: "Diferencial general", desc: "Protege todo el tablero. Corte manual solo en el sitio, por seguridad.", controllable: false, on: true },
    { name: "Circuito cocina", desc: "Cocina eléctrica, horno y microondas.", controllable: true, on: true },
    { name: "Circuito enchufes", desc: "Enchufes de living, dormitorios y oficina.", controllable: true, on: true },
    { name: "Circuito climatización", desc: "Estufas eléctricas y termo.", controllable: true, on: true },
    { name: "Circuito iluminación", desc: "Luces de toda la casa.", controllable: false, on: true },
  ];
  const breakerList = document.getElementById("breakerList");
  function renderBreakers() {
    breakerList.innerHTML = "";
    breakers.forEach((b, i) => {
      const li = document.createElement("li");
      li.className = "breaker-item";
      li.innerHTML = `
        <div>
          <div class="breaker-name">${b.name}</div>
          <div class="breaker-desc">${b.desc}</div>
        </div>
        ${b.controllable
          ? `<button type="button" class="switch ${b.on ? "on" : ""}" role="switch" aria-checked="${b.on}" aria-label="Encender o apagar ${b.name}"><span class="switch-knob"></span></button>`
          : `<span class="breaker-fixed">${b.on ? "Encendido" : "Apagado"} · sin control remoto</span>`
        }`;
      if (b.controllable) {
        li.querySelector(".switch").addEventListener("click", (e) => {
          b.on = !b.on;
          e.currentTarget.classList.toggle("on", b.on);
          e.currentTarget.setAttribute("aria-checked", String(b.on));
        });
      }
      breakerList.appendChild(li);
    });
  }
  renderBreakers();

  /* ---------- Notificaciones ---------- */
  const notifications = [
    { level: "crit", text: "Tu estufa eléctrica lleva 3 h encendida sin nadie en casa.", detail: "Detectamos que el circuito de climatización sigue consumiendo 2.000 W desde las 14:10, pero tu celular no se ha movido de la zona de tu trabajo desde las 13:00. Si fue intencional, ignora esta alerta.", time: "Hace 20 min" },
    { level: "warn", text: "El refrigerador está consumiendo 18% más que tu promedio.", detail: "En las últimas 48 horas el compresor se ha activado con más frecuencia de lo normal. Puede ser el sello de la puerta o que necesite limpieza en la parrilla trasera. Si sigue así una semana más, te lo volvemos a avisar.", time: "Hace 2 h" },
    { level: "info", text: "Reporte semanal listo: gastaste $11.200 esta semana.", detail: "La estufa eléctrica fue el 58% de tu consumo. El resto se repartió entre refrigerador (22%), termo (12%) y otros (8%). Puedes ver el detalle completo en Mis artefactos.", time: "Ayer" },
    { level: "info", text: "Circuito de cocina al 85% de su capacidad durante la cena.", detail: "Entre las 20:00 y las 20:40 varios artefactos de cocina estuvieron encendidos a la vez. No se cortó el automático, pero si se repite seguido conviene no usar el microondas y la cocina al mismo tiempo.", time: "Hace 2 días" },
  ];
  const notifList = document.getElementById("notifList");
  const notifCount = document.getElementById("notifCount");
  const notifBadge = document.getElementById("notifBadge");

  function renderNotifs() {
    notifList.innerHTML = "";
    notifications.forEach((n, i) => {
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
        const detail = item.querySelector(".notif-detail");
        detail.hidden = !detail.hidden;
        n.read = true;
        updateNotifBadge();
      });
      notifList.appendChild(item);
    });
    updateNotifBadge();
  }
  function updateNotifBadge() {
    const unread = notifications.filter((n) => !n.read).length;
    notifCount.textContent = `${notifications.length} en total`;
    notifBadge.textContent = unread || "";
    notifBadge.style.display = unread ? "inline-block" : "none";
  }

  /* ---------- Configuración ---------- */
  document.getElementById("cfgNombre").value = user.nombre || "";
  document.getElementById("cfgEmail").value = user.email || "";
  document.getElementById("cfgTelefono").value = user.telefono || "";
  document.getElementById("cfgComuna").value = user.comuna || "";

  document.getElementById("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    user.nombre = document.getElementById("cfgNombre").value;
    user.email = document.getElementById("cfgEmail").value;
    user.telefono = document.getElementById("cfgTelefono").value;
    user.comuna = document.getElementById("cfgComuna").value;
    localStorage.setItem("vatia-user", JSON.stringify(user));
    document.getElementById("sidebarUser").textContent = user.nombre || user.email;
    document.getElementById("settingsNote").textContent = "Cambios guardados.";
    setTimeout(() => { document.getElementById("settingsNote").textContent = ""; }, 2500);
  });

  /* ---------- Sidebar active link on scroll ---------- */
  const links = Array.from(document.querySelectorAll(".sidebar-link"));
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  window.addEventListener("scroll", () => {
    let current = sections[0];
    for (const s of sections) {
      if (window.scrollY + 120 >= s.offsetTop) current = s;
    }
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current.id));
  }, { passive: true });

  renderAppliances();
  renderNotifs();
})();
