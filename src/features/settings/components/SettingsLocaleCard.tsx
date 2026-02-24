import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Language = 'ru' | 'en';

export default function SettingsLocaleCard() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'ru';
    }

    const storedLanguage = window.localStorage.getItem('habtrack-language');

    if (storedLanguage === 'ru' || storedLanguage === 'en') {
      return storedLanguage;
    }

    return 'ru';
  });

  useEffect(() => {
    window.localStorage.setItem('habtrack-language', language);
  }, [language]);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Язык</CardTitle>
        <CardDescription>Настройте язык интерфейса.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex flex-col items-start justify-between gap-2 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Язык интерфейса</p>
            <p className="text-muted-foreground text-xs">
              Предпочитаемый язык. Можно подключить полноценную локализацию позже.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              intent={language === 'ru' ? 'primary' : 'outline'}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setLanguage('ru')}
            >
              Русский
            </Button>
            <Button
              type="button"
              intent={language === 'en' ? 'primary' : 'outline'}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
