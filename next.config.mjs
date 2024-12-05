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
        source: "/s",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
