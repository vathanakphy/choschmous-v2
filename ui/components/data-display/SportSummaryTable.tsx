/**
 * SportSummaryTable — themed data table for sports participant counts.
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
}

interface SportSummaryTableProps {
  rows: SportRow[];
  /** "editable" renders number inputs; "readonly" renders ✓/— */
  mode?: 'editable' | 'readonly';
  onChangeCount?: (id: number, gender: 'maleCount' | 'femaleCount', value: number) => void;
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
  const totalMale = rows.reduce((s, r) => s + (r.maleCount || 0), 0);
  const totalFemale = rows.reduce((s, r) => s + (r.femaleCount || 0), 0);
  const totalAll = totalMale + totalFemale;

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: COL.border }}>
      {/* ── Header ────────────────────────────────────── */}
      <div
        className="grid text-center text-xs font-semibold tracking-wide uppercase"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          backgroundColor: COL.headerBg,
          color: 'white',
        }}
      >
        <div className="px-4 py-3 text-left">ប្រភេទកីឡា</div>
        <HeaderCell>បុរស</HeaderCell>
        <HeaderCell>នារី</HeaderCell>
        <HeaderCell>សរុប</HeaderCell>
      </div>

      {/* ── Data rows ─────────────────────────────────── */}
      {rows.map((row, idx) => {
        const rowTotal = (row.maleCount || 0) + (row.femaleCount || 0);
        const isError = hasRowError?.(row) ?? false;

        return (
          <div
            key={row.sportsEventOrgId}
            className="grid items-center text-center"
            style={{
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
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

            {/* Male */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.maleCount}
                  onChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'maleCount', v)}
                  color={COL.maleColor}
                />
              ) : (
                <span style={{ color: COL.maleColor }}>{row.maleCount > 0 ? '✓' : '—'}</span>
              )}
            </DataCell>

            {/* Female */}
            <DataCell borderColor={COL.border}>
              {mode === 'editable' ? (
                <NumberInput
                  value={row.femaleCount}
                  onChange={(v) => onChangeCount?.(row.sportsEventOrgId, 'femaleCount', v)}
                  color={COL.femaleColor}
                />
              ) : (
                <span style={{ color: COL.femaleColor }}>{row.femaleCount > 0 ? '✓' : '—'}</span>
              )}
            </DataCell>

            {/* Row total */}
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
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
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
  onChange,
  color,
}: {
  value: number;
  onChange?: (v: number) => void;
  color: string;
}) {
  return (
    <input
      type="number"
      min={0}
      value={value === 0 ? '' : value}
      placeholder="0"
      onChange={(e) => {
        const v = parseInt(e.target.value, 10);
        onChange?.(isNaN(v) || v < 0 ? 0 : v);
      }}
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
