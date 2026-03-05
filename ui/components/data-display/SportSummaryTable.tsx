/**
 * SportSummaryTable — themed data table for sports participant counts.
 *
 * Leaders (ក្រុមប្រឹក្សា / delegation) are rendered in the first two columns
 * and **are included** in the "សរុប" total column.  The grand total at the
 * bottom is the sum of all four counts from each row.
 *
 * Used in both SportTableStep (editable inputs) and ConfirmByNumberStep (read-only).
 * Eliminates the ~120-line inline style-heavy grid duplicated between those two files.
 *
 * @example
 * <SportSummaryTable
 *   rows={formData.sportSelections}
 *   mode="readonly"
 * />
 *
 * <SportSummaryTable
 *   rows={formData.sportSelections}
 *   mode="editable"
 *   onChangeCount={setCount}
 *   hasRowError={(sel) => sel.maleCount === 0 && sel.femaleCount === 0 && !!errors.sportSelections}
 * />
 */

'use client';

import * as React from 'react';

// ── Types ─────────────────────────────────────────────────────

export interface SportRow {
  sportsEventOrgId: number;
  sportName: string;
  maleCount: number;
  femaleCount: number;
  leader_female_count: number;
  leader_male_count: number;
}

interface SportSummaryTableProps {
  rows: SportRow[];
  /** "editable" renders number inputs; "readonly" renders ✓/— */
  mode?: 'editable' | 'readonly';
  // we allow updating either athlete or leader counts; the reducer in the
  // by-number feature only handles athletes today, but the table itself
  // is generic/independent of the workflow.
  onChangeCount?: (
    id: number,
    gender:
      | 'maleCount'
      | 'femaleCount'
      | 'leader_male_count'
      | 'leader_female_count',
    value: number
  ) => void;
  /** Per-row error check (only for editable mode) */
  hasRowError?: (row: SportRow) => boolean;
}

// ── CSS variable colors (registration palette) ────────────────

const COL = {
  headerBg: 'var(--reg-indigo-600)',
  headerBorder: 'oklch(1 0 0 / 0.2)',
  border: 'var(--reg-slate-200)',
  rowAlt: 'var(--reg-indigo-50)',
  maleColor: 'var(--reg-indigo-600)',
  femaleColor: 'var(--reg-purple-600)',
  textDark: 'var(--reg-slate-800)',
  textMed: 'var(--reg-slate-700)',
  summaryBg: 'var(--reg-indigo-50)',
  summaryBorder: 'var(--reg-indigo-200)',
} as const;

// ── Component ─────────────────────────────────────────────────

export function SportSummaryTable({
  rows,
  mode = 'readonly',
  onChangeCount,
  hasRowError,
}: SportSummaryTableProps) {
  // grand sums; the total column should include all four values per row
  const totalMale = rows.reduce((s, r) => s + (r.maleCount || 0), 0);
  const totalFemale = rows.reduce((s, r) => s + (r.femaleCount || 0), 0);
  const totalLeaderMale = rows.reduce((s, r) => s + (r.leader_male_count || 0), 0);
  const totalLeaderFemale = rows.reduce((s, r) => s + (r.leader_female_count || 0), 0);
  const totalAll = totalMale + totalFemale + totalLeaderMale + totalLeaderFemale;

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: COL.border }}>
      {/* ── Header ────────────────────────────────────── */}
      <div
        className="grid text-center text-xs font-semibold tracking-wide uppercase"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          backgroundColor: COL.headerBg,
          color: 'white',
        }}
      >
        <div className="px-4 py-3 text-left">ប្រភេទកីឡា</div>
        <HeaderCell>គណៈប្រតិភូបុរស</HeaderCell>
        <HeaderCell>គណៈប្រតិភូនារី</HeaderCell>
        <HeaderCell>កីឡាករ</HeaderCell>
        <HeaderCell>កីឡាការនី</HeaderCell>
        <HeaderCell>សរុប</HeaderCell>
      </div>

      {/* ── Data rows ─────────────────────────────────── */}
      {rows.map((row, idx) => {
        // include every field in the row total
        const rowTotal =
          (row.maleCount || 0) +
          (row.femaleCount || 0) +
          (row.leader_male_count || 0) +
          (row.leader_female_count || 0);

        const isError = hasRowError?.(row) ?? false;

        return (
          <div
            key={row.sportsEventOrgId}
            className="grid items-center text-center"
            style={{
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
              borderTop: '1px solid',
              borderColor: COL.border,
              backgroundColor: isError
                ? 'oklch(1 0.02 25 / 0.06)'
                : idx % 2 === 0
                  ? 'white'
                  : COL.rowAlt,
            }}
          >
            {/* Sport name */}
            <div
              className="px-4 py-2.5 text-left text-sm font-medium"
              style={{ color: COL.textDark }}
            >
              {row.sportName}
            </div>

            {/* Leader Male */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.leader_male_count}
                  onValueChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'leader_male_count', v)}
                  color={COL.maleColor}
                />
              ) : (
                <span style={{ color: COL.maleColor }}>
                  {row.leader_male_count > 0 ? row.leader_male_count : '—'}
                </span>
              )}
            </DataCell>

            {/* Leader Female */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.leader_female_count}
                  onValueChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'leader_female_count', v)}
                  color={COL.femaleColor}
                />
              ) : (
                <span style={{ color: COL.femaleColor }}>
                  {row.leader_female_count > 0 ? row.leader_female_count : '—'}
                </span>
              )}
            </DataCell>

            {/* Male Athletes */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.maleCount}
                  onValueChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'maleCount', v)}
                  color={COL.maleColor}
                />
              ) : (
                <span style={{ color: COL.maleColor }}>
                  {row.maleCount > 0 ? row.maleCount : '—'}
                </span>
              )}
            </DataCell>

            {/* Female Athletes */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.femaleCount}
                  onValueChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'femaleCount', v)}
                  color={COL.femaleColor}
                />
              ) : (
                <span style={{ color: COL.femaleColor }}>
                  {row.femaleCount > 0 ? row.femaleCount : '—'}
                </span>
              )}
            </DataCell>

            {/* Row Total */}
            <div
              className="border-l px-4 py-2.5 text-sm font-semibold"
              style={{ borderColor: COL.border, color: COL.textMed }}
            >
              {rowTotal}
            </div>
          </div>
        );
      })}

      {/* ── Totals row ────────────────────────────────── */}
      <div
        className="grid text-center text-sm font-bold"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          borderTop: '2px solid',
          borderColor: COL.summaryBorder,
          backgroundColor: COL.summaryBg,
        }}
      >
        <div className="px-4 py-3 text-left" style={{ color: COL.textMed }}>
          សរុប
        </div>
        <div
          className="border-l px-4 py-3"
          style={{ borderColor: COL.border, color: COL.maleColor }}
        >
          {totalLeaderMale}
        </div>
        <div
          className="border-l px-4 py-3"
          style={{ borderColor: COL.border, color: COL.femaleColor }}
        >
          {totalLeaderFemale}
        </div>
        <div
          className="border-l px-4 py-3"
          style={{ borderColor: COL.border, color: COL.maleColor }}
        >
          {totalMale}
        </div>
        <div
          className="border-l px-4 py-3"
          style={{ borderColor: COL.border, color: COL.femaleColor }}
        >
          {totalFemale}
        </div>
        <div
          className="border-l px-4 py-3"
          style={{ borderColor: COL.border, color: COL.textDark }}
        >
          {totalAll}
        </div>
      </div>
    </div>
  );
}

// ── Private sub-components ────────────────────────────────────

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l px-4 py-3" style={{ borderColor: COL.headerBorder }}>
      {children}
    </div>
  );
}

function DataCell({ children, borderColor }: { children: React.ReactNode; borderColor: string }) {
  return (
    <div className="border-l px-3 py-2" style={{ borderColor }}>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onValueChange,
  color,
}: {
  value: number;
  onValueChange?: (v: number) => void;
  color: string;
}) {
  // event handler typed to avoid implicit any and make the naming clear
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    onValueChange?.(isNaN(v) || v < 0 ? 0 : v);
  };

  return (
    <input
      type="number"
      min={0}
      value={value === 0 ? '' : value}
      placeholder="0"
      onChange={handleChange}
      className="w-full rounded-lg border px-2 py-1 text-center text-sm font-medium transition outline-none focus:ring-2"
      style={{
        borderColor: value > 0 ? color : 'var(--reg-slate-200)',
        color: value > 0 ? color : 'var(--reg-slate-400)',
        backgroundColor: value > 0 ? `color-mix(in oklch, ${color} 8%, white)` : 'white',
        // @ts-ignore
        '--tw-ring-color': color,
      }}
    />
  );
}
