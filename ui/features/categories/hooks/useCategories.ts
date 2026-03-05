import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'categories_wizard_state';

export interface CategoriesFormData {
    // Event Type
    eventType: string;
    // Event
    eventId: string;
    eventName: string;
    // Sport
    sportId: string;
    sportName: string;
    // Sub Sport (Category)
    categoryId: string;
    categoryName: string;
}

export interface CategoriesErrors {
    [key: string]: string;
}

const INITIAL_FORM_DATA: CategoriesFormData = {
    eventType: '',
    eventId: '',
    eventName: '',
    sportId: '',
    sportName: '',
    categoryId: '',
    categoryName: '',
};

export function useCategories() {
    const [formData, setFormData] = useState<CategoriesFormData>(INITIAL_FORM_DATA);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setFormData(parsed);
            }
        } catch (err) {
            console.warn('[useCategories] Failed to load from localStorage:', err);
        }
        setIsHydrated(true);
    }, []);

    // Save to localStorage whenever formData changes
    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        } catch (err) {
            console.warn('[useCategories] Failed to save to localStorage:', err);
        }
    }, [formData, isHydrated]);

    const setFields = useCallback((fields: Partial<CategoriesFormData>) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.warn('[useCategories] Failed to clear localStorage:', err);
        }
    }, []);

    const resetFromStep = useCallback(
        (stepIndex: number) => {
            // When user changes selection at a step, clear all subsequent steps
            const cleared = { ...formData };
            switch (stepIndex) {
                case 0: // Event Type selected
                    cleared.eventId = '';
                    cleared.eventName = '';
                    cleared.sportId = '';
                    cleared.sportName = '';
                    cleared.categoryId = '';
                    cleared.categoryName = '';
                    break;
                case 1: // Event selected
                    cleared.sportId = '';
                    cleared.sportName = '';
                    cleared.categoryId = '';
                    cleared.categoryName = '';
                    break;
                case 2: // Sport selected
                    cleared.categoryId = '';
                    cleared.categoryName = '';
                    break;
            }
            setFormData(cleared);
        },
        [formData]
    );

    return {
        formData,
        setFields,
        resetForm,
        resetFromStep,
        isHydrated,
    };
}

export function clearCategoriesStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.warn('[clearCategoriesStorage] Failed:', err);
    }
}

export function validateStep(stepIndex: number, formData: CategoriesFormData): CategoriesErrors {
    const errors: CategoriesErrors = {};
    const stepKeys: (keyof CategoriesFormData)[] = [
        'eventType',
        'eventId',
        'sportId',
        'categoryId',
    ];
    const stepKey = stepKeys[stepIndex];

    if (stepIndex < 4) {
        if (!formData[stepKey]) {
            errors[stepKey] = 'ឆ្លងផុត';
        }
    }

    return errors;
}
