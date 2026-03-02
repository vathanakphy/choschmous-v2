'use client';

import { Users } from 'lucide-react';
import type { GenderDistribution } from '../types/Dashboard.types';

type GenderChartProps = {
  distribution: GenderDistribution;
  isLoading: boolean;
};

export function GenderChart({ distribution, isLoading }: GenderChartProps) {
  const total = distribution.male + distribution.female + distribution.other;
  const pctMale = total > 0 ? Math.round((distribution.male / total) * 100) : 0;
  const pctFemale = total > 0 ? Math.round((distribution.female / total) * 100) : 0;
  const pctOther = total > 0 ? 100 - pctMale - pctFemale : 0;

  const segments = [
    { label: 'ប្រុស', value: distribution.male, pct: pctMale, color: 'bg-chart-1' },
    { label: 'ស្រី', value: distribution.female, pct: pctFemale, color: 'bg-chart-4' },
    { label: 'ផ្សេងទៀត', value: distribution.other, pct: pctOther, color: 'bg-chart-3' },
  ].filter((s) => s.value > 0);

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="bg-chart-5/15 flex h-8 w-8 items-center justify-center rounded-lg">
          <Users className="text-chart-5 h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold">ការបែងចែកភេទ</h2>
      </div>

      {total === 0 && !isLoading ? (
        <p className="text-muted-foreground text-sm">មិនទាន់មានទិន្នន័យទេ។</p>
      ) : (
        <div className="space-y-5">
          {/* Horizontal bar chart */}
          <div className="bg-muted flex h-4 overflow-hidden rounded-full">
            {segments.map((s) => (
              <div
                key={s.label}
                className={`${s.color} transition-all duration-700`}
                style={{ width: `${s.pct}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'ប្រុស', value: distribution.male, pct: pctMale, color: 'bg-chart-1' },
              { label: 'ស្រី', value: distribution.female, pct: pctFemale, color: 'bg-chart-4' },
              { label: 'ផ្សេង', value: distribution.other, pct: pctOther, color: 'bg-chart-3' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="mx-auto mb-2 flex items-center justify-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground text-xs">{item.label}</span>
                </div>
                <p className="text-foreground text-2xl font-bold">{item.value}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{item.pct}%</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-muted/50 rounded-lg px-4 py-2 text-center">
            <p className="text-muted-foreground text-xs">
              សរុប: <span className="text-foreground font-semibold">{total}</span> នាក់
              (ចុះឈ្មោះថ្មីៗ)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
