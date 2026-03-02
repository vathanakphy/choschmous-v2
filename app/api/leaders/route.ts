import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendList } from '@/lib/api/backend';

function mapLeader(l: any) {
  return {
    id: l.id,
    leaderRole: l.LeaderRole ?? null,
    enrollId: l.enroll_id ?? null,
    createdAt: l.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') ?? '500';
    const skip = searchParams.get('skip') ?? '0';

    const json = await backendList<any>('/leaders/', Number(limit), Number(skip));
    const data = (json.data ?? []).map(mapLeader);
    return ok(data, { total: json.count ?? data.length });
  } catch (e) {
    return handleError(e);
  }
}
