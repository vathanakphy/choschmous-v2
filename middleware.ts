// import { NextRequest, NextResponse } from 'next/server';
// import { getIronSession } from 'iron-session';
// import { SESSION_COOKIE_NAME } from '@/config/constants';
// import { Role } from '@/config/roles';
// import { ROUTES } from '@/config/routes';
// import type { SessionData } from '@/infrastructure/session/session.service';

// const SESSION_PASSWORD = process.env.SESSION_SECRET ?? 'change-this-secret-to-at-least-32-chars!!';

// // ⚠️ TEMPORARY: Auth disabled for development
// // TODO: Re-enable authentication before production
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Auth check temporarily disabled - remove this return to re-enable
//   // return NextResponse.next();

//   if (pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) {
//     const res = NextResponse.next();

//     const session = await getIronSession<SessionData>(req, res, {
//       password: SESSION_PASSWORD,
//       cookieName: SESSION_COOKIE_NAME,
//     });

//     if (!session.userId) return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.url));

//     if (pathname.startsWith('/superadmin') && session.role !== Role.SUPERADMIN)
//       return NextResponse.redirect(new URL(ROUTES.ADMIN.ROOT, req.url));

//     return res;
//   }

//   return NextResponse.next();
// }

// export const config = { matcher: ['/admin/:path*', '/superadmin/:path*'] };


// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SESSION_COOKIE_NAME } from '@/config/constants';
import { Role } from '@/config/roles';
import { ROUTES } from '@/config/routes';
import type { SessionData } from '@/infrastructure/session/session.service';

// FIX 1: Throw at startup if secret is missing/weak — never silently use a fallback
function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('[middleware] SESSION_SECRET must be set and at least 32 chars.');
  }
  return secret;
}

const SESSION_PASSWORD: string = getSessionPassword();

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  const session = await getIronSession<SessionData>(req, res, {
    password: SESSION_PASSWORD,
    cookieName: SESSION_COOKIE_NAME,
  });

  // FIX 2: Preserve callbackUrl so user lands back after login
  if (!session.userId) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // FIX 3: Superadmin check was missing the case where an ADMIN hits /admin — allow it
  if (pathname.startsWith('/superadmin') && session.role !== Role.SUPERADMIN) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.ROOT, req.url));
  }

  return res;
}

export const config = { matcher: ['/admin/:path*', '/superadmin/:path*'] };