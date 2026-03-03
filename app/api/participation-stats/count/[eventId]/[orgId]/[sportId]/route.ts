import { NextRequest } from 'next/server';
import { backendList } from '@/lib/api/backend';
import { ok, handleError } from '@/lib/api/response';

interface SportEventOrg {
  id: number;
  event_id: number;
  organization_id: number;
  sport_id: number;
}

interface ParticipationPerSport {
  id: number;
  sports_Events_id: number;
  male_count: number;
  female_count: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string; orgId: string; sportId: string } }
) {
  try {
    const eventId = parseInt(params.eventId, 10);
    const orgId = parseInt(params.orgId, 10);
    const sportId = parseInt(params.sportId, 10);

    // Find the sports_event_org record
    const { data: seoRecords = [] } = await backendList<SportEventOrg>(
      `/sports-event-org/?event_id=${eventId}&organization_id=${orgId}&sport_id=${sportId}`,
      10,
      0
    );

    if (seoRecords.length === 0) {
      return ok({
        sportsEventOrgId: null,
        ppsId: null,
        maleCount: 0,
        femaleCount: 0,
      });
    }

    const seoId = seoRecords[0].id;

    // Fetch participation-per-sport record
    const { data: ppsRecords = [] } = await backendList<ParticipationPerSport>(
      `/participation-per-sport/?sports_Events_id=${seoId}`,
      10,
      0
    );

    if (ppsRecords.length === 0) {
      return ok({
        sportsEventOrgId: seoId,
        ppsId: null,
        maleCount: 0,
        femaleCount: 0,
      });
    }

    const pps = ppsRecords[0];
    return ok({
      sportsEventOrgId: seoId,
      ppsId: pps.id,
      maleCount: pps.male_count || 0,
      femaleCount: pps.female_count || 0,
    });
  } catch (e) {
    return handleError(e);
  }
}
