// Vatia — demo interactions (datos de ejemplo, sin backend real)
(() => {
  const TARIFF_CLP_PER_KWH = 195;

  const APPLIANCES = [
    { id: "hervidor",     name: "Hervidor",        watts: 1950, color: "#ffb020", hoursMonth: 6,  confidence: 97 },
    { id: "refri",        name: "Refrigerador",    watts: 180,  color: "#38e8c6", hoursMonth: 720, confidence: 94 },
    { id: "estufa",       name: "Estufa eléctrica", watts: 2000, color: "#ff6b6b", hoursMonth: 90, confidence: 91 },
    { id: "termo",        name: "Termo eléctrico", watts: 1500, color: "#8b7bff", hoursMonth: 45, confidence: 96 },
    { id: "lavadora",     name: "Lavadora",        watts: 500,  color: "#4fb0ff", hoursMonth: 10, confidence: 88 },
    { id: "tv",           name: "TV + cargadores", watts: 120,  color: "#ff9ed2", hoursMonth: 150, confidence: 82 },
  ];

  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");
  const monthlyCost = (a) => (a.watts * a.hoursMonth / 1000) * TARIFF_CLP_PER_KWH;
  const dayCost = (a) => monthlyCost(a) / 30;

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hero panel rows (auto demo) ---------- */
  const heroRows = document.getElementById("heroRows");
  const heroTotal = document.getElementById("heroTotal");
  let heroActive = [];
  let heroRunningTotal = 0;

  function renderHeroRows() {
    heroRows.innerHTML = "";
    heroActive.forEach((a, i) => {
      const row = document.createElement("div");
      row.className = "panel-row";
      row.style.animationDelay = `${i * 0.05}s`;
      row.innerHTML = `
        <span class="panel-row-name">
          <span class="panel-row-dot" style="background:${a.color}"></span>${a.name}
        </span>
        <span class="panel-row-watts">${a.watts} W</span>`;
      heroRows.appendChild(row);
    });
    heroTotal.textContent = clp(heroRunningTotal);
  }

  function heroTick() {
    const pool = APPLIANCES;
    if (heroActive.length >= 3 || Math.random() < 0.35) {
      // turn one off
      if (heroActive.length) {
        const removed = heroActive.shift();
        heroRunningTotal += dayCost(removed) * 0.15;
      }
    } else {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (!heroActive.find((a) => a.id === candidate.id)) {
        heroActive.push(candidate);
        heroRunningTotal += dayCost(candidate) * 0.4;
      }
    }
    renderHeroRows();
  }

  if (heroRows) {
    heroTick();
    setInterval(heroTick, 2200);
  }

  /* ---------- Dashboard demo ---------- */
  const dashControls = document.getElementById("dashControls");
  const applianceList = document.getElementById("applianceList");
  const monthTotalEl = document.getElementById("monthTotal");
  const summaryBars = document.getElementById("summaryBars");

  const active = new Set(["refri"]); // refrigerador siempre encendido, como en la vida real

  function buildControls() {
    APPLIANCES.forEach((a) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (active.has(a.id) ? " active" : "");
      chip.innerHTML = `<span class="chip-dot" style="color:${a.color}"></span>${a.name}`;
      chip.addEventListener("click", () => {
        if (active.has(a.id)) active.delete(a.id);
        else active.add(a.id);
        chip.classList.toggle("active");
        renderDashboard();
      });
      dashControls.appendChild(chip);
    });
  }

  function renderDashboard() {
    const list = APPLIANCES.filter((a) => active.has(a.id));

    if (!list.length) {
      applianceList.innerHTML = `<li class="appliance-empty">Ningún artefacto encendido ahora mismo.<br>Haz clic arriba para simular uno.</li>`;
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

    const total = list.reduce((sum, a) => sum + monthlyCost(a), 0);
    monthTotalEl.textContent = clp(total || 0);

    summaryBars.innerHTML = "";
    const maxCost = Math.max(...list.map(monthlyCost), 1);
    list
      .slice()
      .sort((a, b) => monthlyCost(b) - monthlyCost(a))
      .forEach((a) => {
        const pct = Math.round((monthlyCost(a) / maxCost) * 100);
        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
          <div class="bar-row-top">
            <span>${a.name}</span>
            <span>${clp(monthlyCost(a))}/mes</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct}%; background:${a.color}"></div>
          </div>`;
        summaryBars.appendChild(row);
      });
  }

  if (dashControls) {
    buildControls();
    renderDashboard();
  }

  /* ---------- CTA form (demo local, sin backend) ---------- */
  const ctaForm = document.getElementById("ctaForm");
  const ctaNote = document.getElementById("ctaNote");
  if (ctaForm) {
    ctaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      ctaNote.textContent = "¡Listo! Esto es una demo sin backend — conecta tu propio formulario o correo para recibir estos datos de verdad.";
      ctaForm.reset();
    });
  }
})();
