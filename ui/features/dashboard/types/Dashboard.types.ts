export type DashboardStats = {
  events: number;
  sports: number;
  participants: number;
  registrations: number;
  organizations: number;
  athletes: number;
  leaders: number;
};

export type DashboardEvent = {
  id: number;
  name: string;
  type: string;
  createdAt: string;
};

export type DashboardSport = {
  id: number;
  name: string;
  sportType?: string;
  createdAt: string;
};

export type TopOrganization = {
  name: string;
  participants: number;
  type?: string;
};

export type RecentEnrollment = {
  id: number;
  khName: string;
  enName: string;
  gender: string;
  phone: string;
  createdAt: string;
};

export type GenderDistribution = {
  male: number;
  female: number;
  other: number;
};

export type DashboardPayload = {
  stats: DashboardStats;
  events: DashboardEvent[];
  sports: DashboardSport[];
  topOrganizations: TopOrganization[];
  recentEnrollments: RecentEnrollment[];
  genderDistribution: GenderDistribution;
};
