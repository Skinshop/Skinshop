(function () {
  "use strict";

  const CFG = window.SKINSHOP_CONFIG;
  const PARTS = window.SKINSHOP_PARTS;

  // ---------- Helpers ----------
  function formatARS(n) {
    if (n === null || n === undefined) return "Consultar";
    return "$ " + Math.round(n).toLocaleString("es-AR") + " ARS";
  }

  // Calculates labor + total for a given part, applying brand/part-type
  // overrides first, falling back to the general threshold rule.
  function calcPricing(brand, partType, partPrice, inStock) {
    if (!inStock || partPrice === null || partPrice === undefined) {
      return { labor: null, total: null };
    }
    const overrides = CFG.pricing.laborOverrides || {};
    const brandOverrides = overrides[brand];
    let labor;
    if (brandOverrides && brandOverrides[partType] !== undefined) {
      labor = brandOverrides[partType];
    } else {
      labor =
        partPrice < CFG.pricing.discountThreshold
          ? CFG.pricing.laborDiscounted
          : CFG.pricing.laborStandard;
    }
    return { labor, total: partPrice + labor };
  }

  function waLink(message) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${CFG.business.whatsappNumber}?text=${encoded}`;
  }

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // ---------- Icons (inline SVG, no external images) ----------
  const ICONS = {
    screen: `<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="6" width="24" height="36" rx="4" stroke="currentColor" stroke-width="2.5"/><line x1="20" y1="38" x2="28" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M18 16l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    battery: `<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="16" width="30" height="16" rx="3" stroke="currentColor" stroke-width="2.5"/><rect x="38" y="21" width="4" height="6" rx="1" fill="currentColor"/><path d="M17 20l-4 6h6l-4 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    charging: `<svg viewBox="0 0 48 48" fill="none"><rect x="14" y="4" width="20" height="40" rx="4" stroke="currentColor" stroke-width="2.5"/><path d="M26 14l-8 10h6l-2 10 10-12h-6l0-8z" fill="currentColor"/></svg>`,
    software: `<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5"/><path d="M24 16v8l6 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    unlock: `<svg viewBox="0 0 48 48" fill="none"><rect x="10" y="22" width="28" height="18" rx="3" stroke="currentColor" stroke-width="2.5"/><path d="M16 22v-6a8 8 0 0 1 15-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="31" r="2.5" fill="currentColor"/></svg>`,
    tools: `<svg viewBox="0 0 48 48" fill="none"><path d="M31 10a7 7 0 0 0-9 9L8 33l6 6 14-14a7 7 0 0 0 9-9l-5 5-4-4z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    whatsapp: `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 3C9.4 3 4.02 8.37 4.02 15c0 2.35.68 4.55 1.86 6.42L4 29l7.78-1.85A11.9 11.9 0 0 0 16.02 27C22.63 27 28 21.63 28 15S22.63 3 16.02 3zm0 21.7a9.6 9.6 0 0 1-4.9-1.34l-.35-.21-4.62 1.1 1.13-4.5-.23-.37A9.6 9.6 0 1 1 25.6 15a9.6 9.6 0 0 1-9.58 9.7zm5.27-7.19c-.29-.14-1.71-.84-1.97-.94-.26-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.21-.44-2.31-1.42-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.55-.89-2.13-.23-.55-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01s-.5.07-.77.36c-.26.29-1 .98-1 2.4s1.03 2.78 1.17 2.97c.14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.32.19 1.81.11.55-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.33z"/></svg>`,
  };

  // ---------- Nav / mobile menu ----------
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // header shadow on scroll
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  });

  // ---------- WhatsApp buttons (static) ----------
  document.querySelectorAll("[data-wa-message]").forEach((btn) => {
    const msg = btn.getAttribute("data-wa-message");
    btn.href = waLink(msg);
    btn.target = "_blank";
    btn.rel = "noopener";
  });
  document.querySelectorAll(".wa-number-display").forEach((n) => {
    n.textContent = CFG.business.whatsappDisplay;
  });

  // ---------- Hero / config text ----------
  document.querySelectorAll("[data-cfg]").forEach((n) => {
    const path = n.getAttribute("data-cfg").split(".");
    let v = CFG;
    for (const p of path) v = v && v[p];
    if (v !== undefined) n.textContent = v;
  });

  // ---------- Services ----------
  const servicesGrid = document.getElementById("services-grid");
  if (servicesGrid) {
    CFG.services.forEach((s) => {
      const card = el("div", "service-card");
      card.innerHTML = `
        <div class="service-icon">${ICONS[s.icon] || ""}</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener">${ICONS.whatsapp} Consultar por este servicio</a>
      `;
      const waBtn = card.querySelector("a");
      waBtn.href = waLink(
        `Hola! Quería consultar por el servicio de "${s.title}" para mi celular.`
      );
      servicesGrid.appendChild(card);
    });
  }

  // ---------- Brands ----------
  const brandsGrid = document.getElementById("brands-grid");
  if (brandsGrid) {
    CFG.brands.forEach((b) => {
      const chip = el("div", "brand-chip", `<span>${b.name}</span>`);
      brandsGrid.appendChild(chip);
    });
  }

  // ---------- Quote / Repair Search System ----------
  const quoteBrand = document.getElementById("quote-brand");
  const quoteType = document.getElementById("quote-type");
  const quoteModel = document.getElementById("quote-model");
  const quoteResult = document.getElementById("quote-result");

  function uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b, "es"));
  }

  function populateSelect(select, values, placeholder) {
    select.innerHTML = "";
    const ph = el("option", "", placeholder);
    ph.value = "";
    select.appendChild(ph);
    values.forEach((v) => {
      const o = el("option", "", v);
      o.value = v;
      select.appendChild(o);
    });
    select.disabled = values.length === 0;
  }

  function partTypeLabelEs(pt) {
    const map = {
      "Módulo/Display": "Cambio de pantalla / módulo",
      "Batería": "Cambio de batería",
      "Placa de carga": "Reparación de pin de carga",
      "Flex": "Reemplazo de flex",
      "Cámara": "Reparación de cámara",
      "Lente de cámara": "Cambio de lente de cámara",
      "Tapa trasera": "Cambio de tapa trasera",
      "Bandeja SIM": "Cambio de bandeja SIM",
      "Chasis completo": "Cambio de chasis completo",
    };
    return map[pt] || pt;
  }

  if (quoteBrand && quoteType && quoteModel && quoteResult) {
    populateSelect(
      quoteBrand,
      uniqueSorted(PARTS.map((p) => p.brandDisplay)),
      "Elegí tu marca"
    );

    quoteBrand.addEventListener("change", () => {
      quoteResult.innerHTML = "";
      const brand = quoteBrand.value;
      if (!brand) {
        populateSelect(quoteType, [], "Elegí tu marca primero");
        populateSelect(quoteModel, [], "Elegí tu marca primero");
        return;
      }
      const types = uniqueSorted(
        PARTS.filter((p) => p.brandDisplay === brand).map((p) => p.partType)
      );
      populateSelect(
        quoteType,
        types.map(partTypeLabelEs),
        "Elegí el tipo de reparación"
      );
      populateSelect(quoteModel, [], "Elegí el tipo de reparación primero");
    });

    quoteType.addEventListener("change", () => {
      quoteResult.innerHTML = "";
      const brand = quoteBrand.value;
      const typeLabel = quoteType.value;
      if (!brand || !typeLabel) {
        populateSelect(quoteModel, [], "Elegí el tipo de reparación primero");
        return;
      }
      const rawType = Object.keys({
        "Módulo/Display": 1, "Batería": 1, "Placa de carga": 1, "Flex": 1,
        "Cámara": 1, "Lente de cámara": 1, "Tapa trasera": 1, "Bandeja SIM": 1,
        "Chasis completo": 1,
      }).find((k) => partTypeLabelEs(k) === typeLabel);

      const models = PARTS.filter(
        (p) => p.brandDisplay === brand && p.partType === rawType
      );
      populateSelect(
        quoteModel,
        uniqueSorted(models.map((p) => p.model)),
        "Elegí tu modelo"
      );
    });

    quoteModel.addEventListener("change", () => {
      quoteResult.innerHTML = "";
      const brand = quoteBrand.value;
      const typeLabel = quoteType.value;
      const model = quoteModel.value;
      if (!brand || !typeLabel || !model) return;

      const rawType = Object.keys({
        "Módulo/Display": 1, "Batería": 1, "Placa de carga": 1, "Flex": 1,
        "Cámara": 1, "Lente de cámara": 1, "Tapa trasera": 1, "Bandeja SIM": 1,
        "Chasis completo": 1,
      }).find((k) => partTypeLabelEs(k) === typeLabel);

      const match = PARTS.find(
        (p) => p.brandDisplay === brand && p.partType === rawType && p.model === model
      );
      if (!match) return;

      const { labor, total } = calcPricing(match.brand, match.partType, match.partPrice, match.inStock);
      const message = `Hola! Quería consultar por la reparación de mi ${brand} ${match.model}. Me interesa: ${typeLabel}.`;

      quoteResult.innerHTML = `
        <div class="quote-card">
          <div class="quote-row"><span>Repuesto</span><strong>${
            match.inStock ? formatARS(match.partPrice) : "Consultar disponibilidad"
          }</strong></div>
          <div class="quote-row"><span>Mano de obra</span><strong>${
            labor !== null ? formatARS(labor) : "—"
          }</strong></div>
          <div class="quote-row quote-total"><span>Total estimado</span><strong>${
            total !== null ? formatARS(total) : "A consultar"
          }</strong></div>
          <a class="btn btn-wa" target="_blank" rel="noopener">${ICONS.whatsapp} Consultar por WhatsApp</a>
          <p class="quote-note">Precio estimado según lista de repuestos vigente. Puede variar según diagnóstico.</p>
        </div>
      `;
      quoteResult.querySelector("a").href = waLink(message);
    });
  }

  // ---------- Spare parts catalog ----------
  const catBrand = document.getElementById("cat-brand");
  const catType = document.getElementById("cat-type");
  const catSearch = document.getElementById("cat-search");
  const catResults = document.getElementById("cat-results");
  const catCount = document.getElementById("cat-count");
  const catLoadMore = document.getElementById("cat-load-more");

  let catPage = 1;
  const PAGE_SIZE = 24;

  function renderCatalog(reset) {
    if (reset) catPage = 1;
    const brand = catBrand.value;
    const type = catType.value;
    const q = catSearch.value.trim().toLowerCase();

    let filtered = PARTS.filter((p) => {
      if (brand && p.brandDisplay !== brand) return false;
      if (type && p.partType !== type) return false;
      if (q && !(p.model.toLowerCase().includes(q) || p.fullName.toLowerCase().includes(q))) return false;
      return true;
    });

    catCount.textContent = `${filtered.length} repuestos encontrados`;

    const toShow = filtered.slice(0, catPage * PAGE_SIZE);
    catResults.innerHTML = "";
    toShow.forEach((p) => {
      const { total } = calcPricing(p.brand, p.partType, p.partPrice, p.inStock);
      const card = el("div", "part-card");
      card.innerHTML = `
        <span class="part-type-tag">${partTypeLabelEs(p.partType)}</span>
        <h4>${p.brandDisplay} ${p.model}</h4>
        <div class="part-price-row">
          <div><span class="part-label">Repuesto</span><strong>${p.inStock ? formatARS(p.partPrice) : "Consultar"}</strong></div>
          <div><span class="part-label">Total estimado</span><strong>${total !== null ? formatARS(total) : "A consultar"}</strong></div>
        </div>
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener">${ICONS.whatsapp} Consultar</a>
      `;
      card.querySelector("a").href = waLink(
        `Hola! Quería consultar por ${p.fullName} (${p.brandDisplay}). ${p.inStock ? "Vi que el precio estimado total es " + formatARS(total) + "." : ""}`
      );
      catResults.appendChild(card);
    });

    catLoadMore.style.display = filtered.length > toShow.length ? "inline-flex" : "none";
  }

  if (catBrand && catType && catSearch && catResults) {
    populateSelect(catBrand, uniqueSorted(PARTS.map((p) => p.brandDisplay)), "Todas las marcas");
    populateSelect(
      catType,
      uniqueSorted(PARTS.map((p) => p.partType)).map(partTypeLabelEs),
      "Todos los tipos de repuesto"
    );
    // map back label->raw for filtering
    catType.addEventListener("change", () => {
      // store raw value in dataset via lookup
      renderCatalog(true);
    });
    catBrand.addEventListener("change", () => renderCatalog(true));
    catSearch.addEventListener("input", () => renderCatalog(true));
    catLoadMore.addEventListener("click", () => {
      catPage++;
      renderCatalog(false);
    });

    // Fix: catType select values must be raw types, not labels, for filtering logic above.
    // Rebuild with value=raw, text=label
    catType.innerHTML = "";
    const ph = el("option", "", "Todos los tipos de repuesto");
    ph.value = "";
    catType.appendChild(ph);
    uniqueSorted(PARTS.map((p) => p.partType)).forEach((raw) => {
      const o = el("option", "", partTypeLabelEs(raw));
      o.value = raw;
      catType.appendChild(o);
    });

    renderCatalog(true);
  }

  // ---------- Map embed ----------
  const mapFrame = document.getElementById("map-embed");
  if (mapFrame) {
    const { lat, lng } = CFG.business.location;
    mapFrame.src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
  document.querySelectorAll("[data-maps-link]").forEach((a) => {
    const { lat, lng } = CFG.business.location;
    a.href = `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=en`;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-directions-link]").forEach((a) => {
    const { lat, lng } = CFG.business.location;
    a.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
