
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgrammingLanguage } from '../AssessmentLanguageFields';

interface LanguageSelectorProps {
  language: ProgrammingLanguage;
  allowedLanguages: ProgrammingLanguage[];
  enforceLanguage: boolean;
  onLanguageChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  allowedLanguages,
  enforceLanguage,
  onLanguageChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="language">Programming Language <span className="text-red-500">*</span></Label>
      <Select
        value={language}
        onValueChange={onLanguageChange}
        disabled={enforceLanguage && allowedLanguages.length === 1}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {allowedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang === 'cpp' ? 'C++' : lang === 'c' ? 'C' : 'Python'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
