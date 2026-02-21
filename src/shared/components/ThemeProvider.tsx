import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type Palette = "default" | "forest" | "sunset"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  palette: Palette
  setPalette: (palette: Palette) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  palette: "default",
  setPalette: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [palette, setPalette] = useState<Palette>(() => {
    const stored = localStorage.getItem("vite-ui-palette") as Palette | null
    if (stored === "default" || stored === "forest" || stored === "sunset") {
      return stored
    }
    return "default"
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    let resolvedTheme: Theme = theme

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      resolvedTheme = systemTheme
    }

    root.classList.add(resolvedTheme)
    root.dataset.theme = palette
  }, [theme, palette])

  const value: ThemeProviderState = {
    theme,
    setTheme: (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setTheme(nextTheme)
    },
    palette,
    setPalette: (nextPalette: Palette) => {
      localStorage.setItem("vite-ui-palette", nextPalette)
      setPalette(nextPalette)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
