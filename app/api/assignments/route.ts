import { NextRequest } from 'next/server';
import { ok, created, handleError } from '@/lib/api/response';
import { backendList, backendPost } from '@/lib/api/backend';

function mapLink(l: any) {
  return {
    id: l.id,
    eventsId: l.events_id ?? null,
    sportsId: l.sports_id ?? null,
    organizationId: l.organization_id ?? null,
    createdAt: l.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') ?? '500';
    const skip = searchParams.get('skip') ?? '0';
    const eventsId = searchParams.get('events_id');
    const orgId = searchParams.get('organization_id');

    const json = await backendList<any>('/org-sports/links', Number(limit), Number(skip));
    let data = (json.data ?? []).map(mapLink);

    if (eventsId) data = data.filter((d) => String(d.eventsId) === eventsId);
    if (orgId) data = data.filter((d) => String(d.organizationId) === orgId);

    return ok(data, { total: data.length });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = await backendPost<any>('/org-sports/links', {
      events_id: body.eventsId ?? body.events_id,
      sports_id: body.sportsId ?? body.sports_id,
      organization_id: body.organizationId ?? body.organization_id,
    });
    return created(mapLink(raw));
  } catch (e) {
    return handleError(e);
  }
}
