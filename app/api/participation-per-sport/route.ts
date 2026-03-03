import { NextRequest } from 'next/server';
import { ParticipationStatsService, ParticipationStatsRepository } from '@/domains/participation-stats';
import { ok, created, handleError } from '@/lib/api/response';

const service = new ParticipationStatsService(new ParticipationStatsRepository());

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get('page') ?? 1));
    const pageSize = Math.min(500, Number(sp.get('pageSize') ?? 100));
    const result = await service.listParticipationPerSport({ page, pageSize });
    return ok(result.data, result.meta);
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const row = await service.createParticipationPerSport({
      sportsEventsId: body.sportsEventsId ?? body.sports_Events_id ?? null,
      femaleCount: body.femaleCount ?? body.female_count ?? 0,
      maleCount: body.maleCount ?? body.male_count ?? 0,
    });
    return created(row);
  } catch (e) {
    return handleError(e);
  }
}
