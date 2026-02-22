import { XMarkIcon } from "@heroicons/react/24/solid"
import type { HeadingProps, TextProps } from "react-aria-components"
import {
  Heading,
  Button as PrimitiveButton,
  Dialog as PrimitiveDialog,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { cx } from "@/lib/primitive"
import { Button, type ButtonProps } from "./button"

const Dialog = ({ role = "dialog", className, ...props }: React.ComponentProps<
  typeof PrimitiveDialog
>) => {
  return (
    <PrimitiveDialog
      data-slot="dialog"
      role={role}
      className={twMerge(
        "peer/dialog group/dialog relative flex max-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-lg bg-background text-foreground shadow-lg sm:max-w-lg",
        className,
      )}
      {...props}
    />
  )
}

const DialogTrigger = ({ className, ...props }: ButtonProps) => (
  <PrimitiveButton className={cx("cursor-pointer", className)} {...props} />
)

interface DialogHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: string
  description?: string
}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return (
    <div
      data-slot="dialog-header"
      className={twMerge(
        "flex flex-col space-y-1.5 border-b px-6 py-4",
        className,
      )}
    >
      {props.title && <DialogTitle>{props.title}</DialogTitle>}
      {props.description && <DialogDescription>{props.description}</DialogDescription>}
      {!props.title && typeof props.children === "string" ? (
        <DialogTitle>{props.children}</DialogTitle>
      ) : (
        props.children
      )}
    </div>
  )
}

interface DialogTitleProps extends HeadingProps {
  ref?: React.Ref<HTMLHeadingElement>
}
const DialogTitle = ({ className, ref, ...props }: DialogTitleProps) => (
  <Heading
    slot="title"
    ref={ref}
    className={twMerge("text-balance font-semibold text-fg text-lg/6 sm:text-base/6", className)}
    {...props}
  />
)

interface DialogDescriptionProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>
}
const DialogDescription = ({ className, ref, ...props }: DialogDescriptionProps) => (
  <p
    data-slot="description"
    className={twMerge(
      "text-pretty text-base/6 text-muted-fg group-disabled:opacity-50 sm:text-sm/6",
      className,
    )}
    ref={ref}
    {...props}
  />
)

type DialogBodyProps = React.ComponentProps<"div">
const DialogBody = ({ className, ...props }: DialogBodyProps) => (
  <div
    data-slot="dialog-body"
    className={twMerge(
      "flex-1 overflow-auto px-6 py-4",
      className,
    )}
    {...props}
  />
)

type DialogFooterProps = React.ComponentProps<"div">
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return (
    <div
      data-slot="dialog-footer"
      className={twMerge(
        "flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

const DialogClose = ({ intent = "plain", ref, ...props }: ButtonProps) => {
  return <Button slot="close" ref={ref} intent={intent} {...props} />
}

interface CloseButtonIndicatorProps extends Omit<ButtonProps, "children"> {
  className?: string
  isDismissable?: boolean | undefined
}

const DialogCloseIcon = ({ className, ...props }: CloseButtonIndicatorProps) => {
  return props.isDismissable ? (
    <PrimitiveButton
      aria-label="Close"
      slot="close"
      className={cx(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className,
      )}
    >
      <XMarkIcon className="size-4" />
    </PrimitiveButton>
  ) : null
}

export type {
  DialogHeaderProps,
  DialogTitleProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogDescriptionProps,
  CloseButtonIndicatorProps,
}
export {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogCloseIcon,
}
