import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const locale = (await cookies()).get("locale")?.value || "en";

  let messages;

  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../locales/en.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
