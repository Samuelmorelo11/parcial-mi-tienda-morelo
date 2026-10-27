module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Permite importar las migraciones .sql que genera drizzle-kit
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
