import type {
  NextRequest,
  NextResponse as NextResponseType,
} from "next/server";
import { NextResponse } from "next/server";
import { parseSetCookie } from "cookie";

import { checkServerSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const applySessionCookies = (
  response: NextResponseType,
  setCookieHeader: string | string[],
) => {
  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieString of cookies) {
    const parsedCookie = parseSetCookie(cookieString);

    if (!parsedCookie.value) {
      continue;
    }

    response.cookies.set({
      name: parsedCookie.name,
      value: parsedCookie.value,
      path: parsedCookie.path,
      domain: parsedCookie.domain,
      expires: parsedCookie.expires,
      httpOnly: parsedCookie.httpOnly,
      secure: parsedCookie.secure,
      maxAge: parsedCookie.maxAge,
      sameSite: parsedCookie.sameSite as "lax" | "strict" | "none" | undefined,
    });
  }

  return response;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Access token існує — користувач авторизований.
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    return NextResponse.next();
  }

  // Access token відсутній, але є refresh token.
  if (refreshToken) {
    try {
      const sessionResponse = await checkServerSession();
      const setCookieHeader = sessionResponse.headers["set-cookie"];

      if (setCookieHeader) {
        if (isPublicRoute) {
          const response = NextResponse.redirect(
            new URL("/profile", request.url),
          );

          return applySessionCookies(response, setCookieHeader);
        }

        if (isPrivateRoute) {
          const response = NextResponse.next();

          return applySessionCookies(response, setCookieHeader);
        }
      }
    } catch {
      // Refresh token недійсний або сесія завершилася.
      // Нижче користувач буде перенаправлений або допущений
      // відповідно до типу маршруту.
    }
  }

  // Неавторизованому користувачу дозволяємо sign-in та sign-up.
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Неавторизований користувач не може відкрити profile або notes.
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
