import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";

const RANDOM_ID_START_INDEX = 2;
const RANDOM_ID_LENGTH = 9;

const LABEL_TRANSITION = {
  duration: 0.28,
  ease: "easeInOut" as const,
};

export interface AnimatedInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  type?: string;
  autoComplete?: string;
  name?: string;
  multiline?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  action?: React.ReactNode;
}

export default function AnimatedInput({
  value,
  defaultValue = "",
  onChange,
  label,
  placeholder = "",
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  icon,
  type = "text",
  autoComplete,
  name,
  multiline = false,
  onKeyDown,
  action,
}: AnimatedInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = !!val || isFocused;
  const shouldReduceMotion = useReducedMotion();
  const reactId = useId();
  const inputId = `animated-input-${reactId.toString().substring(RANDOM_ID_START_INDEX, RANDOM_ID_LENGTH)}`;

  const getLabelAnimation = () => {
    if (shouldReduceMotion) {
      return {};
    }
    if (isFloating) {
      return {
        y: -24,
        scale: 0.85,
        color: "var(--primary)",
        borderColor: "var(--primary)",
      };
    }
    return { y: 0, scale: 1, color: "var(--muted-foreground)" };
  };

  const getLabelStyle = () => {
    if (!shouldReduceMotion) {
      return {};
    }
    if (isFloating) {
      return {
        transform: "translateY(-24px) scale(0.85)",
        color: "var(--primary)",
        borderColor: "var(--primary)",
      };
    }
    return {
      transform: "translateY(0) scale(1)",
      color: "var(--muted-foreground)",
    };
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-3 -translate-y-1/2"
        >
          {icon}
        </span>
      )}
      {multiline ? (
        <textarea
          aria-label={label}
          className={`peer w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[100px] resize-y ${inputClassName}`}
          disabled={disabled}
          id={inputId}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            if (!isControlled) {
              setInternalValue(e.target.value);
            }
            onChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={isFloating ? placeholder : ""}
          name={name}
          value={val}
          onKeyDown={onKeyDown}
        />
      ) : (
        <input
          aria-label={label}
          className={`peer w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${icon ? "pl-10" : ""} ${action ? "pr-10" : ""} ${inputClassName}`}
          disabled={disabled}
          id={inputId}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            if (!isControlled) {
              setInternalValue(e.target.value);
            }
            onChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={isFloating ? placeholder : ""}
          ref={inputRef}
          type={type}
          autoComplete={autoComplete}
          name={name}
          value={val}
          onKeyDown={onKeyDown}
        />
      )}
      <motion.label
        animate={getLabelAnimation()}
        className={`pointer-events-none absolute top-1/2 left-3 origin-left -translate-y-1/2 rounded-lg border border-transparent bg-background px-1 text-foreground transition-all ${labelClassName}`}
        htmlFor={inputId}
        style={{
          zIndex: 2,
          ...getLabelStyle(),
        }}
        transition={shouldReduceMotion ? { duration: 0 } : LABEL_TRANSITION}
      >
        {label}
      </motion.label>
      {action && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 z-10">
          {action}
        </div>
      )}
    </div>
  );
}
