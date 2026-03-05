'use client';

import { useCallback, useReducer } from 'react';
import type { ByNumberFormData, ByNumberErrors, SportSelection } from '../types/ByNumber.types';
import { BYNUMBER_INITIAL } from '../types/ByNumber.types';

type GenderKey =
  | 'maleCount'
  | 'femaleCount'
  | 'leader_male_count'
  | 'leader_female_count';

// even though the by‑number flow only stores the athlete counts, the
// helpers are generic so that the table component can be reused elsewhere
// (and avoid type mismatches during editing).

type Action =
  | { type: 'SET'; payload: Partial<ByNumberFormData> }
  | { type: 'RESET' }
  | { type: 'SET_COUNT'; sportsEventOrgId: number; gender: GenderKey; value: number }
  | { type: 'INIT_SPORTS'; sports: SportSelection[] };

function reducer(state: ByNumberFormData, action: Action): ByNumberFormData {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.payload };
    case 'RESET':
      return BYNUMBER_INITIAL;
    case 'INIT_SPORTS':
      return { ...state, sportSelections: action.sports };
    case 'SET_COUNT':
      return {
        ...state,
        sportSelections: state.sportSelections.map((sel) =>
          sel.sportsEventOrgId === action.sportsEventOrgId
            ? { ...sel, [action.gender]: action.value }
            : sel
        ),
      };
  }
}

export function validateByNumberStep(step: number, data: ByNumberFormData): ByNumberErrors {
  const e: ByNumberErrors = {};
  if (step === 0 && !data.eventId) e.eventId = 'សូមជ្រើសរើសព្រឹត្តិការណ៍';
  if (step === 1 && !data.organizationId) e.organizationId = 'សូមជ្រើសរើសអង្គភាព';
  if (step === 2) {
    const hasInvalid = data.sportSelections.some(
      (s) => s.maleCount === 0 && s.femaleCount === 0
    );
    if (data.sportSelections.length === 0 || hasInvalid)
      e.sportSelections = 'សូមបំពេញចំនួនយ៉ាងហោចណាស់មួយសម្រាប់រៀងរាល់កីឡា';
  }
  return e;
}

export function useByNumber() {
  const [formData, dispatch] = useReducer(reducer, BYNUMBER_INITIAL);

  const setFields = useCallback(
    (p: Partial<ByNumberFormData>) => dispatch({ type: 'SET', payload: p }),
    []
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const initSports = useCallback(
    (sports: SportSelection[]) => dispatch({ type: 'INIT_SPORTS', sports }),
    []
  );
  const setCount = useCallback(
    (sportsEventOrgId: number, gender: GenderKey, value: number) =>
      dispatch({ type: 'SET_COUNT', sportsEventOrgId, gender, value }),
    []
  );

  return { formData, setFields, reset, initSports, setCount };
}
