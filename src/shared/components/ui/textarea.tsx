import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
        "text-base/6 text-fg placeholder:text-muted-fg sm:text-sm/6",
        "border border-input enabled:hover:border-muted-fg/30",
        "outline-hidden focus:border-ring/70 focus:ring-3 focus:ring-ring/20 focus:enabled:hover:border-ring/80",
        "aria-invalid:border-danger-subtle-fg/70 focus:aria-invalid:border-danger-subtle-fg/70 focus:aria-invalid:ring-danger-subtle-fg/20 aria-invalid:enabled:hover:border-danger-subtle-fg/80 focus:aria-invalid:enabled:hover:border-danger-subtle-fg/80",
        "disabled:bg-muted forced-colors:in-disabled:text-[GrayText]",
        "in-disabled:bg-muted forced-colors:in-disabled:text-[GrayText]",
        "dark:scheme-dark",
        "min-h-24 resize-y",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
