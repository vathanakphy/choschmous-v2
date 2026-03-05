// ============================================================
// domains/sport-org-links/sport-org-links.types.ts
// ============================================================

export type SportOrgLink = {
    id: number;
    events_id: number;
    sports_id: number;
    organization_id: number;
    created_at: string;
};

export type SportOrgLinkEnriched = SportOrgLink & {
    eventName?: string;
    sportName?: string;
    organizationName?: string;
};

export type SportOrgLinkFilters = {
    search?: string;
    events_id?: number;
    sports_id?: number;
    organization_id?: number;
    page?: number;
    limit?: number;
};

export type SportOrgLinkCreateData = {
    events_id: number;
    sports_id: number;
    organization_id: number;
};
