/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/forms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
