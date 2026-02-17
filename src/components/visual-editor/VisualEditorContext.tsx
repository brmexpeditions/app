import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings, VisualElementStyle } from '../../types';

interface VisualEditorContextType {
    isEditing: boolean;
    toggleEditing: () => void;
    selectedElementId: string | null;
    selectElement: (id: string | null) => void;
    overrides: Record<string, VisualElementStyle>;
    updateStyle: (elementId: string, style: VisualElementStyle) => void;
    saveChanges: () => void;
    resetElement: (elementId: string) => void;
    hasUnsavedChanges: boolean;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

interface VisualEditorProviderProps {
    children: ReactNode;
    initialSettings: SiteSettings;
    onSave: (settings: SiteSettings) => void;
    isAdmin: boolean;
}

export function VisualEditorProvider({ children, initialSettings, onSave, isAdmin }: VisualEditorProviderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [overrides, setOverrides] = useState<Record<string, VisualElementStyle>>(initialSettings.visualOverrides || {});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Sync with prop changes if not editing (or if hard reload happened)
    useEffect(() => {
        if (!hasUnsavedChanges) {
            setOverrides(initialSettings.visualOverrides || {});
        }
    }, [initialSettings, hasUnsavedChanges]);

    const toggleEditing = () => {
        if (!isAdmin) return;
        setIsEditing(!isEditing);
        setSelectedElementId(null);
    };

    const selectElement = (id: string | null) => {
        if (!isEditing) return;
        setSelectedElementId(id);
    };

    const updateStyle = (elementId: string, style: VisualElementStyle) => {
        setOverrides((prev) => ({
            ...prev,
            [elementId]: { ...prev[elementId], ...style },
        }));
        setHasUnsavedChanges(true);
    };

    const resetElement = (elementId: string) => {
        setOverrides((prev) => {
            const next = { ...prev };
            delete next[elementId];
            return next;
        });
        setHasUnsavedChanges(true);
    };

    const saveChanges = () => {
        const newSettings = {
            ...initialSettings,
            visualOverrides: overrides,
        };
        onSave(newSettings);
        setHasUnsavedChanges(false);
    };

    return (
        <VisualEditorContext.Provider
            value={{
                isEditing,
                toggleEditing,
                selectedElementId,
                selectElement,
                overrides,
                updateStyle,
                saveChanges,
                resetElement,
                hasUnsavedChanges,
            }}
        >
            {children}
        </VisualEditorContext.Provider>
    );
}

export function useVisualEditor() {
    const context = useContext(VisualEditorContext);
    if (context === undefined) {
        throw new Error('useVisualEditor must be used within a VisualEditorProvider');
    }
    return context;
}
