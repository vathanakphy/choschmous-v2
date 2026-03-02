import { backendFetch, backendDelete as bDelete } from '@/lib/api/backend';
import { ok, handleError } from '@/lib/api/response';
import { NextRequest } from 'next/server';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const r = await backendFetch<Record<string, unknown>>(`/athlete-participation/${id}`);
    return ok(r);
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await bDelete(`/athlete-participation/${id}`);
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
