export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export type Idea = {
  slug: string;
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
