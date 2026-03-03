// ============================================================
// domains/participation-stats/index.ts
// Public exports for participation-stats domain
// ============================================================

export { ParticipationStatsService } from './participation-stats.service';
export { ParticipationStatsRepository } from './participation-stats.repository';

export type {
  Organization,
  Sport,
  Event,
  Athlete,
  ParticipationPerSport,
  CreateParticipationPerSportInput,
  ParticipationPerSportFilters,
  AthletesBySportFilters,
  ByEventFilters,
} from './participation-stats.types';

export {
  createParticipationPerSportSchema,
  participationPerSportFiltersSchema,
  athletesBySportFiltersSchema,
  byEventFiltersSchema,
} from './participation-stats.validators';
