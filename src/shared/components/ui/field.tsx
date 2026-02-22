"use client"

import type { FieldErrorProps, LabelProps, TextProps } from "react-aria-components"
import {
  FieldError as FieldErrorPrimitive,
  Label as LabelPrimitive,
  Text,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { cx } from "@/lib/primitive"
import { labelStyles, descriptionStyles, fieldErrorStyles } from "./field-styles"

export function Label({ className, ...props }: LabelProps) {
  return <LabelPrimitive data-slot="label" {...props} className={labelStyles({ className })} />
}

export function Description({ className, ...props }: TextProps) {
  return <Text {...props} slot="description" className={descriptionStyles({ className })} />
}

export function Fieldset({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={twMerge("*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6", className)}
      {...props}
    />
  )
}

export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="control" className={twMerge("space-y-6", className)} {...props} />
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return <FieldErrorPrimitive {...props} className={cx(fieldErrorStyles(), className)} />
}

export function Legend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="legend"
      {...props}
      className={twMerge("font-semibold text-base/6 data-disabled:opacity-50", className)}
    />
  )
}
