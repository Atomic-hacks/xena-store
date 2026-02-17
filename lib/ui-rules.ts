export const UI_RULES = {
  visualDirection: {
    theme: "dark glassmorphism with fuchsia accent highlights",
    surfaces: [
      "Use layered translucent black surfaces (e.g. bg-black/40 to bg-black/80)",
      "Use soft borders (border-white/10 or border-white/20)",
      "Use backdrop blur for primary containers",
    ],
    accent: [
      "Reserve fuchsia for interactive emphasis, selected state, and highlights",
      "Prefer white/70 and white/60 for secondary text",
    ],
  },
  typography: {
    headings: "Bold, high contrast, often with gradient text treatment for hero moments",
    body: "Readable medium weight text with generous line height",
    labels: "Uppercase micro-labels for metadata and category captions",
  },
  spacingAndLayout: {
    containers: [
      "Use max-width containers (max-w-7xl common)",
      "Horizontal padding scales from px-4 or px-6 to lg:px-8/lg:px-16",
    ],
    radius: "Prefer rounded-xl to rounded-3xl depending on component prominence",
    sectionRhythm: "Use larger vertical spacing blocks (py-16/20, mt-24/32)",
  },
  componentPatterns: {
    buttons: [
      "Primary interactive buttons are pill or rounded-xl with subtle hover scaling",
      "Use backdrop blur + translucent fills over flat solid fills for branded UI",
    ],
    cards: [
      "Use multi-layer card shells: base glass, gradient overlay, interactive border",
      "Card hover may include slight lift (translateY) and image scale",
    ],
    nav: [
      "Sticky top nav with translucent background and blur",
      "Active route states use fuchsia-tinted border/background",
    ],
  },
  motion: {
    library: "framer-motion / motion",
    style: [
      "Subtle spring scale and fade+translate transitions",
      "Avoid aggressive or distracting animation loops",
      "Use AnimatePresence for dropdowns, quick actions, and transient UI",
    ],
    timing: "Most interactions are in the 0.2s to 0.8s range",
  },
  productUI: {
    productCards: [
      "Always show clear price hierarchy (sale price + optional struck original)",
      "Use compact badges for featured and discount states",
      "Maintain strong mobile behavior for actions and overlays",
    ],
  },
  accessibility: {
    essentials: [
      "Keep text contrast high against dark surfaces",
      "Preserve focus-visible treatment on interactive elements",
      "Use clear labels/aria-labels for icon-only controls",
    ],
  },
  implementationNotes: {
    reuseFirst: [
      "Reuse existing components under components/ui and layout wrappers before creating new ones",
      "If a new component is required, match existing glass + fuchsia styling language",
    ],
    avoid: [
      "Avoid plain white-card e-commerce templates that conflict with current visual language",
      "Avoid introducing unrelated color accents as primary action colors",
    ],
  },
} as const;

export type UiRules = typeof UI_RULES;
