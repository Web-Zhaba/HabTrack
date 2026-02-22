"use client"

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid"
import { motion, useReducedMotion } from "motion/react"
import { useId, useState } from "react"
import type { ButtonProps, InputProps, NumberFieldProps } from "react-aria-components"
import { Button, Input as AriaInput, NumberField as NumberFieldPrimitive } from "react-aria-components"
import { Input as StyledInput, InputGroup } from "@/components/ui/input"
import { cx } from "@/lib/primitive"
import { fieldStyles } from "./field-styles"

const LABEL_TRANSITION = {
  duration: 0.28,
  ease: "easeInOut" as const,
}

export interface AnimatedNumberFieldProps extends NumberFieldProps {
  label?: string
  placeholder?: string
}

export function AnimatedNumberField({
  label,
  placeholder,
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: AnimatedNumberFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const val = isControlled ? value : internalValue
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = (val !== undefined && val !== null && !Number.isNaN(val)) || isFocused

  const shouldReduceMotion = useReducedMotion()
  const reactId = useId()
  const inputId = `animated-number-input-${reactId}`

  const getLabelAnimation = () => {
    if (shouldReduceMotion) return {}
    if (isFloating) {
      return {
        y: -24,
        scale: 0.85,
        color: "var(--primary)",
        borderColor: "var(--primary)",
      }
    }
    return { y: 0, scale: 1, color: "var(--muted-foreground)" }
  }

  const getLabelStyle = () => {
    if (!shouldReduceMotion) return {}
    if (isFloating) {
      return {
        transform: "translateY(-24px) scale(0.85)",
        color: "var(--primary)",
        borderColor: "var(--primary)",
      }
    }
    return {
      transform: "translateY(0) scale(1)",
      color: "var(--muted-foreground)",
    }
  }

  const handleChange = (v: number) => {
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
  }

  return (
    <NumberFieldPrimitive
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cx("relative flex items-center w-full", className)}
      {...props}
    >
      <div className="relative w-full">
        <AriaInput
          id={inputId}
          className={cx(
            "peer w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 tabular-nums",
            "pr-24" // Space for buttons
          )}
          placeholder={isFloating ? placeholder : ""}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <motion.label
          animate={getLabelAnimation()}
          className="pointer-events-none absolute top-1/2 left-3 origin-left -translate-y-1/2 rounded-lg border border-transparent bg-background px-1 text-foreground transition-all"
          htmlFor={inputId}
          style={{
            zIndex: 2,
            ...getLabelStyle(),
          }}
          transition={shouldReduceMotion ? { duration: 0 } : LABEL_TRANSITION}
        >
          {label}
        </motion.label>

        <div className="absolute right-0 top-0 h-full flex items-center divide-x overflow-hidden rounded-e-lg border-s z-10 bg-muted/20">
          <StepperButton slot="decrement" />
          <StepperButton slot="increment" />
        </div>
      </div>
    </NumberFieldPrimitive>
  )
}

const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <NumberFieldPrimitive {...props} data-slot="control" className={cx(fieldStyles(), className)} />
  )
}

function NumberInput({ className, ...props }: InputProps) {
  return (
    <InputGroup className="[--input-gutter-end:--spacing(20)]">
      <StyledInput className={cx("tabular-nums", className)} {...props} />
      <div
        data-slot="text"
        className="in-disabled:pointer-events-none pointer-events-auto end-0 p-px in-disabled:opacity-50"
      >
        <div className="flex h-full items-center divide-x overflow-hidden rounded-e-[calc(var(--radius-lg)-1px)] border-s">
          <StepperButton slot="decrement" />
          <StepperButton slot="increment" />
        </div>
      </div>
    </InputGroup>
  )
}

interface StepperButtonProps extends ButtonProps {
  slot: "increment" | "decrement"
  className?: string
}

const StepperButton = ({
  slot,
  className,
  ...props
}: StepperButtonProps) => {
  return (
    <Button
      className={cx(
        "inline-grid place-content-center pressed:text-fg text-muted-fg enabled:hover:text-fg",
        "size-full min-w-11 grow bg-input/20 pressed:bg-input/60 sm:min-w-8.5",
        "*:data-[slot=stepper-icon]:size-5 sm:*:data-[slot=stepper-icon]:size-4",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      slot={slot}
      {...props}
    >
      {slot === "increment" ? (
        <PlusIcon data-slot="stepper-icon" />
      ) : (
        <MinusIcon data-slot="stepper-icon" />
      )}
    </Button>
  )
}

export type { NumberFieldProps }
export { NumberInput, NumberField }
