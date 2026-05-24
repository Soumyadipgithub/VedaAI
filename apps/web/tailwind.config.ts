import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF5623",
          "orange-pill": "#FF7950",
          navy: "#011625",
          "navy-light": "#417BA4",
          red: "#FF4040",
        },
        text: {
          primary: "#303030",
          secondary: "#5E5E5E",
          disabled: "#A9A9A9",
        },
        bg: {
          white: "#FFFFFF",
          "off-white": "#F6F6F6",
          "off-white-20": "#F0F0F0",
          "off-white-50": "#CECECE",
          dark: "#5E5E5E",
          disabled: "#A9A9A9",
          page: "#EEEEEE",
        },
        neutrals: {
          grey2: "#D4D4D4",
          grey3: "#E1DCEB",
          grey4: "#CCC6D9",
        },
        btn: {
          dark: "#181818",
          orange: "#FF5623",
        },
      },
      fontFamily: {
        brand: ["var(--font-bricolage)", "sans-serif"],
        paper: ["var(--font-inter)", "sans-serif"],
        title: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        "4": "4px",
        "8": "8px",
        "10": "10px",
        "12": "12px",
        "15": "15px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "26": "26px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        pill: "100px",
      },
      boxShadow: {
        card: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
        realistic: "0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)",
        illustration: "0px 20px 30px rgba(146,146,146,0.19)",
        "create-pill":
          "inset 0 -1px 3.5px rgba(177,177,177,0.6), inset 0 0 34.5px rgba(255,255,255,0.25)",
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)",
        "logo-gradient": "linear-gradient(180deg, #E56820 0%, #D45E3E 100%)",
      },
      letterSpacing: {
        "brand-xl": "-0.06em",
        "brand-lg": "-0.04em",
        "brand-md": "-0.04em",
        "brand-sm": "-0.04em",
        "brand-xs": "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
