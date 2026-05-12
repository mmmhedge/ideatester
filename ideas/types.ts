export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export type CryptoFields = {
  chain?: string;
  category?: string;
  status?: "concept" | "testnet" | "audit" | "mainnet";
  /** 1-2 sentence problem statement. Concrete. */
  problem: string;
  /** 1-2 sentence solution. Names primitives. */
  solution: string;
  /** The single insight that makes the thing work. */
  keyInsight: string;
  architecture: {
    overview: string;
    components: { name: string; role: string }[];
  };
  tokenomics?: {
    symbol: string;
    totalSupply: string;
    utility: string;
    allocations: { name: string; pct: number; vesting?: string }[];
  };
  roadmap?: {
    phase: string;
    status: "shipped" | "in-progress" | "planned";
    items: string[];
  }[];
  links?: {
    x?: string;
    github?: string;
    docs?: string;
    discord?: string;
    telegram?: string;
    mirror?: string;
  };
};

export type Idea = {
  slug: string;
  /** Renderer template. Defaults to "saas". */
  kind?: "saas" | "crypto";
  /** Required when kind === "crypto". */
  crypto?: CryptoFields;
  title: string;
  metaDescription?: string;
  hero: {
    eyebrow?: string;
    headline: string;
    sub: string;
    primaryCta: string;
    image?: string;
  };
  features?: { title: string; body: string; icon?: string }[];
  socialProof?: { quote: string; name: string; role?: string }[];
  faq?: { q: string; a: string }[];
  form: {
    fields: FormField[];
    submitLabel: string;
    successHeadline: string;
    successBody: string;
    /** Conversion event name. Maps to Meta CAPI "Lead" by default. */
    conversionEvent?: string;
    /** Optional value in USD for ad-platform optimization. */
    conversionValue?: number;
  };
  /** Adapter keys to enable for this idea. Empty/undefined = all configured ones fire. */
  integrations?: ("meta" | "ga4" | "posthog" | "plausible")[];
  theme?: {
    accent?: string; // tailwind class fragment, e.g. "indigo" or "emerald"
  };
  /**
   * Optional vibe note fed to the brand generator. Free-text steering only.
   * E.g. "feels like a neighborhood diner, not a startup."
   */
  vibe?: string;
};
