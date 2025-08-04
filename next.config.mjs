import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./utils/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/organizations",
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
      {
        source: "/dashboard/account",
        destination: "/dashboard/account/general",
        permanent: true,
      },
    ];
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
