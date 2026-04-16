// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.saleswatch.id',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
