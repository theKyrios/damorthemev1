/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid'
  ],
  theme: {
    extend: {
      height : {
        '94' : '22rem',
        '200' : '54rem'
      },
      colors: {
        'maincolor' : '#e07a5f',
        'secondcolor' : '#3d405b',
        'thirdcolor' : '#a22b34'
  
      }
    },
  },
  plugins: [],
}

