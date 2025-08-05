import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && user.error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // landing
    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
    }
    // login
    if (request.nextUrl.pathname === "/login" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
    }
    // signup
    if (request.nextUrl.pathname === "/signup" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
    }
    // password new
    if (request.nextUrl.pathname === "/password/new" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
    }
    // password reset
    if (request.nextUrl.pathname === "/forgot-password" && !user.error) {
      return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
