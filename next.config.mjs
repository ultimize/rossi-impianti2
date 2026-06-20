/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
