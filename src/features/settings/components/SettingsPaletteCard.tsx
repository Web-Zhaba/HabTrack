import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';
import { PaletteSwatchButton } from '@/components/ui/palette-swatch-button';

const paletteOptions: {
  id: 'default' | 'forest' | 'sunset' | 'ocean' | 'astro';
  label: string;
  description: string;
}[] = [
  {
    id: 'default',
    label: 'По умолчанию',
    description: 'Сбалансированная палитра для комфортного повседневного использования.',
  },
  {
    id: 'forest',
    label: 'Лес',
    description: 'Более глубокие зелёные оттенки для спокойной концентрации.',
  },
  {
    id: 'sunset',
    label: 'Закат',
    description: 'Тёплая оранжево-розовая палитра с мягкими контрастами.',
  },
  {
    id: 'ocean',
    label: 'Океан',
    description: 'Свежая морская палитра с более округлыми формами.',
    },
  {
    id: 'astro',
    label: 'Астро',
    description: 'Красочная палитра с выраженными оранжевыми и синими тонами'
  },
];

export default function SettingsPaletteCard() {
  const { palette, setPalette } = useTheme();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Цветовая палитра</CardTitle>
        <CardDescription>
          Выберите цветовое оформление интерфейса. Можно комбинировать с любым режимом темы.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {paletteOptions.map((option) => (
            <PaletteSwatchButton
              key={option.id}
              color={`var(--palette-${option.id}-light-primary)`}
              isSelected={palette === option.id}
              onClick={() => setPalette(option.id)}
              title={option.label}
            />
          ))}
        </div>
        <div className="rounded-lg border bg-muted/50 px-3 py-2">
          <div className="text-sm font-medium">
            {paletteOptions.find((o) => o.id === palette)?.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {paletteOptions.find((o) => o.id === palette)?.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
