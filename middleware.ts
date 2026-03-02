import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SESSION_COOKIE_NAME } from '@/config/constants';
import { Role } from '@/config/roles';
import { ROUTES } from '@/config/routes';
import type { SessionData } from '@/infrastructure/session/session.service';

const SESSION_PASSWORD = process.env.SESSION_SECRET ?? 'change-this-secret-to-at-least-32-chars!!';

// ⚠️ TEMPORARY: Auth disabled for development
// TODO: Re-enable authentication before production
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth check temporarily disabled - remove this return to re-enable
  // return NextResponse.next();

  if (pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) {
    const res = NextResponse.next();

    const session = await getIronSession<SessionData>(req, res, {
      password: SESSION_PASSWORD,
      cookieName: SESSION_COOKIE_NAME,
    });

    if (!session.userId) return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.url));

    if (pathname.startsWith('/superadmin') && session.role !== Role.SUPERADMIN)
      return NextResponse.redirect(new URL(ROUTES.ADMIN.ROOT, req.url));

    return res;
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/superadmin/:path*'] };
