// ============================================================
// app/api/athletes/[id]/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { athletesService } from '@/domains/athletes';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await context.params;
        const id = parseInt(idString, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid athlete ID' }, { status: 400 });
        }

        await athletesService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[DELETE /api/athletes/[id]]', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete athlete' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid enrollment ID' }, { status: 400 });
        }

        const body = await request.json();
        const updated = await athletesService.update(id, body);

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('[PATCH /api/athletes/[id]]', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update athlete' },
            { status: 500 }
        );
    }
}
