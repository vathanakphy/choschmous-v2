// ============================================================
// domains/sport-org-links/sport-org-links.validators.ts
// ============================================================

import { z } from 'zod';

export const createSportOrgLinkSchema = z.object({
    events_id: z.coerce.number().int().positive('ត្រូវបញ្ចូលលេខកូដព្រឹត្តិការណ៍'),
    sports_id: z.coerce.number().int().positive('ត្រូវបញ្ចូលលេខកូដកីឡា'),
    organization_id: z.coerce.number().int().positive('ត្រូវបញ្ចូលលេខកូដស្ថាប័ន'),
});

export const updateSportOrgLinkSchema = z.object({
    id: z.number().int().positive(),
    events_id: z.coerce.number().int().positive().optional(),
    sports_id: z.coerce.number().int().positive().optional(),
    organization_id: z.coerce.number().int().positive().optional(),
});

export const sportOrgLinkFiltersSchema = z.object({
    search: z.string().optional(),
    events_id: z.coerce.number().int().positive().optional(),
    sports_id: z.coerce.number().int().positive().optional(),
    organization_id: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type CreateSportOrgLinkData = z.infer<typeof createSportOrgLinkSchema>;
export type UpdateSportOrgLinkData = z.infer<typeof updateSportOrgLinkSchema>;
