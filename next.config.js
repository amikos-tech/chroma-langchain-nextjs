/** @type {import('next').NextConfig} */
const nextConfig = {
  // (Optional) Export as a static site
  // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
  output: 'export', // Feel free to modify/remove this option
  reactStrictMode: true,
    experimental: {
        urlImports: ['https://unpkg.com/'],
    },
  // Override the default webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Modify the webpack configuration
    config.plugins.push(
        // Ignore node-specific modules when bundling for the browser
        new webpack.IgnorePlugin({
          resourceRegExp: /^onnxruntime-node$|^node:/,
        })
    );

    return config;
  },
};

module.exports = nextConfig;