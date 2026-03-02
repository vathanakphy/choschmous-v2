import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendFetch, backendPatch, backendDelete } from '@/lib/api/backend';

type Ctx = { params: Promise<{ id: string }> };

function mapCat(c: any) {
  return {
    id: c.id,
    name: c.category ?? '',
    sportsId: c.sports_id ?? null,
    eventsId: c.events_id ?? null,
    createdAt: c.created_at ?? '',
  };
}

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const raw = await backendFetch<any>(`/org-sports/categories/${(await params).id}`);
    return ok(mapCat(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    const raw = await backendPatch<any>(`/org-sports/categories/${(await params).id}`, body);
    return ok(mapCat(raw));
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await backendDelete(`/org-sports/categories/${(await params).id}`);
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
