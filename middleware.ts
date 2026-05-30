import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/access", "/api/access", "/_next", "/favicon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("bydes_access")?.value;
  const code = process.env.ACCESS_CODE;

  if (!code || token === code) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/access";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
