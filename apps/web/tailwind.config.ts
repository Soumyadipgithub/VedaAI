import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Tokens (colors / fonts / radii / shadows) are wired in Phase 3
      // from doc/DESIGN_SPECS.md §1. Don't put placeholder values here —
      // we read the spec verbatim.
    },
  },
  plugins: [],
};

export default config;
