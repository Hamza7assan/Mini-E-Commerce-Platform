import type { Config } from "tailwindcss";

const sharedConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          600: "hsl(var(--color-brand-600) / <alpha-value>)",
        },
        neutral: {
          50: "hsl(var(--color-neutral-50) / <alpha-value>)",
        },
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default sharedConfig;