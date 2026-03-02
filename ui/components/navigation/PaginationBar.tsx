'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';

type PaginationBarProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
};

export function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationBarProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t px-2 pt-4">
      <p className="text-muted-foreground text-xs">
        បង្ហាញ {from}–{to} ក្នុង {total}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm font-medium">
          {page} / {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
