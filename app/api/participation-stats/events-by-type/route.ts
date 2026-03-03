import { NextRequest } from 'next/server';
import { ParticipationStatsService, ParticipationStatsRepository } from '@/domains/participation-stats';
import { ok, handleError } from '@/lib/api/response';

const service = new ParticipationStatsService(new ParticipationStatsRepository());

export async function GET(req: NextRequest) {
  try {
    const events = await service.getEventsByType();
    return ok(events);
  } catch (e) {
    return handleError(e);
  }
}
