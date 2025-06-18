import { updateSession } from "@/utils/supabase/middleware";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest } from "next/server";

type AvailableLocales = {
  es: "es";
  pt: "pt";
  en: "en";
};

export async function middleware(request: NextRequest) {
  let headers = {
    "accept-language": request.headers.get("accept-language") || "en;q=0.5",
  };
  let negotiator = new Negotiator({ headers });
  let languages = negotiator.languages();

  const availableLocales: AvailableLocales = {
    es: "es",
    pt: "pt",
    en: "en",
  };

  let defaultLocale: keyof AvailableLocales = "en";
  let matchedLocale = match(languages, Object.keys(availableLocales), defaultLocale);

  let baseLang = matchedLocale.split("-")[0] as keyof AvailableLocales;
  matchedLocale = availableLocales[baseLang] || "en";

  const response = await updateSession(request);
  response.cookies.set("locale", matchedLocale.slice(0, 2));
  response.headers.set("x-current-path", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
