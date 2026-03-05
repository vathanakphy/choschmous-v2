import { NextRequest } from 'next/server';
import { sportOrgLinksService } from '@/domains/sport-org-links';
import { handleError, ok } from '@/lib/api/response';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
    /\/$/,
    ''
);
const API = `${BACKEND_URL}/api`;

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: idString } = await context.params;
        const id = parseInt(idString, 10);
        if (isNaN(id)) throw new Error('Invalid ID');

        const res = await fetch(`${API}/org-sports/links/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to delete link');
        return ok({ success: true });
    } catch (e) {
        return handleError(e);
    }
}
