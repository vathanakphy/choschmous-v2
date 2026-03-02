import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendList } from '@/lib/api/backend';

function mapAthlete(a: any) {
  return {
    id: a.id,
    enrollId: a.enroll_id ?? null,
    createdAt: a.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') ?? '500';
    const skip = searchParams.get('skip') ?? '0';

    const json = await backendList<any>('/athletes/', Number(limit), Number(skip));
    const data = (json.data ?? []).map(mapAthlete);
    return ok(data, { total: json.count ?? data.length });
  } catch (e) {
    return handleError(e);
  }
}
