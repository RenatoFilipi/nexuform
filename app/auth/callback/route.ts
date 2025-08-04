import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const redirectTo = requestUrl.searchParams.get("redirect_to") ?? "/dashboard/account/password";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (token && type === "recovery") {
    const supabase = await createClient();
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    });
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
