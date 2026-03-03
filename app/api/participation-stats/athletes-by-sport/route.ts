import { NextRequest } from 'next/server';
import { ParticipationStatsService, ParticipationStatsRepository } from '@/domains/participation-stats';
import { ok, handleError } from '@/lib/api/response';

const service = new ParticipationStatsService(new ParticipationStatsRepository());

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get('eventId');
    const orgId = req.nextUrl.searchParams.get('orgId');
    const sportId = req.nextUrl.searchParams.get('sportId');

    if (!eventId || !orgId || !sportId) {
      return ok([]);
    }

    const athletes = await service.getAthletesBySport({
      eventId: Number(eventId),
      orgId: Number(orgId),
      sportId: Number(sportId),
    });

    return ok(athletes);
  } catch (e) {
    return handleError(e);
  }
}
