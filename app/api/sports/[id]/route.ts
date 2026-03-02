import { NextRequest } from 'next/server';
import { sportsService } from '@/domains/sports';
import { handleError, ok } from '@/lib/api/response';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    return ok(await sportsService.getById(Number((await params).id)));
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    return ok(await sportsService.update({ id: Number((await params).id), ...body }));
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await sportsService.remove(Number((await params).id));
    return ok({ deleted: true });
  } catch (e) {
    return handleError(e);
  }
}
