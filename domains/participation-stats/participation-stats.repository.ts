// ============================================================
// domains/participation-stats/participation-stats.repository.ts
// Calls FastAPI backend for participation statistics
// ============================================================

import type {
  ParticipationPerSport,
  CreateParticipationPerSportInput,
  RawParticipationPerSport,
  RawAthleteParticipation,
  RawSportEventOrg,
  RawEvent,
  Athlete,
  Sport,
  Organization,
  Event,
  ParticipationPerSportFilters,
  AthletesBySportFilters,
  ByEventFilters,
} from './participation-stats.types';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
  /\/+$/,
  ''
);
const API = `${BACKEND_URL}/api`;

// ── Mappers ───────────────────────────────────────────────────

function mapParticipationPerSport(r: RawParticipationPerSport): ParticipationPerSport {
  return {
    id: r.id,
    sportsEventsId: r.sports_Events_id,
    femaleCount: r.female_count,
    maleCount: r.male_count,
    createdAt: r.created_at,
  };
}

function mapAthlete(raw: RawAthleteParticipation['athlete']): Athlete {
  return {
    id: raw.id,
    khFamilyName: raw.kh_family_name || '',
    khGivenName: raw.kh_given_name || '',
    enFamilyName: raw.en_family_name || '',
    enGivenName: raw.en_given_name || '',
    gender: raw.gender || '',
    dateOfBirth: raw.date_of_birth || '',
    createdAt: raw.created_at || '',
  };
}

// ── Repository Class ──────────────────────────────────────────

export class ParticipationStatsRepository {
  // ── Participation Per Sport ─────────────────────────────────

  async listParticipationPerSport(
    filters: ParticipationPerSportFilters = {}
  ): Promise<{ data: ParticipationPerSport[]; total: number }> {
    const { page = 1, pageSize = 100 } = filters;
    const skip = (page - 1) * pageSize;

    const res = await fetch(`${API}/participation-per-sport/?skip=${skip}&limit=${pageSize}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);

    const json = await res.json();
    return {
      data: (json.data ?? []).map(mapParticipationPerSport),
      total: json.count ?? 0,
    };
  }

  async createParticipationPerSport(
    input: CreateParticipationPerSportInput
  ): Promise<ParticipationPerSport> {
    const res = await fetch(`${API}/participation-per-sport/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sports_Events_id: input.sportsEventsId ?? null,
        female_count: input.femaleCount ?? 0,
        male_count: input.maleCount ?? 0,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create participation' }));
      throw new Error(err.detail ?? 'Failed to create participation');
    }
    return mapParticipationPerSport(await res.json());
  }

  // ── Athletes by Sport ───────────────────────────────────────

  async findAthletesBySport(filters: AthletesBySportFilters): Promise<Athlete[]> {
    const { eventId, orgId, sportId } = filters;

    const query = `/athlete-participations/?event_id=${eventId}&organization_id=${orgId}&sport_id=${sportId}`;
    const res = await fetch(`${API}${query}&skip=0&limit=1000`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Backend ${res.status}`);

    const json = await res.json();
    const participations: RawAthleteParticipation[] = json.data ?? json ?? [];

    return participations.map((p) => mapAthlete(p.athlete));
  }

  // ── Sports by Event ─────────────────────────────────────────

  async findSportsByEvent(filters: ByEventFilters): Promise<Sport[]> {
    const { eventId } = filters;

    const res = await fetch(`${API}/sports-event-org/?event_id=${eventId}&skip=0&limit=1000`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);

    const json = await res.json();
    const records: RawSportEventOrg[] = json.data ?? json ?? [];

    // Extract unique sports
    const sportsMap = new Map<number, Sport>();
    records.forEach((record) => {
      if (record.sport?.id) {
        sportsMap.set(record.sport.id, {
          id: record.sport.id,
          name: record.sport.name || '',
        });
      }
    });

    return Array.from(sportsMap.values());
  }

  // ── Organizations by Event ──────────────────────────────────

  async findOrganizationsByEvent(filters: ByEventFilters): Promise<Organization[]> {
    const { eventId } = filters;

    const res = await fetch(`${API}/org-sports/links?skip=0&limit=1000`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);

    const json = await res.json();
    const allRecords: RawSportEventOrg[] = json.data ?? json ?? [];

    // Filter by eventId and deduplicate organizations
    const orgsMap = new Map<number, Organization>();
    allRecords
      .filter((record) => String(record.events_id) === String(eventId))
      .forEach((record) => {
        if (record.organization?.id) {
          orgsMap.set(record.organization.id, {
            id: record.organization.id,
            name: record.organization.name || '',
            type: record.organization.type || '',
          });
        }
      });

    return Array.from(orgsMap.values());
  }

  // ── Events by Type ──────────────────────────────────────────

  async findEventsByType(): Promise<Event[]> {
    const res = await fetch(`${API}/events/?skip=0&limit=1000`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Backend ${res.status}`);

    const json = await res.json();
    const events: RawEvent[] = json.data ?? json ?? [];

    return events.map((e) => ({
      id: e.id,
      name: e.name || e.name_kh || '',
      type: e.type || 'Other',
    }));
  }
}
