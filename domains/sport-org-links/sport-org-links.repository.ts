// ============================================================
// domains/sport-org-links/sport-org-links.repository.ts
// ============================================================

import type { SportOrgLink, SportOrgLinkFilters } from './sport-org-links.types';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
    /\/$/,
    ''
);
const API = `${BACKEND_URL}/api`;

export const sportOrgLinksRepository = {
    async findMany(filters: SportOrgLinkFilters = {}) {
        const params = new URLSearchParams({
            skip: String((filters.page ? filters.page - 1 : 0) * (filters.limit ?? 20)),
            limit: String(filters.limit ?? 20),
        });

        const res = await fetch(`${API}/org-sports/links?${params}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch links');

        const data = (await res.json()) as { data?: SportOrgLink[] };
        return data.data ?? [];
    },

    async findById(id: number) {
        const links = await this.findMany({ limit: 1000 });
        return links.find((l) => l.id === id);
    },
};
