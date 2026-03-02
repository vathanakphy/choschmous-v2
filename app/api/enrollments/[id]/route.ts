import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendFetch, backendPatch, backendDelete } from '@/lib/api/backend';

type Ctx = { params: Promise<{ id: string }> };

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

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const raw = await backendFetch<any>(`/enrollments/${(await params).id}`);
    return ok(mapEnrollment(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    const raw = await backendPatch<any>(`/enrollments/${(await params).id}`, body);
    return ok(mapEnrollment(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await backendDelete(`/enrollments/${(await params).id}`);
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
