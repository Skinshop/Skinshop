// ============================================================
// SKINSHOP — SITE CONFIG
// Edit this file to update business info, services, and brands.
// Nothing here was invented — every field marked (pending) is a
// clearly-labeled placeholder waiting for real info from the owner.
// ============================================================

window.SKINSHOP_CONFIG = {
  business: {
    name: "SKINSHOP",
    slogan: "Tu celular, en las mejores manos.",
    whatsappNumber: "5493764394918", // +54 9 3764 394918, digits only for wa.me
    whatsappDisplay: "+54 9 3764 394918",
    location: {
      lat: -27.447652,
      lng: -55.865870,
      // Exact street address pending — owner will provide it.
      addressLabel: "Ver ubicación en Google Maps",
    },
  },

  // About Us copy is a placeholder until the owner sends the real text.
  about: {
    placeholder: true,
    text: "Estamos preparando esta sección con la historia real de SKINSHOP. Muy pronto vas a poder conocer más sobre nuestro compromiso con la calidad, la profesionalidad y la confianza que nos caracteriza.",
  },

  services: [
    {
      id: "pantalla",
      title: "Cambio de pantalla / módulo",
      description: "Reemplazo de pantallas rotas, con líneas o táctil dañado, para la mayoría de las marcas y modelos.",
      icon: "screen",
    },
    {
      id: "bateria",
      title: "Cambio de batería",
      description: "Batería que se agota rápido o el celular se apaga solo? Reemplazo de baterías originales y compatibles.",
      icon: "battery",
    },
    {
      id: "carga",
      title: "Reparación de pin de carga",
      description: "Solución a problemas de carga lenta, intermitente o nula por daño en el conector o la placa de carga.",
      icon: "charging",
    },
    {
      id: "software",
      title: "Servicios de software",
      description: "Actualizaciones, formateo, resolución de errores de sistema y otros servicios de software.",
      icon: "software",
    },
    {
      id: "liberacion",
      title: "Liberación de equipos",
      description: "Servicios de desbloqueo para que tu equipo funcione con cualquier compañía.",
      icon: "unlock",
    },
    {
      id: "general",
      title: "Reparaciones generales",
      description: "Diagnóstico y reparación de otras fallas: cámaras, parlantes, micrófono, botones y más.",
      icon: "tools",
    },
  ],

  // Only brands confirmed by the owner. More can be added later.
  brands: [
    { id: "samsung", name: "Samsung" },
    { id: "motorola", name: "Motorola" },
    { id: "xiaomi", name: "Xiaomi" },
    { id: "apple", name: "Apple / iPhone" },
  ],

  // Pricing rules, confirmed by the owner:
  // GENERAL RULE (applies to any brand/part type not overridden below):
  // - Standard labor: 20,000 ARS
  // - If the spare part costs LESS THAN 5,000 ARS, labor is 10,000 ARS instead
  // - Estimated total = spare part price + labor
  //
  // BRAND-SPECIFIC OVERRIDES: fixed labor per part type, regardless of
  // spare-part price. To add more overrides later (e.g. for another
  // brand), just add a new key under laborOverrides using the exact
  // partType names used in spareParts.js:
  // "Módulo/Display", "Batería", "Placa de carga", "Flex", "Cámara",
  // "Lente de cámara", "Tapa trasera", "Bandeja SIM", "Chasis completo"
  pricing: {
    laborStandard: 20000,
    laborDiscounted: 10000,
    discountThreshold: 5000,
    currency: "ARS",
    laborOverrides: {
      "Apple (iPhone)": {
        "Placa de carga": 30000,
        "Módulo/Display": 50000,
        "Tapa trasera": 30000,
        "Bandeja SIM": 10000,
        "Flex": 30000,
        "Cámara": 25000,
        "Lente de cámara": 8000,
        "Batería": 50000,
        // "Chasis completo" not specified by the owner — falls back to
        // the general rule below until a fixed value is given.
      },
    },
  },
};
