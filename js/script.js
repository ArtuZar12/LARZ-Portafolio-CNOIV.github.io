/* ==========================================================================
   DATOS DEL PORTAFOLIO
   Edita únicamente este bloque para agregar parciales o actividades nuevas.
   No necesitas tocar el resto del archivo.

   Cada actividad admite:
   - code:   identificador corto, ej. "ACT-01"
   - title:  nombre de la actividad
   - status: "disponible" | "proximamente"
   - href:   enlace a la página/carpeta de la actividad (si ya existe)
   ========================================================================== */
const PARCIALES = [
  {
    id: "parcial-1",
    label: "Parcial 1",
    meta: "Fundamentos de ciberseguridad",
    activities: [
      { code: "ACT-01", title: "Actividad pendiente", status: "proximamente", href: "#" },
      {
        code: "ACT-02",
        title: "Aquí empieza mi portafolio",
        status: "disponible",
        href: "index.html#inicio",
      },
      { code: "ACT-03", 
        title: "No presiones Esc… todavía", 
        status: "disponible", 
        href: "../templates/parcial-1/act03-P1.html" 
      },
    ],
  },
  {
    id: "parcial-2",
    label: "Parcial 2",
    meta: "Por definir",
    activities: [
      { code: "ACT-01", title: "Actividad pendiente", status: "proximamente", href: "#" },
    ],
  },
  {
    id: "parcial-3",
    label: "Parcial 3",
    meta: "Por definir",
    activities: [
      { code: "ACT-01", title: "Actividad pendiente", status: "proximamente", href: "#" },
    ],
  },
];

/* ==========================================================================
   RENDERIZADO DE PESTAÑAS Y PANELES DE PARCIALES
   ========================================================================== */
function renderPartials() {
  const tabsHost = document.getElementById("partialTabs");
  const panelsHost = document.getElementById("partialPanels");
  if (!tabsHost || !panelsHost) return;

  tabsHost.innerHTML = "";
  panelsHost.innerHTML = "";

  PARCIALES.forEach((parcial, index) => {
    const isActive = index === 0;

    // --- pestaña ---
    const tabBtn = document.createElement("button");
    tabBtn.className = "partial-tab";
    tabBtn.type = "button";
    tabBtn.id = `tab-${parcial.id}`;
    tabBtn.setAttribute("role", "tab");
    tabBtn.setAttribute("aria-selected", String(isActive));
    tabBtn.setAttribute("aria-controls", `panel-${parcial.id}`);
    tabBtn.textContent = parcial.label;
    tabBtn.addEventListener("click", () => activatePartial(parcial.id));
    tabsHost.appendChild(tabBtn);

    // --- panel ---
    const panel = document.createElement("div");
    panel.className = "partial-panel";
    panel.id = `panel-${parcial.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${parcial.id}`);
    if (!isActive) panel.hidden = true;

    const availableCount = parcial.activities.filter(a => a.status === "disponible").length;

    panel.innerHTML = `
      <div class="partial-panel__head">
        <h3 class="partial-panel__title">${parcial.label} · ${parcial.meta}</h3>
        <span class="partial-panel__meta">${availableCount} / ${parcial.activities.length} actividades disponibles</span>
      </div>
      <div class="activity-grid"></div>
    `;

    const grid = panel.querySelector(".activity-grid");

    if (parcial.activities.length === 0) {
      grid.outerHTML = `<p class="empty-note">Sin actividades registradas todavía.</p>`;
    } else {
      parcial.activities.forEach(activity => {
        const locked = activity.status !== "disponible";
        const el = document.createElement(locked ? "div" : "a");
        el.className = `activity-btn${locked ? " is-locked" : ""}`;
        if (!locked) {
          el.href = activity.href || "#";
        } else {
          el.setAttribute("aria-disabled", "true");
        }
        el.innerHTML = `
          <span class="activity-btn__code">${activity.code}</span>
          <span class="activity-btn__title">${activity.title}</span>
          <span class="activity-btn__status">${locked ? "Próximamente" : "Disponible"}</span>
        `;
        grid.appendChild(el);
      });
    }

    panelsHost.appendChild(panel);
  });
}

function activatePartial(targetId) {
  PARCIALES.forEach(parcial => {
    const tab = document.getElementById(`tab-${parcial.id}`);
    const panel = document.getElementById(`panel-${parcial.id}`);
    const isTarget = parcial.id === targetId;
    if (tab) tab.setAttribute("aria-selected", String(isTarget));
    if (panel) panel.hidden = !isTarget;
  });
}

/* ==========================================================================
   MENÚ MÓVIL
   ========================================================================== */
function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   FORMULARIO DE CONTACTO
   Estructura de front-end únicamente. Para respuesta automática real,
   conecta un servicio (Formspree, EmailJS, Web3Forms, etc.) aquí dentro.
   ========================================================================== */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      feedback.textContent = "Revisa los campos marcados antes de enviar.";
      feedback.className = "form-feedback is-error";
      return;
    }

    // TODO: sustituir por el envío real (fetch a Formspree/EmailJS/Web3Forms).
    feedback.textContent = "Mensaje recibido. Te responderemos a la brevedad.";
    feedback.className = "form-feedback is-success";
    form.reset();
  });
}

/* ==========================================================================
   BLOQUES DE CÓDIGO — botón "Copiar" (el código en sí es de solo lectura)
   ========================================================================== */
function setupCodeCopyButtons() {
  document.querySelectorAll(".code-block__copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const originalLabel = btn.textContent;
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        btn.textContent = "Copiado ✓";
        btn.classList.add("is-copied");
      } catch (err) {
        btn.textContent = "No se pudo copiar";
      }
      setTimeout(() => {
        btn.textContent = originalLabel;
        btn.classList.remove("is-copied");
      }, 1800);
    });
  });
}

/* ==========================================================================
   DETALLES DEL STATUS BAR
   ========================================================================== */
function setupStatusBar() {
  const sslEl = document.querySelector("[data-ssl-check]");
  if (sslEl) {
    sslEl.textContent = window.location.protocol === "https:" ? "VERIFICADO" : "SIN VERIFICAR (local)";
  }

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderPartials();
  setupNavToggle();
  setupContactForm();
  setupStatusBar();
  setupCodeCopyButtons();
});
