import { NextRequest } from 'next/server';
import { ok, created, handleError } from '@/lib/api/response';
import { backendList, backendPost } from '@/lib/api/backend';

function mapOrg(e: any) {
  return {
    id: e.id,
    name: e.name_kh ?? e.name ?? '',
    type: e.type ?? '',
    code: e.code ?? null,
    createdAt: e.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') ?? '100';
    const skip = searchParams.get('skip') ?? '0';
    const page = searchParams.get('page');
    const search = searchParams.get('search') ?? '';

    let computedSkip = skip;
    if (page) {
      computedSkip = String((Number(page) - 1) * Number(limit));
    }

    const json = await backendList<any>('/organizations/', Number(limit), Number(computedSkip));
    let data = (json.data ?? []).map(mapOrg);

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (o) => o.name.toLowerCase().includes(q) || (o.code ?? '').toLowerCase().includes(q)
      );
    }

    return ok(data, { total: json.count ?? data.length });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await backendPost<any>('/organizations/', body);
    return created(mapOrg(result));
  } catch (e) {
    return handleError(e);
  }
}
