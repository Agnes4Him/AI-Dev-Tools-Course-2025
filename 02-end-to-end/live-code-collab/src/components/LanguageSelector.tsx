import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGE_CONFIG, type SupportedLanguage } from '@/types/interview';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as SupportedLanguage)}
      disabled={disabled}
    >
      <SelectTrigger className="w-40 bg-secondary border-border" data-testid="language-selector">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
          <SelectItem key={key} value={key} className="focus:bg-secondary">
            {config.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
