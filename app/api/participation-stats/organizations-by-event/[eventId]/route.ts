import { NextRequest } from 'next/server';
import { ParticipationStatsService, ParticipationStatsRepository } from '@/domains/participation-stats';
import { ok, handleError } from '@/lib/api/response';

const service = new ParticipationStatsService(new ParticipationStatsRepository());

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const organizations = await service.getOrganizationsByEvent({ eventId: Number(eventId) });
        return ok(organizations);
    } catch (e) {
        return handleError(e);
    }
}