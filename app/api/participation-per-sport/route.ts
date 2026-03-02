import { backendList } from '@/lib/api/backend';
import { ok, handleError } from '@/lib/api/response';
import { NextRequest } from 'next/server';

type PPS = {
  id: number;
  sports_Events_id: number | null;
  female_count: number;
  male_count: number;
  created_at: string;
};

function map(r: PPS) {
  return {
    id: r.id,
    sportsEventsId: r.sports_Events_id,
    femaleCount: r.female_count,
    maleCount: r.male_count,
    createdAt: r.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get('page') ?? 1));
    const pageSize = Math.min(200, Number(sp.get('pageSize') ?? 100));
    const skip = (page - 1) * pageSize;

    const { data = [], count = 0 } = await backendList<PPS>(
      '/participation-per-sport/',
      pageSize,
      skip
    );

    return ok(data.map(map), { total: count, page, pageSize });
  } catch (e) {
    return handleError(e);
  }
}
