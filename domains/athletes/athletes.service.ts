// ============================================================
// domains/athletes/athletes.service.ts
// ============================================================

import type { Athlete, AthleteEnriched, Enrollment, AthleteParticipation } from './athletes.types';
import type { AthleteFilters, AthleteUpdateData } from './athletes.validators';

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

async function fetchOne<T>(path: string): Promise<T> {
    const url = `${API}${path}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Backend request failed (${res.status}): ${body}`);
    }
    return (await res.json()) as T;
}

export const athletesService = {
    async getAll(filters: Partial<AthleteFilters> = {}) {
        try {
            // Fetch athletes first
            const athletesRes = await fetchList<Athlete>('/athletes', 500);
            let athletes = athletesRes.data ?? [];

            if (!athletes.length) {
                return {
                    data: [],
                    total: 0,
                    page: filters.page ?? 1,
                    pageSize: filters.limit ?? 100,
                    totalPages: 0,
                };
            }

            // Fetch enrollments
            const enrollmentsRes = await fetchList<Enrollment>('/enrollments', 500);
            const enrollmentMap = new Map((enrollmentsRes.data ?? []).map((e) => [e.id, e]));

            // Fetch participations
            const participationsRes = await fetchList<AthleteParticipation>('/athlete-participation', 500);
            const athleteParticipations = new Map<number, AthleteParticipation[]>();
            (participationsRes.data ?? []).forEach((p) => {
                if (!athleteParticipations.has(p.athletes_id)) {
                    athleteParticipations.set(p.athletes_id, []);
                }
                athleteParticipations.get(p.athletes_id)!.push(p);
            });

            // Fetch sports
            const sportsRes = await fetchList<{ id: number; name_kh: string }>('/sports/', 500);
            const sportMap = new Map((sportsRes.data ?? []).map((s) => [s.id, s.name_kh]));

            // Fetch organizations
            const orgsRes = await fetchList<{ id: number; name_kh: string }>('/organizations/', 500);
            const orgMap = new Map((orgsRes.data ?? []).map((o) => [o.id, o.name_kh]));

            // Filter by sport if provided
            if (filters.sports_id) {
                const athleteIdsBySport = new Set(
                    (participationsRes.data ?? [])
                        .filter((p) => p.sports_id === filters.sports_id)
                        .map((p) => p.athletes_id)
                );
                athletes = athletes.filter((a) => athleteIdsBySport.has(a.id));
            }

            // Enrich athletes with all information
            let enriched: AthleteEnriched[] = athletes.map((athlete) => {
                const enrollment = enrollmentMap.get(athlete.enroll_id);
                const fullName = enrollment
                    ? `${enrollment.kh_family_name} ${enrollment.kh_given_name}`
                    : 'N/A';

                // Get unique sports and organizations for this athlete
                const participations = athleteParticipations.get(athlete.id) ?? [];
                const uniqueSports = new Map<number, string>();
                const uniqueOrgs = new Map<number, string>();

                participations.forEach((p) => {
                    const sportName = sportMap.get(p.sports_id);
                    if (sportName) uniqueSports.set(p.sports_id, sportName);
                    const orgName = orgMap.get(p.organization_id);
                    if (orgName) uniqueOrgs.set(p.organization_id, orgName);
                });

                return {
                    ...athlete,
                    enrollment,
                    fullName,
                    photoUrl: enrollment?.photo_path ?? undefined,
                    sports: Array.from(uniqueSports.entries()).map(([id, name]) => ({ id, name })),
                    organizations: Array.from(uniqueOrgs.entries()).map(([id, name]) => ({ id, name })),
                };
            });

            // Apply search filter if provided
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                enriched = enriched.filter((a) => {
                    const name = a.fullName?.toLowerCase() ?? '';
                    const phone = a.enrollment?.phonenumber?.toLowerCase() ?? '';
                    const sports = a.sports?.map(s => s.name.toLowerCase()).join(' ') ?? '';
                    const orgs = a.organizations?.map(o => o.name.toLowerCase()).join(' ') ?? '';
                    return name.includes(searchLower) || phone.includes(searchLower) || sports.includes(searchLower) || orgs.includes(searchLower);
                });
            }

            // Pagination
            const page = filters.page ?? 1;
            const limit = filters.limit ?? 100;
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
        } catch (error) {
            console.error('Error in athletesService.getAll:', error);
            throw error;
        }
    },

    async getOne(athleteId: number, enrollmentId: number) {
        const [athlete, enrollment] = await Promise.all([
            fetchOne<Athlete>(`/athletes/${athleteId}`),
            fetchOne<Enrollment>(`/enrollments/${enrollmentId}`),
        ]);

        return {
            ...athlete,
            enrollment,
            fullName: `${enrollment.kh_family_name} ${enrollment.kh_given_name}`,
            photoUrl: enrollment.photo_path ?? undefined,
        } as AthleteEnriched;
    },

    async update(enrollmentId: number, data: AthleteUpdateData) {
        const res = await fetch(`${API}/enrollments/${enrollmentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update athlete');
        return (await res.json()) as Enrollment;
    },

    async delete(athleteId: number) {
        const res = await fetch(`${API}/athletes/${athleteId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to delete athlete');
        return res.ok;
    },
};
