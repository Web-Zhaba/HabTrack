import { cn } from "@/lib/utils"

interface PaletteSwatchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** CSS variable string or any valid CSS color value, e.g. "var(--palette-forest-light-primary)" */
  color: string
  /** Whether this swatch is currently selected */
  isSelected?: boolean
}

export function PaletteSwatchButton({
  color,
  isSelected = false,
  className,
  title,
  children,
  ...props
}: PaletteSwatchButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative rounded-lg outline-hidden size-8 cursor-pointer",
        "transition-transform duration-300",
        "hover:opacity-90 focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/20",
        isSelected && "scale-[1.08] ring-4 ring-ring/30",
        className
      )}
      style={{
        backgroundColor: color,
        ["--tw-ring-color" as string]: isSelected
          ? `color-mix(in oklab, ${color} 40%, transparent)`
          : undefined,
      }}
      title={title}
      aria-pressed={isSelected}
      {...props}
    >
      {isSelected && (
        <span
          className="pointer-events-none absolute bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white/50"
          aria-hidden
        />
      )}
      {title && <span className="sr-only">{title}</span>}
      {children}
    </button>
  )
}
