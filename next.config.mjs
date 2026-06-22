/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rossimpiantisrl.it',
      },
      {
        protocol: 'https',
        hostname: 'kbhfrqksazdrmboeuftd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
