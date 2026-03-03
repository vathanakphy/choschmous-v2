'use client';

import { useCallback, useReducer } from 'react';
import type {
  ParticipationNumberFormData,
  ParticipationNumberErrors,
} from '../types/ParticipationNumber.types';
import { PARTICIPATION_NUMBER_INITIAL } from '../types/ParticipationNumber.types';

type Action =
  | { type: 'SET'; payload: Partial<ParticipationNumberFormData> }
  | { type: 'RESET' };

function reducer(state: ParticipationNumberFormData, action: Action): ParticipationNumberFormData {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.payload };
    case 'RESET':
      return PARTICIPATION_NUMBER_INITIAL;
  }
}

/** Validate a single step — returns an errors object (empty = valid). */
export function validateParticipationNumberStep(
  step: number,
  data: ParticipationNumberFormData
): ParticipationNumberErrors {
  const e: ParticipationNumberErrors = {};
  if (step === 0 && !data.eventId) e.eventId = 'សូមជ្រើសរើសព្រឹត្តិការណ៍';
  if (step === 1 && !data.organizationId) e.organizationId = 'សូមជ្រើសរើសខេត្ត / ស្ថាប័ន';
  if (step === 2 && !data.sportId) e.sportId = 'សូមជ្រើសរើសប្រភេទកីឡា';
  return e;
}

export function useParticipationNumber() {
  const [formData, dispatch] = useReducer(reducer, PARTICIPATION_NUMBER_INITIAL);

  const setFields = useCallback(
    (p: Partial<ParticipationNumberFormData>) => dispatch({ type: 'SET', payload: p }),
    []
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { formData, setFields, reset };
}
