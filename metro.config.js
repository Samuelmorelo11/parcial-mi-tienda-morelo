const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro debe reconocer los archivos .sql de la carpeta drizzle/
config.resolver.sourceExts.push('sql');

module.exports = config;
