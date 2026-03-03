// ============================================================
// ui/features/participation-number/types/ParticipationNumber.types.ts
// ============================================================

export interface ParticipationNumberFormData {
  // Step 0 — event
  eventId: string;
  eventName: string;
  eventType: string;
  // Step 1 — org
  organizationId: string;
  organizationName: string;
  organizationType: string;
  // Step 2 — sport
  sportId: string;
  sportName: string;
  // Step 3 — count (loaded from API, editable)
  sportsEventOrgId: number | null; // sports_event_org.id  →  sports_Events_id in PPS
  ppsId: number | null;             // participation_per_sport.id (null = not yet created)
  maleCount: number;
  femaleCount: number;
}

export type ParticipationNumberErrors = Partial<{
  eventId: string;
  organizationId: string;
  sportId: string;
}>;

export const PARTICIPATION_NUMBER_INITIAL: ParticipationNumberFormData = {
  eventId: '',
  eventName: '',
  eventType: '',
  organizationId: '',
  organizationName: '',
  organizationType: '',
  sportId: '',
  sportName: '',
  sportsEventOrgId: null,
  ppsId: null,
  maleCount: 0,
  femaleCount: 0,
};
