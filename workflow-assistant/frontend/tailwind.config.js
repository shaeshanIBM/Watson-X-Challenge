/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ibm: {
          blue:    '#0f62fe',
          'blue-dark': '#0043ce',
          'blue-light': '#79b8ff',
          gray:    '#f7f8fa',
          border:  '#e5e7eb',
          text:    '#1f2328',
          muted:   '#57606a',
          surface: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
