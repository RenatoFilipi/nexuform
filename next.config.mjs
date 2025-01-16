import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./utils/i18n/request.ts");

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
      {
        source: "/legal",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
