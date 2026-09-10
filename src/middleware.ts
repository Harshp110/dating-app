import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (path.startsWith("/profile") || path.startsWith("/onboarding") || path.startsWith("/discover") || path.startsWith("/connections") || path.startsWith("/chat") || path.startsWith("/admin")) return NextResponse.redirect(new URL("/login", request.url));
    return response;
  }
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => cookies.forEach(({ name, value, options }) => { request.cookies.set(name, value); response = NextResponse.next({ request }); response.cookies.set(name, value, options); }) } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && (path.startsWith("/profile") || path.startsWith("/onboarding"))) return NextResponse.redirect(new URL("/login", request.url));
  if (user && (path === "/login" || path === "/signup")) return NextResponse.redirect(new URL("/profile", request.url));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
