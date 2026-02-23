import { useEffect, useRef } from 'react';

export interface AnimatedProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
}

const MIN_PROGRESS_VALUE = 0;
const MAX_PROGRESS_VALUE = 100;

const ANIMATION_DURATION = 250; // ms

export default function AnimatedProgressBar({
  value,
  label,
  color,
  className = '',
  barClassName = '',
  labelClassName = '',
}: AnimatedProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  let backgroundColor = 'var(--primary)';

  if (color) {
    if (color.startsWith('--')) {
      backgroundColor = `var(${color})`;
    } else {
      backgroundColor = color;
    }
  }

  useEffect(() => {
    const targetValue = Math.max(MIN_PROGRESS_VALUE, Math.min(MAX_PROGRESS_VALUE, value));

    if (progressRef.current) {
      const element = progressRef.current;
      const startTime = performance.now();
      const startValue = parseFloat(element.style.width) || 0;
      const change = targetValue - startValue;

      // Если разница очень маленькая, обновляем сразу
      if (Math.abs(change) < 0.1) {
        element.style.width = `${targetValue}%`;
        return;
      }

      // Отменяем предыдущую анимацию
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Простая анимация через requestAnimationFrame (без layout измерений)
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        const newValue = startValue + change * eased;
        element.style.width = `${newValue}%`;

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      {label && <div className={`mb-1 font-medium text-sm ${labelClassName}`}>{label}</div>}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          ref={progressRef}
          className={`h-full rounded-full ${barClassName}`}
          style={{
            backgroundColor,
            width: '0%',
            willChange: 'width',
          }}
        />
      </div>
    </div>
  );
}
