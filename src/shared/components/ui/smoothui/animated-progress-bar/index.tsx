import { motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion";

export interface AnimatedProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  /**
   * To replay the animation, change the React 'key' prop on this component from the parent.
   */
}

const MIN_PROGRESS_VALUE = 0;
const MAX_PROGRESS_VALUE = 100;

const SPRING: Transition = {
  type: "spring",
  damping: 10,
  mass: 0.75,
  stiffness: 100,
  duration: 0.25,
};

export default function AnimatedProgressBar({
  value,
  label,
  color,
  className = "",
  barClassName = "",
  labelClassName = "",
}: AnimatedProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();

  let backgroundColor = "var(--primary)";

  if (color) {
    if (color.startsWith("--")) {
      backgroundColor = `var(${color})`;
    } else {
      backgroundColor = color;
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className={`mb-1 font-medium text-sm ${labelClassName}`}>
          {label}
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          animate={{
            width: `${Math.max(MIN_PROGRESS_VALUE, Math.min(MAX_PROGRESS_VALUE, value))}%`,
          }}
          className={`h-full rounded-full ${barClassName}`}
          initial={{ width: MIN_PROGRESS_VALUE }}
          style={{ backgroundColor }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
        />
      </div>
    </div>
  );
}
