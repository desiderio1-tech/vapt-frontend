import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vapt: {
          blue: "#002B5C",       // Azul principal (do logótipo)
          lightBlue: "#0A4D9C",  // Azul mais claro
          green: "#00A859",      // Verde dos botões
          gray: "#F5F5F5",       // Cinzento de fundo
          dark: "#1A1A1A",       // Texto escuro
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;