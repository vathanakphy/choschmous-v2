// ============================================================
// domains/sports/sports.types.ts
// Matches backend: Sports table + SportPublic schema
// ============================================================

/** Maps to: Sports table (id, name_kh, sport_type, created_at) */
export interface Sport {
  id: number;
  name: string; // mapped from name_kh
  sportType: string | null; // mapped from sport_type
  createdAt: string;
}

/**
 * Maps to: Sports_event_org table
 * Junction table linking Sports × Events × Organization
 */
export interface SportEventOrg {
  id: number;
  eventsId: number; // FK → Events.id
  sportsId: number; // FK → Sports.id
  organizationId: number; // FK → Organization.id
  createdAt: string;
}

// ── DTOs ──────────────────────────────────────────────────────

/** Backend SportCreate: { name_kh, sport_type } */
export interface CreateSportInput {
  name_kh: string;
  sport_type: string;
}

/** Backend SportUpdate: { name_kh?, sport_type? } */
export interface UpdateSportInput {
  id: number;
  name_kh?: string;
  sport_type?: string;
}

/** Sport enriched with participation counts for dashboard display */
export interface SportSummary {
  id: number;
  name: string;
  sportType: string | null;
  totalAthletes: number;
  totalLeaders: number;
  totalParticipants: number;
  categories: string[];
  createdAt: string;
}

// ── Filters ───────────────────────────────────────────────────

export interface SportFilters {
  search?: string;
  eventId?: number;
  page?: number;
  limit?: number;
  skip?: number;
}
