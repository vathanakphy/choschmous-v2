// ============================================================
// ui/features/bynumber/types/ByNumber.types.ts
// ============================================================

export interface ByNumberFormData {
  eventId: string;
  eventName: string;
  organizationId: string;
  organizationName: string;
  organizationType: 'province' | 'ministry' | '';
  sportSelections: SportSelection[];
}

export interface SportSelection {
  sportsEventOrgId: number; // sports_event_org.id → used as sports_Events_id in backend
  sportId: number;
  sportName: string;
  maleCount: number;
  femaleCount: number;
  leader_male_count: number;   // delegation leaders
  leader_female_count: number;
}

export type ByNumberErrors = Partial<{
  eventId: string;
  organizationId: string;
  sportSelections: string;
}>;

export const BYNUMBER_INITIAL: ByNumberFormData = {
  eventId: '',
  eventName: '',
  organizationId: '',
  organizationName: '',
  organizationType: '',
  sportSelections: [],
};
