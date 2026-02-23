import { useEffect } from 'react';

/**
 * Хук для установки заголовка страницы (document.title)
 * @param title - Заголовок страницы
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
