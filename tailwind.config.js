/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0B0F17",
        cardbg: "#111827",
        bordercolor: "#1F2937",
        accentblue: "#0EA5E9",
        accentgreen: "#10B981",
        accentyellow: "#F59E0B",
        accentred: "#EF4444",
      },
    },
  },
  plugins: [],
};