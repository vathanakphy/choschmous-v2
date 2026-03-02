import { NextRequest } from 'next/server';
import { ok, created, handleError } from '@/lib/api/response';
import { backendList, backendPost } from '@/lib/api/backend';

function mapCategory(c: any) {
  return {
    id: c.id,
    name: c.category ?? '',
    sportsId: c.sports_id ?? null,
    eventsId: c.events_id ?? null,
    createdAt: c.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit') ?? '100';
    const skip = searchParams.get('skip') ?? '0';
    const search = searchParams.get('search') ?? '';

    let computedSkip = skip;
    if (page) {
      computedSkip = String((Number(page) - 1) * Number(limit));
    }

    const json = await backendList<any>(
      '/org-sports/categories/',
      Number(limit),
      Number(computedSkip)
    );
    let data = (json.data ?? []).map(mapCategory);

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(q));
    }

    return ok(data, { total: json.count ?? data.length });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = await backendPost<any>('/org-sports/categories', body);
    return created(mapCategory(raw));
  } catch (e) {
    return handleError(e);
  }
}
