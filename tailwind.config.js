module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './layouts/*.{js,ts,jsx,tsx}', './components/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'dark': '#1e1e1e',
        'admin': '#F6F7FC',
        'admin-100': '#F0F3F8',
        'admin-200': '#D8DFF4',
        'admin-sidebar': '#6A75CA'
      }
    },
  }
}
