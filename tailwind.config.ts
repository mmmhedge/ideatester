import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./ideas/**/*.{ts,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|ring|border|hover:bg|focus:ring)-(emerald|indigo|rose|sky|amber|violet|teal|orange|neutral)-(50|100|200|300|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto"],
      },
    },
  },
  plugins: [],
} satisfies Config;
