import { NextRequest } from 'next/server';
import { ok, handleError } from '@/lib/api/response';
import { backendDelete } from '@/lib/api/backend';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await backendDelete(`/org-sports/links/${(await params).id}`);
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
