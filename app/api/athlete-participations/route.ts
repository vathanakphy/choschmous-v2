import { backendList, backendPost } from '@/lib/api/backend';
import { ok, created, handleError } from '@/lib/api/response';
import { NextRequest } from 'next/server';

type AP = {
  id: number;
  athletes_id: number | null;
  events_id: number | null;
  sports_id: number | null;
  category_id: number | null;
  organization_id: number | null;
  created_at: string;
};

function map(r: AP) {
  return {
    id: r.id,
    athletesId: r.athletes_id,
    eventsId: r.events_id,
    sportsId: r.sports_id,
    categoryId: r.category_id,
    organizationId: r.organization_id,
    createdAt: r.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get('page') ?? 1));
    const pageSize = Math.min(200, Number(sp.get('pageSize') ?? 50));
    const skip = (page - 1) * pageSize;

    const { data = [], count = 0 } = await backendList<AP>(
      '/athlete-participation/',
      pageSize,
      skip
    );

    return ok(data.map(map), { total: count, page, pageSize });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = {
      athletes_id: body.athletesId ?? body.athletes_id,
      events_id: body.eventsId ?? body.events_id,
      sports_id: body.sportsId ?? body.sports_id,
      category_id: body.categoryId ?? body.category_id,
      organization_id: body.organizationId ?? body.organization_id,
    };
    const row = await backendPost<AP>('/athlete-participation/', payload);
    return created(map(row));
  } catch (e) {
    return handleError(e);
  }
}
