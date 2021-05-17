module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            components: './components',
            constants: './constants',
            helpers: './helpers',
            languages: './languages',
            navigation: './navigation',
            screens: './screens',
            shared: './shared',
            store: './store',
            storybook: './storybook',
            utils: './utils',
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ],
          //root: ['./']
        },
      ],
    ],
  };
};
