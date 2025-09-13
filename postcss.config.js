module.exports = (/* { env } */) => {
  return {
    plugins: {
      '@tailwindcss/postcss': {},
      // 'cssnano': env === 'development' ? false : { preset: 'default' },
      autoprefixer: {}
    }
  };
};
