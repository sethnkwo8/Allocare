// Interface for header props
export interface ProfileSettingsHeaderProps {
    onSave(): void;
    hasChanges: boolean;
    isSaving: boolean;
}