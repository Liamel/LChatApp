import type { NextConfig } from 'next';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { WebpackPluginInstance } from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/conversations',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove any existing MiniCssExtractPlugin instances
      config.plugins = config.plugins.filter(
        (plugin: WebpackPluginInstance) => !(plugin instanceof MiniCssExtractPlugin)
      );
      
      // Add the plugin with proper configuration
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[contenthash].css',
          chunkFilename: 'static/css/[contenthash].css',
        })
      );
    }
    return config;
  },
};

export default nextConfig;
