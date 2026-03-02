import { requireSession } from '@/infrastructure/session';
import { handleError, ok } from '@/lib/api/response';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
  /\/$/,
  ''
);
const API = `${BACKEND_URL}/api`;

/* ------------------------------------------------------------------ */
/*  Backend shape helpers                                              */
/* ------------------------------------------------------------------ */

type ListResponse<T> = { data?: T[]; count?: number };

type BackendEvent = { id: number; name_kh?: string; type?: string; created_at?: string };
type BackendSport = { id: number; name_kh?: string; sport_type?: string; created_at?: string };
type BackendOrganization = { id: number; name_kh?: string; type?: string };
type BackendEnrollment = {
  id: number;
  kh_family_name?: string;
  kh_given_name?: string;
  en_family_name?: string;
  en_given_name?: string;
  gender?: string;
  phonenumber?: string;
  created_at?: string;
};
type Participation = { organization_id?: number | null };

async function fetchList<T>(path: string, limit = 100): Promise<ListResponse<T>> {
  const url = `${API}${path}${path.includes('?') ? '&' : '?'}skip=0&limit=${limit}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Dashboard backend request failed (${res.status}): ${body}`);
  }
  return (await res.json()) as ListResponse<T>;
}

/* ------------------------------------------------------------------ */
/*  GET /api/dashboard                                                 */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    await requireSession();

    const [
      eventsRes,
      sportsRes,
      orgRes,
      enrollmentsCountRes,
      enrollmentsRecentRes,
      athletePartFull,
      leaderPartFull,
    ] = await Promise.all([
      fetchList<BackendEvent>('/events/', 10),
      fetchList<BackendSport>('/sports/', 10),
      fetchList<BackendOrganization>('/organizations/', 1000),
      fetchList<BackendEnrollment>('/enrollments/', 1), // count only
      fetchList<BackendEnrollment>('/enrollments/', 10), // recent records
      fetchList<Participation>('/athlete-participation/', 500),
      fetchList<Participation>('/leader-participation/', 500),
    ]);

    const events = eventsRes.data ?? [];
    const sports = sportsRes.data ?? [];
    const organizations = orgRes.data ?? [];
    const recentEnrollmentsRaw = enrollmentsRecentRes.data ?? [];
    const athleteParticipation = athletePartFull.data ?? [];
    const leaderParticipation = leaderPartFull.data ?? [];

    /* ── top organizations ── */
    const orgById = new Map(organizations.map((o) => [o.id, o]));
    const byOrganization = new Map<string, { count: number; type?: string }>();

    for (const item of [...athleteParticipation, ...leaderParticipation]) {
      if (!item.organization_id) continue;
      const org = orgById.get(item.organization_id);
      if (!org) continue;
      const key = org.name_kh ?? `Organization ${org.id}`;
      const prev = byOrganization.get(key) ?? { count: 0, type: org.type };
      byOrganization.set(key, { count: prev.count + 1, type: org.type });
    }

    const topOrganizations = [...byOrganization.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([name, { count, type }]) => ({ name, participants: count, type: type ?? '' }));

    /* ── gender distribution from recent enrollments ── */
    const genderDistribution = { male: 0, female: 0, other: 0 };
    for (const e of recentEnrollmentsRaw) {
      const g = (e.gender ?? '').toLowerCase();
      if (g === 'male') genderDistribution.male++;
      else if (g === 'female') genderDistribution.female++;
      else genderDistribution.other++;
    }

    /* ── recent enrollments ── */
    const recentEnrollments = recentEnrollmentsRaw.slice(0, 8).map((e) => ({
      id: e.id,
      khName: `${e.kh_family_name ?? ''} ${e.kh_given_name ?? ''}`.trim() || `#${e.id}`,
      enName: `${e.en_family_name ?? ''} ${e.en_given_name ?? ''}`.trim(),
      gender: e.gender ?? '',
      phone: e.phonenumber ?? '',
      createdAt: e.created_at ?? '',
    }));

    const athleteCount = athletePartFull.count ?? athleteParticipation.length;
    const leaderCount = leaderPartFull.count ?? leaderParticipation.length;

    return ok({
      stats: {
        events: eventsRes.count ?? events.length,
        sports: sportsRes.count ?? sports.length,
        participants: athleteCount + leaderCount,
        registrations: enrollmentsCountRes.count ?? 0,
        organizations: orgRes.count ?? organizations.length,
        athletes: athleteCount,
        leaders: leaderCount,
      },
      events: events.map((e) => ({
        id: e.id,
        name: e.name_kh ?? `Event ${e.id}`,
        type: e.type ?? '',
        createdAt: e.created_at ?? '',
      })),
      sports: sports.map((s) => ({
        id: s.id,
        name: s.name_kh ?? `Sport ${s.id}`,
        sportType: s.sport_type ?? '',
        createdAt: s.created_at ?? '',
      })),
      topOrganizations,
      recentEnrollments,
      genderDistribution,
    });
  } catch (e) {
    return handleError(e);
  }
}
