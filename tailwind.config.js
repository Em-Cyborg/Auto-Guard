/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'sidebar': 'var(--sidebar-background)',
      },
      textColor: {
        'sidebar-foreground': 'var(--sidebar-foreground)',
      },
    },
  },
  plugins: [],
}