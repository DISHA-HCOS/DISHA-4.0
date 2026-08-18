import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DIST_DIR || '.next',
  output: 'standalone',

  async redirects() {
    return [
      { source: '/industries/higher-education', destination: '/industries/education-universities', permanent: true },
      { source: '/industries/k12-education', destination: '/industries/education-universities', permanent: true },
      { source: '/industries/healthcare', destination: '/industries/healthcare-pharma', permanent: true },
      { source: '/industries/clinical-research', destination: '/industries/research-organizations', permanent: true },
      { source: '/industries/logistics', destination: '/industries/transportation-logistics', permanent: true },
    ];
  },

  async headers() {
    return [
      // CSS MIME type headers — ensures browsers never reject stylesheets as wrong MIME
      {
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'Content-Type', value: 'text/css; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // JS static chunks — long-term caching with immutable flag
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Iframe preview cache-busting — HTML pages must revalidate so iframe always gets fresh content
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  serverExternalPackages: [
    'snarkjs',
    'circomlibjs',
    'neo4j-driver',
    'nats',
    'fastify',
    'pg',
    'ws',
    'prisma',
    '@prisma/client',
  ],

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
    formats: ['image/avif', 'image/webp'],
  },

  webpack(config, { dev, isServer }) {
    if (!isServer) {
      // Ensure Node.js core module fallbacks for client bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };

      // Vendor chunk splitting with stable cache groups
      // Uses contenthash so filenames change only when content changes (long-term caching)
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // React + ReactDOM in a single stable chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                name: 'vendor-react',
                chunks: 'all',
                priority: 40,
                enforce: true,
              },
              // Large UI / charting libraries
              ui: {
                test: /[\\/]node_modules[\\/](recharts|@heroicons)[\\/]/,
                name: 'vendor-ui',
                chunks: 'all',
                priority: 30,
                enforce: true,
              },
              // All remaining node_modules
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor-libs',
                chunks: 'all',
                priority: 20,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }

    return config;
  }
};
export default nextConfig;