export type Language = "vi" | "en";

export type ShortcutId = "quote" | "schedule" | "port";

export interface NavItem {
  label: string;
  href: string;
  children: string[];
}

export interface ShortcutItem {
  id: ShortcutId;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface FleetGroup {
  title: string;
  description: string;
}

export interface NewsItem {
  category: string;
  title: string;
  description: string;
  status: string;
}

export interface SmartTool {
  title: string;
  description: string;
}

export interface InterestOption {
  value: string;
  label: string;
}

export interface SiteContent {
  common: {
    skipToContent: string;
    menu: string;
    closeMenu: string;
    language: string;
    vietnamese: string;
    english: string;
    brandHome: string;
    primaryNavigation: string;
    mobileNavigation: string;
    learnMore: string;
    demoConnecting: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
    imageAlt: string;
    routeLabel: string;
    routeValue: string;
    operatingLabel: string;
    operatingValue: string;
  };
  tracking: {
    eyebrow: string;
    title: string;
    label: string;
    placeholder: string;
    button: string;
    emptyFeedback: string;
    demoFeedback: string;
    quoteFeedback: string;
    shortcutsLabel: string;
    shortcuts: ShortcutItem[];
  };
  company: {
    eyebrow: string;
    title: string;
    body: string;
    values: string[];
    imageAlt: string;
    visualLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    imageAlt: string;
    items: ServiceItem[];
  };
  fleet: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    imageAlt: string;
    vesselCount: string;
    vesselCountLabel: string;
    watermark: string;
    groups: FleetGroup[];
  };
  news: {
    eyebrow: string;
    title: string;
    description: string;
    items: NewsItem[];
  };
  smart: {
    eyebrow: string;
    title: string;
    description: string;
    interfaceLabel: string;
    systemOnline: string;
    tools: SmartTool[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    detailsTitle: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    faxLabel: string;
    fax: string;
    emailLabel: string;
    email: string;
    confirmationNote: string;
    formTitle: string;
    fullName: string;
    companyName: string;
    position: string;
    emailField: string;
    phoneField: string;
    message: string;
    interest: string;
    selectPlaceholder: string;
    submit: string;
    requiredNote: string;
    success: string;
    options: InterestOption[];
  };
  footer: {
    tagline: string;
    navigationLabel: string;
    copyright: string;
    top: string;
  };
}
