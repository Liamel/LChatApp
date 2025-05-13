import type { NextConfig } from 'next';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
