import { NextRequest } from 'next/server';
import { sportOrgLinksService } from '@/domains/sport-org-links';
import { sportOrgLinkFiltersSchema, createSportOrgLinkSchema } from '@/domains/sport-org-links';
import { created, handleError, ok } from '@/lib/api/response';

export async function GET(req: NextRequest) {
    try {
        const filters = sportOrgLinkFiltersSchema.parse(Object.fromEntries(req.nextUrl.searchParams));
        const result = await sportOrgLinksService.getAll(filters);
        return ok(result.data, { total: result.total, page: result.page, pageSize: result.pageSize, totalPages: result.totalPages });
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = createSportOrgLinkSchema.parse(await req.json());
        const result = await sportOrgLinksService.create(data);
        return created(result);
    } catch (e) {
        return handleError(e);
    }
}
