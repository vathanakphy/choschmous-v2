// ============================================================
// domains/participation-stats/participation-stats.types.ts
// Types for participation statistics (athletes, sports, events, organizations)
// ============================================================

// ── Base Types ────────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
  type: string;
}

export interface Sport {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  type: string;
}

export interface Athlete {
  id: number;
  khFamilyName: string;
  khGivenName: string;
  enFamilyName: string;
  enGivenName: string;
  gender: string;
  dateOfBirth: string;
  createdAt: string;
}

// ── Participation Per Sport ───────────────────────────────────

export interface ParticipationPerSport {
  id: number;
  sportsEventsId: number | null;
  femaleCount: number;
  maleCount: number;
  createdAt: string;
}

export interface CreateParticipationPerSportInput {
  sportsEventsId?: number | null;
  femaleCount?: number;
  maleCount?: number;
}

// ── Raw Backend Types ─────────────────────────────────────────

export interface RawParticipationPerSport {
  id: number;
  sports_Events_id: number | null;
  female_count: number;
  male_count: number;
  created_at: string;
}

export interface RawAthleteParticipation {
  athlete_id: number;
  sport_id: number;
  organization_id: number;
  event_id: number;
  athlete: {
    id: number;
    kh_family_name: string;
    kh_given_name: string;
    en_family_name: string;
    en_given_name: string;
    gender: string;
    date_of_birth: string;
    created_at: string;
  };
}

export interface RawSportEventOrg {
  id: number;
  events_id: number;
  organization_id: number;
  sport_id?: number;
  organization?: {
    id: number;
    name: string;
    type: string;
  };
  sport?: {
    id: number;
    name: string;
  };
}

export interface RawEvent {
  id: number;
  name: string;
  name_kh?: string;
  type: string;
}

// ── Filter Types ──────────────────────────────────────────────

export interface ParticipationPerSportFilters {
  page?: number;
  pageSize?: number;
}

export interface AthletesBySportFilters {
  eventId: number;
  orgId: number;
  sportId: number;
}

export interface ByEventFilters {
  eventId: number | string;
}
