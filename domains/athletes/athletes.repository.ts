// ============================================================
// domains/athletes/athletes.repository.ts
// ============================================================

import { athletesService } from './athletes.service';
import type { AthleteFilters } from './athletes.validators';

export const athletesRepository = {
    async getAll(filters: Partial<AthleteFilters> = {}) {
        return athletesService.getAll(filters);
    },

    async getOne(athleteId: number, enrollmentId: number) {
        return athletesService.getOne(athleteId, enrollmentId);
    },

    async update(enrollmentId: number, data: any) {
        return athletesService.update(enrollmentId, data);
    },

    async delete(athleteId: number) {
        return athletesService.delete(athleteId);
    },
};
