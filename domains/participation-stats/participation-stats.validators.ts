// ============================================================
// domains/participation-stats/participation-stats.validators.ts
// Zod schemas for participation statistics validation
// ============================================================

import { z } from 'zod';

// ── Participation Per Sport ───────────────────────────────────

export const createParticipationPerSportSchema = z.object({
  sportsEventsId: z.number().nullable().optional(),
  femaleCount: z.number().int().min(0).optional().default(0),
  maleCount: z.number().int().min(0).optional().default(0),
});

export const participationPerSportFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(500).optional().default(100),
});

// ── Athletes by Sport ─────────────────────────────────────────

export const athletesBySportFiltersSchema = z.object({
  eventId: z.coerce.number().int().min(1),
  orgId: z.coerce.number().int().min(1),
  sportId: z.coerce.number().int().min(1),
});

// ── By Event Filters ──────────────────────────────────────────

export const byEventFiltersSchema = z.object({
  eventId: z.coerce.number().int().min(1),
});

// ── Type Exports ──────────────────────────────────────────────

export type CreateParticipationPerSportData = z.infer<typeof createParticipationPerSportSchema>;
export type ParticipationPerSportFiltersData = z.infer<typeof participationPerSportFiltersSchema>;
export type AthletesBySportFiltersData = z.infer<typeof athletesBySportFiltersSchema>;
export type ByEventFiltersData = z.infer<typeof byEventFiltersSchema>;
