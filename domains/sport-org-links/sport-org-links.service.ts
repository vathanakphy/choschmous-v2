// ============================================================
// domains/sport-org-links/sport-org-links.service.ts
// ============================================================

import type { SportOrgLink, SportOrgLinkEnriched, SportOrgLinkFilters, SportOrgLinkCreateData } from './sport-org-links.types';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
    /\/$/,
    ''
);
const API = `${BACKEND_URL}/api`;

type ListResponse<T> = { data?: T[]; count?: number };

async function fetchList<T>(path: string, limit = 100): Promise<ListResponse<T>> {
    const url = `${API}${path}${path.includes('?') ? '&' : '?'}skip=0&limit=${limit}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Backend request failed (${res.status}): ${body}`);
    }
    return (await res.json()) as ListResponse<T>;
}

export const sportOrgLinksService = {
    async getAll(filters: SportOrgLinkFilters = {}) {
        // Fetch links and related data in parallel
        const [linksRes, eventsRes, sportsRes, orgsRes] = await Promise.all([
            fetchList<SportOrgLink>('/org-sports/links', 500),
            fetchList<{ id: number; name_kh: string }>('/events/', 500),
            fetchList<{ id: number; name_kh: string }>('/sports/', 500),
            fetchList<{ id: number; name_kh: string }>('/organizations/', 500),
        ]);

        let items = linksRes.data ?? [];

        // Filter by ID fields
        if (filters.events_id) items = items.filter((i) => i.events_id === filters.events_id);
        if (filters.sports_id) items = items.filter((i) => i.sports_id === filters.sports_id);
        if (filters.organization_id) items = items.filter((i) => i.organization_id === filters.organization_id);

        // Build lookup maps
        const eventMap = new Map((eventsRes.data ?? []).map((e) => [e.id, e.name_kh]));
        const sportMap = new Map((sportsRes.data ?? []).map((s) => [s.id, s.name_kh]));
        const orgMap = new Map((orgsRes.data ?? []).map((o) => [o.id, o.name_kh]));

        // Enrich items with names
        const enriched: SportOrgLinkEnriched[] = items.map((link) => ({
            ...link,
            eventName: eventMap.get(link.events_id),
            sportName: sportMap.get(link.sports_id),
            organizationName: orgMap.get(link.organization_id),
        }));

        // Pagination
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 20;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paged = enriched.slice(start, end);

        return {
            data: paged,
            total: enriched.length,
            page,
            pageSize: limit,
            totalPages: Math.ceil(enriched.length / limit),
        };
    },

    async create(data: SportOrgLinkCreateData) {
        const res = await fetch(`${API}/org-sports/links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create sport-org link');
        return (await res.json()) as SportOrgLink;
    },

    async delete(id: number) {
        const res = await fetch(`${API}/org-sports/links/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete sport-org link');
    },
};
