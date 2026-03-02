import { NextRequest } from 'next/server';
import { ok, created, handleError } from '@/lib/api/response';
import { backendList, backendPost } from '@/lib/api/backend';

function mapEnrollment(e: any) {
  return {
    id: e.id,
    khFamilyName: e.kh_family_name ?? '',
    khGivenName: e.kh_given_name ?? '',
    enFamilyName: e.en_family_name ?? '',
    enGivenName: e.en_given_name ?? '',
    phone: e.phonenumber ?? '',
    gender: e.gender ?? '',
    nationality: e.nationality ?? '',
    dateOfBirth: e.date_of_birth ?? '',
    idDocumentType: e.id_document_type ?? '',
    address: e.address ?? null,
    photoPath: e.photo_path ?? null,
    documentsPath: e.documents_path ?? null,
    userId: e.user_id ?? null,
    createdAt: e.created_at ?? '',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') ?? '20';
    const skip = searchParams.get('skip') ?? '0';
    const page = searchParams.get('page');
    const search = searchParams.get('search') ?? '';

    let computedSkip = skip;
    if (page) {
      computedSkip = String((Number(page) - 1) * Number(limit));
    }

    const json = await backendList<any>('/enrollments/', Number(limit), Number(computedSkip));
    let data = (json.data ?? []).map(mapEnrollment);

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          `${e.khFamilyName} ${e.khGivenName}`.toLowerCase().includes(q) ||
          `${e.enFamilyName} ${e.enGivenName}`.toLowerCase().includes(q) ||
          e.phone.includes(q)
      );
    }

    return ok(data, { total: json.count ?? data.length });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = await backendPost<any>('/enrollments/', body);
    return created(mapEnrollment(raw));
  } catch (e) {
    return handleError(e);
  }
}
