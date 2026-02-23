import * as React from 'react';

interface LazyChartWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function DefaultFallback() {
  return <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-lg" />;
}

export function LazyChartWrapper({ children, fallback }: LazyChartWrapperProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback ?? <DefaultFallback />}
    </div>
  );
}
