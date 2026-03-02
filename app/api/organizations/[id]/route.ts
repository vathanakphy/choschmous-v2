import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendFetch, backendPatch, backendDelete } from '@/lib/api/backend';

type Ctx = { params: Promise<{ id: string }> };

function mapOrg(e: any) {
  return {
    id: e.id,
    name: e.name_kh ?? e.name ?? '',
    type: e.type ?? '',
    code: e.code ?? null,
    createdAt: e.created_at ?? '',
  };
}

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const raw = await backendFetch<any>(`/organizations/${(await params).id}`);
    return ok(mapOrg(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    const raw = await backendPatch<any>(`/organizations/${(await params).id}`, body);
    return ok(mapOrg(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await backendDelete(`/organizations/${(await params).id}`);
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
