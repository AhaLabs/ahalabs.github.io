const withPlugins = require("next-compose-plugins");
// Build-time image optimization; see https://github.com/cyrilwanner/next-optimized-images
const optimizedImages = require("next-optimized-images");

module.exports = withPlugins([
  [
    optimizedImages,
    {
      /* config for next-optimized-images */
    },
  ],

  // your other plugins here
]);
