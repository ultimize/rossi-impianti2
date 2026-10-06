/** @type {import('next').NextConfig} */
const nextConfig = {
  // ponytail: shop disattivato (solo aziende); le pagine restano nel codice, togli il redirect per riattivarlo
  async redirects() {
    return [
      { source: '/shop', destination: '/', permanent: false },
      { source: '/shop/:path*', destination: '/', permanent: false },
    ];
  },
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
      {
        protocol: 'https',
        hostname: 'igtwzuxufrdflhmwuzpq.supabase.co',
      },
    ],
  },
};

export default nextConfig;
