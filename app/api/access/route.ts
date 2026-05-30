import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const expected = process.env.ACCESS_CODE;

  if (!expected || code !== expected) {
    return NextResponse.json({ error: "wrong_code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("bydes_access", code, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
  });
  return res;
}
