const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const { join } = require('path');

module.exports = {
  content: [
    // join(__dirname, "src/**/!(*.stories|*.spec).{js,html}")
    join(__dirname, 'src/**/*.{js,html}')
  ],
  theme: {
    extend: {},
    fontFamily: {
      ...defaultTheme.fontFamily,
      rubik: ['Rubik', 'sans-serif']
    },
    colors: {
      ...defaultTheme.colors({ colors }),
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        50: '',
        100: '',
        200: '',
        300: '',
        400: '',
        500: '',
        600: '',
        700: '',
        800: '',
        900: ''
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant, e }) {
      addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-first${separator}${className}`)}:not(:first-child)`;
        });
      });
    }),
    plugin(function ({ addVariant, e }) {
      addVariant('not-last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-last${separator}${className}`)}:not(:last-child)`;
        });
      });
    }),
    plugin(({ addVariant, theme }) => {
      const groups = theme('groups') || [];

      groups.forEach(group => {
        addVariant(`group-${group}-hover`, () => {
          return `:merge(.group-${group}):hover &`;
        });
      });
    })
  ]
};
