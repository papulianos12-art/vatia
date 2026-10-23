// Vatia — cuenta (demo local, sin backend real)
(() => {
  const tabLogin = document.getElementById("tabLogin");
  const tabCrear = document.getElementById("tabCrear");
  const loginForm = document.getElementById("loginForm");
  const crearForm = document.getElementById("crearForm");

  function showLogin() {
    tabLogin.setAttribute("aria-selected", "true");
    tabCrear.setAttribute("aria-selected", "false");
    loginForm.hidden = false;
    crearForm.hidden = true;
  }
  function showCrear() {
    tabLogin.setAttribute("aria-selected", "false");
    tabCrear.setAttribute("aria-selected", "true");
    loginForm.hidden = true;
    crearForm.hidden = false;
  }

  tabLogin.addEventListener("click", showLogin);
  tabCrear.addEventListener("click", showCrear);
  document.getElementById("goCrear").addEventListener("click", (e) => { e.preventDefault(); showCrear(); });
  document.getElementById("goLogin").addEventListener("click", (e) => { e.preventDefault(); showLogin(); });

  if (location.hash === "#crear") showCrear();

  function goToPanel(user) {
    localStorage.setItem("vatia-user", JSON.stringify(user));
    location.href = "panel.html";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const stored = localStorage.getItem("vatia-user");
    let user = stored ? JSON.parse(stored) : null;
    if (!user || user.email !== email) {
      // Demo: no hay backend real, así que entramos igual con un perfil de ejemplo.
      user = { nombre: email.split("@")[0] || "Cliente Vatia", email, telefono: "", comuna: "Concepción", tipo: "hogar", compania: "cge", desde: new Date().toISOString() };
    }
    goToPanel(user);
  });

  crearForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(crearForm);
    const user = {
      nombre: fd.get("nombre"),
      email: fd.get("email"),
      telefono: fd.get("telefono"),
      comuna: fd.get("comuna"),
      tipo: fd.get("tipo"),
      compania: fd.get("compania"),
      desde: new Date().toISOString(),
    };
    goToPanel(user);
  });
})();
