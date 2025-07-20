import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This is required for environments like Firebase Studio
  // where the development server is proxied.
  experimental: {
    allowedForwardedHosts: ['localhost', process.env.HOSTNAME!],
    allowedDevOrigins: ['https://*.cloudworkstations.dev', 'https://*.firebase.studio'],
  },
};

export default nextConfig;
