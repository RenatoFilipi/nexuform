import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const locale = (await cookies()).get("locale")?.value || "en";
  //const locale = "es";

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
});
