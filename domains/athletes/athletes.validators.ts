// ============================================================
// domains/athletes/athletes.validators.ts
// ============================================================

import { z } from 'zod';

export const athleteFiltersSchema = z.object({
    search: z.string().optional(),
    sports_id: z.number().int().positive().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(500).default(100),
});

export const athleteUpdateSchema = z.object({
    photo_path: z.string().url().optional(),
    phonenumber: z.string().optional(),
    address: z.string().optional().nullable(),
});

export type AthleteFilters = z.infer<typeof athleteFiltersSchema>;
export type AthleteUpdateData = z.infer<typeof athleteUpdateSchema>;
