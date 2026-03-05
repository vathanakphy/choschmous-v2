// ============================================================
// domains/athletes/athletes.types.ts
// ============================================================

export type Athlete = {
    id: number;
    enroll_id: number;
    created_at: string;
};

export type Enrollment = {
    id: number;
    kh_family_name: string;
    kh_given_name: string;
    en_family_name: string;
    en_given_name: string;
    phonenumber: string;
    gender: string;
    nationality: string;
    date_of_birth: string;
    id_document_type: string;
    address: string | null;
    photo_path: string | null;
    documents_path: string | null;
    user_id: number | null;
    created_at: string;
};

export type AthleteParticipation = {
    id: number;
    athletes_id: number;
    events_id: number;
    sports_id: number;
    category_id: number;
    organization_id: number;
    created_at: string;
};

export type AthleteEnriched = Athlete & {
    enrollment?: Enrollment;
    fullName?: string;
    photoUrl?: string;
    sports?: Array<{ id: number; name: string }>;
    organizations?: Array<{ id: number; name: string }>;
};
