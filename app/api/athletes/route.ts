import { NextRequest, NextResponse } from 'next/server';
import { athletesService } from '@/domains/athletes';
import { athleteFiltersSchema } from '@/domains/athletes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      sports_id: searchParams.get('sport') ? parseInt(searchParams.get('sport')!, 10) : undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '100', 10),
    };

    const validated = athleteFiltersSchema.parse(filters);
    const result = await athletesService.getAll(validated);

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('[GET /api/athletes]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}
