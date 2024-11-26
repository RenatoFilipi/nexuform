/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/forms",
        permanent: true,
      },
      {
        source: "/dashboard/editor",
        destination: "/dashboard/forms",
        permanent: true,
      },
      {
        source: "/dashboard/submission",
        destination: "/dashboard/forms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
