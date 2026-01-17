const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/worldtimeapi\.org\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'worldtimeapi-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/set-timer-for-:slug',
        destination: '/set-timer-for/:slug',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
