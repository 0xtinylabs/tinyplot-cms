import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Korumalı rotalar - bu rotalara sadece giriş yapmış kullanıcılar erişebilir
const protectedRoutes = ["/files"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Eğer korumalı bir sayfa ise kontrol et
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // Login sayfasına erişmeye çalışıyorsa ve zaten giriş yapmışsa, ana sayfaya yönlendir
  if (pathname === "/login") {
    const token = await getToken({ req: request });
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Eğer korumalı bir sayfaya erişmeye çalışıyorsa ve giriş yapmamışsa, login sayfasına yönlendir
  if (isProtectedRoute) {
    const token = await getToken({ req: request });

    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
