// Vatia — light/dark theme toggle, shared by index.html and ceo.html
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const label = toggle.querySelector(".theme-toggle-label");

  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }

  function sync() {
    const dark = isDark();
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    if (label) label.textContent = dark ? "Modo claro" : "Modo oscuro";
  }

  toggle.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    if (next === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("vatia-theme", next);
    sync();
  });

  sync();
})();
