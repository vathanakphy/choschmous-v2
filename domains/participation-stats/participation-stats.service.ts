// ============================================================
// domains/participation-stats/participation-stats.service.ts
// Business logic layer for participation statistics
// ============================================================

import { ParticipationStatsRepository } from './participation-stats.repository';
import {
  createParticipationPerSportSchema,
  participationPerSportFiltersSchema,
  athletesBySportFiltersSchema,
  byEventFiltersSchema,
} from './participation-stats.validators';
import type {
  ParticipationPerSportFilters,
  AthletesBySportFilters,
  ByEventFilters,
  CreateParticipationPerSportInput,
} from './participation-stats.types';
import { toPageMeta } from '@/lib/utils/transformers';

export class ParticipationStatsService {
  constructor(private repo: ParticipationStatsRepository) {}

  // ── Participation Per Sport ─────────────────────────────────

  async listParticipationPerSport(filters: ParticipationPerSportFilters) {
    const parsed = participationPerSportFiltersSchema.parse(filters);
    const { data, total } = await this.repo.listParticipationPerSport(parsed);
    return {
      data,
      meta: toPageMeta(total, { page: parsed.page, pageSize: parsed.pageSize }),
    };
  }

  async createParticipationPerSport(input: CreateParticipationPerSportInput) {
    const parsed = createParticipationPerSportSchema.parse(input);
    return this.repo.createParticipationPerSport(parsed);
  }

  // ── Athletes by Sport ───────────────────────────────────────

  async getAthletesBySport(filters: AthletesBySportFilters) {
    const parsed = athletesBySportFiltersSchema.parse(filters);
    return this.repo.findAthletesBySport(parsed);
  }

  // ── Sports by Event ─────────────────────────────────────────

  async getSportsByEvent(filters: ByEventFilters) {
    const parsed = byEventFiltersSchema.parse(filters);
    return this.repo.findSportsByEvent(parsed);
  }

  // ── Organizations by Event ──────────────────────────────────

  async getOrganizationsByEvent(filters: ByEventFilters) {
    const parsed = byEventFiltersSchema.parse(filters);
    return this.repo.findOrganizationsByEvent(parsed);
  }

  // ── Events by Type ──────────────────────────────────────────

  async getEventsByType() {
    return this.repo.findEventsByType();
  }
}
