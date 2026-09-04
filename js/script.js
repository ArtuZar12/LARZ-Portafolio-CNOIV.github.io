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
        href: "templates/parcial-1/act03-P1.html" 
      },
      { code: "ACT-04", 
        title: "Una página demasiado convincente", 
        status: "disponible", 
        href: "templates/parcial-1/act04-P1.html" 
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
   DATOS DE "ROAD TO HALL OF FAME"
   Edita este arreglo para agregar, habilitar o bloquear laboratorios.

   Cada laboratorio admite:
   - code:       identificador corto, ej. "LAB-01"
   - title:      nombre del laboratorio
   - desc:       descripción breve (opcional)
   - status:     "disponible" | "bloqueado"
   - reportHref: enlace al PDF del informe (tú lo subes a assets/road-to-hall-of-fame/)
   - burpHref:   enlace para ver el laboratorio resuelto en Burp Suite
   ========================================================================== */
const LABS = [
  {
    code: "LAB-01",
    title: "Nombre del laboratorio",
    desc: "Descripción breve del laboratorio.",
    status: "disponible",
    reportHref: "assets/road-to-hall-of-fame/lab-01-informe.pdf",
    burpHref: "#",
  },
  {
    code: "LAB-02",
    title: "Laboratorio pendiente",
    desc: "Descripción breve del laboratorio.",
    status: "bloqueado",
    reportHref: "#",
    burpHref: "#",
  },
  {
    code: "LAB-03",
    title: "Laboratorio pendiente",
    desc: "Descripción breve del laboratorio.",
    status: "bloqueado",
    reportHref: "#",
    burpHref: "#",
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
   ROAD TO HALL OF FAME — ruta de progreso de laboratorios
   ========================================================================== */
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" stroke-width="1.7"/></svg>`;
const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v11m0 0 3.5-3.5M12 14 8.5 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const ICON_TARGET = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

function renderRoadmap() {
  const track = document.getElementById("roadmapTrack");
  if (!track) return;

  track.innerHTML = "";

  LABS.forEach((lab, index) => {
    const isAvailable = lab.status === "disponible";
    const isLast = index === LABS.length - 1;

    const li = document.createElement("li");
    li.className = "roadmap__item";
    li.dataset.status = lab.status;

    const nodeIcon = isAvailable ? String(index + 1).padStart(2, "0") : ICON_LOCK;

    li.innerHTML = `
      <div class="roadmap__node-col">
        <span class="roadmap__node">${nodeIcon}</span>
        ${isLast ? "" : `<span class="roadmap__connector${isAvailable ? " is-active" : ""}"></span>`}
      </div>
      <div class="roadmap__content">
        <div class="roadmap__card" ${isAvailable ? 'tabindex="0" role="button" aria-haspopup="true" aria-expanded="false"' : ""}>
          <span class="roadmap__code">${lab.code}</span>
          <h3 class="roadmap__title">${lab.title}</h3>
          ${lab.desc ? `<p class="roadmap__desc">${lab.desc}</p>` : ""}
          ${isAvailable ? `
            <div class="roadmap__actions">
              <a class="roadmap__action roadmap__action--report" href="${lab.reportHref}" download>
                ${ICON_DOWNLOAD} Descargar informe
              </a>
              <a class="roadmap__action roadmap__action--burp" href="${lab.burpHref}" target="_blank" rel="noopener">
                ${ICON_TARGET} Ver en Burp Suite
              </a>
            </div>
          ` : `<p class="roadmap__lock-note">Próximamente</p>`}
        </div>
      </div>
    `;

    track.appendChild(li);
  });
}

/* Soporte táctil: en dispositivos sin hover, un toque abre las acciones */
function setupRoadmapInteractions() {
  const track = document.getElementById("roadmapTrack");
  if (!track) return;

  track.addEventListener("click", (event) => {
    const card = event.target.closest(".roadmap__card[role='button']");
    if (!card) return;
    // No interceptar clics sobre los enlaces de acción, que deben navegar/descargar
    if (event.target.closest(".roadmap__action")) return;

    const wasOpen = card.classList.contains("is-open");
    track.querySelectorAll(".roadmap__card.is-open").forEach(c => {
      c.classList.remove("is-open");
      c.setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }
  });
}

/* ==========================================================================
   TEMA CLARO / OSCURO
   ========================================================================== */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("portfolio-theme", theme); } catch (e) {}

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.setAttribute("aria-label", theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  }
}

function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // El <head> ya aplicó el tema inicial (evita parpadeo); aquí solo sincronizamos el botón.
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current);

  btn.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme");
    applyTheme(now === "dark" ? "light" : "dark");
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
  renderRoadmap();
  setupRoadmapInteractions();
  setupThemeToggle();
  setupNavToggle();
  setupContactForm();
  setupStatusBar();
  setupCodeCopyButtons();
});
