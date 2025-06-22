import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
    console.log('Current language after change:', i18n.language);
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[150px]">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}