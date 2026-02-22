"use client"

import { CheckIcon } from "@heroicons/react/16/solid"
import type {
  ListBoxItemProps,
  ListBoxSectionProps,
  SeparatorProps,
  TextProps,
} from "react-aria-components"
import {
  Collection,
  composeRenderProps,
  Header,
  ListBoxItem as ListBoxItemPrimitive,
  ListBoxSection,
  Separator,
  Text,
} from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { Keyboard } from "./keyboard"

const dropdownSectionStyles = tv({
  slots: {
    section: "col-span-full grid grid-cols-[auto_1fr]",
    header: "col-span-full px-2 py-1.5 text-xs font-medium text-muted-foreground",
  },
})

const { section, header } = dropdownSectionStyles()

interface DropdownSectionProps<T> extends ListBoxSectionProps<T> {
  title?: string
}

const DropdownSection = <T extends object>({
  className,
  children,
  ...props
}: DropdownSectionProps<T>) => {
  return (
    <ListBoxSection className={section({ className })}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{children}</Collection>
    </ListBoxSection>
  )
}

const dropdownItemStyles = tv({
  base: [
    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  ],
  variants: {
    intent: {
      danger: [
        "text-destructive focus:bg-destructive/10 focus:text-destructive",
      ],
      warning: [
        "text-warning-subtle-fg focus:bg-warning-subtle focus:text-warning-subtle-fg",
      ],
    },
    isDisabled: {
      true: "opacity-50",
    },
    isSelected: {
      true: "bg-accent text-accent-foreground",
    },
    isFocused: {
      true: "bg-accent text-accent-foreground",
    },
    isHovered: {
      true: "bg-accent text-accent-foreground",
    },
  },
})

interface DropdownItemProps extends ListBoxItemProps {
  intent?: "danger" | "warning"
}

const DropdownItem = ({ className, children, intent, ...props }: DropdownItemProps) => {
  const textValue = typeof children === "string" ? children : undefined
  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, intent, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected && (
            <CheckIcon
              className={twJoin(
                "-ms-0.5 me-1.5 h-lh w-4 shrink-0",
                "group-has-data-[slot=icon]:absolute group-has-data-[slot=icon]:end-0.5 group-has-data-[slot=icon]:top-1/2 group-has-data-[slot=icon]:-translate-y-1/2",
                "group-has-data-[slot=avatar]:absolute group-has-data-[slot=avatar]:end-0.5 group-has-data-[slot=avatar]:top-1/2 group-has-data-[slot=avatar]:-translate-y-1/2",
              )}
              data-slot="check-indicator"
            />
          )}
          {typeof children === "string" ? <DropdownLabel>{children}</DropdownLabel> : children}
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

const DropdownLabel = ({ className, ...props }: TextProps) => (
  <Text
    slot="label"
    className={twMerge("flex-1", className)}
    {...props}
  />
)

const DropdownDescription = ({ className, ...props }: TextProps) => (
  <Text
    slot="description"
    className={twMerge("text-xs text-muted-foreground", className)}
    {...props}
  />
)

const DropdownSeparator = ({ className, ...props }: Omit<SeparatorProps, "orientation">) => (
  <Separator
    orientation="horizontal"
    className={twMerge("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
)

const DropdownKeyboard = ({ className, ...props }: React.ComponentProps<typeof Keyboard>) => {
  return (
    <Keyboard
      className={twMerge(
        "ml-auto text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

export type { DropdownSectionProps, DropdownItemProps }
export {
  DropdownSeparator,
  DropdownItem,
  DropdownLabel,
  DropdownDescription,
  DropdownKeyboard,
  DropdownSection,
}
