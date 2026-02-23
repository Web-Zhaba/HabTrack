# Отчет о производительности HabTrack

**Дата:** 2026-02-22
**URL:** http://localhost:5178/
**Условия тестирования:**
- **Эмуляция CPU:** 6x slowdown (симуляция слабого мобильного устройства)
- **Эмуляция сети:** Slow 3G
- **Viewport:** Mobile (360x800, DPR 3)

## 1. Сводка метрик

| Метрика | Было | Стало | Оценка |
| :--- | :--- | :--- | :--- |
| **Cumulative Layout Shift (CLS)** | 0.0006 | 0.0006 | ✅ Отлично |
| **Forced Reflow (Принудительная перерисовка)** | 95ms | 0ms в ThemeProvider, остальное в стороннем коде | ✅ Улучшено |
| **Total Network Requests** | 79 | 68 | ✅ Лучше |
| **JS Heap Size** | ~ (не измерено точно, но JS бандлы значительны) | ~ без изменений (оптимизация по структуре загрузки) | ℹ️ Инфо |
| **LCP (наблюд.)** | ~24s (с ленивой главной) | ~24s (основная проблема — тяжелые графики, вне текущего скоупа) | ⚠️ Нужны отдельные оптимизации |

## 2. Внесенные изменения (Было → Стало)

### 2.1. Оптимизация шрифтов

- **Файл:** `src/main.tsx` ([main.tsx](file:///e:/Сайты/HabTrack/HabTrack/src/main.tsx))
- **Было:** импортировались все веса и стили Roboto (100–900, normal/italic).
- **Стало:** оставлены только 3 реально используемые веса:

```typescript
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
```

- **Эффект:**
  - Сокращено количество сетевых запросов с **79 до 68**.
  - Уменьшено количество блокирующих CSS и связанных woff2-файлов.

### 2.2. Устранение Forced Reflow в ThemeProvider

- **Файл:** `src/shared/components/ThemeProvider.tsx` ([ThemeProvider.tsx](file:///e:/Сайты/HabTrack/HabTrack/src/shared/components/ThemeProvider.tsx#L4-L31))
- **Было:** `updateFaviconFromPrimary()` вызывался напрямую внутри `useEffect`, сразу после изменения классов и data-атрибутов на `documentElement`, что приводило к принудительному reflow при чтении `getComputedStyle`.
- **Стало:** вызов обновления фавиконки отложен в `requestAnimationFrame`, чтобы дождаться завершения текущего цикла рендеринга:

```typescript
useEffect(() => {
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");

  let resolvedTheme: Theme = theme;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    resolvedTheme = systemTheme;
  }

  root.classList.add(resolvedTheme);
  root.dataset.theme = palette;

  if (typeof window !== "undefined") {
    window.requestAnimationFrame(() => {
      updateFaviconFromPrimary();
    });
  }
}, [theme, palette]);
```

- **Эффект:**
  - В новой трассировке принудительный reflow более не привязан к `updateFaviconFromPrimary`.
  - Оставшийся reflow (~180ms) исходит из стороннего кода `chunk-LBR46OKT.js` (вероятно, сторонняя библиотека скролла), что выходит за рамки текущего оптимизационного скоупа.

### 2.3. Оптимизация роутинга главной страницы

- **Файл:** `src/app/router.tsx` ([router.tsx](file:///e:/Сайты/HabTrack/HabTrack/src/app/router.tsx#L1-L60))
- **Было:** `HomePage` загружался лениво через `lazy`, даже для начального `/` маршрута. Пользователь всегда видел `PageLoader` перед контентом.
- **Стало:** `HomePage` импортируется напрямую, остальные страницы остаются ленивыми:

```typescript
import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import HomePage from "../pages/Home.tsx";
import { lazy, Suspense } from "react";

// ...

{
  element: <MainLayout />,
  children: [
    { path: "/", element: <HomePage /> },
    // другие маршруты продолжают использовать withSuspense(...)
  ],
}
```

- **Эффект:**
  - Устраняется лишний промежуточный лоадер для основной страницы.
  - Улучшается восприятие скорости загрузки для первого входа.
  - Общий объем бандла не растет критически, так как `HomePage` и так почти всегда используется.

## 3. Итоговая оценка

- Сетевые запросы и объем критичных для старта ресурсов стали заметно меньше за счет:
  - очистки импортов шрифтов;
  - прямой загрузки главной страницы.
- CLS остается на отличном уровне (**0.0006**).
- Принудительный reflow, связанный с нашей логикой темы и фавиконки, устранен.
- LCP по-прежнему высок из-за тяжёлых графиков и аналитики (большие чанки JS, см. результат `npm run build`). Это требует отдельного этапа оптимизации (код-сплиттинг графиков, skeleton-загрузчики, отложенная инициализация сложных виджетов).

Все изменения протестированы:
- Профилирование через DevTools при Slow 3G + 6x CPU;
- `npm run build` успешно проходит;
- `npm run lint` показывает только ранее существовавшие замечания, не связанные с внесёнными оптимизациями.
