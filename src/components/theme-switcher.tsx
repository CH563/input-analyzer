
"use client"

import * as React from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themeOptions = [
    { name: "light", icon: <Sun className="h-[1.1rem] w-[1.1rem]" />, label: "Light" },
    { name: "dark", icon: <Moon className="h-[1.1rem] w-[1.1rem]" />, label: "Dark" },
    { name: "system", icon: <Laptop className="h-[1.1rem] w-[1.1rem]" />, label: "System" },
  ]

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch, and to reserve space for the new layout
    return (
      <div className="flex items-center space-x-0.5 rounded-md border bg-muted p-0.5 h-9" aria-label="Loading theme options">
        <div className="h-8 w-8 rounded-sm bg-background/30 animate-pulse" />
        <div className="h-8 w-8 rounded-sm bg-background/30 animate-pulse" />
        <div className="h-8 w-8 rounded-sm bg-background/30 animate-pulse" />
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div 
        className="flex items-center space-x-0.5 rounded-md border bg-muted p-0.5 shadow-sm" 
        role="radiogroup" 
        aria-label="Theme switcher"
      >
        {themeOptions.map((option) => (
          <Tooltip key={option.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:shadow-none",
                  theme === option.name
                    ? "bg-background text-foreground shadow-sm" // Active state
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground" // Inactive state
                )}
                onClick={() => setTheme(option.name)}
                aria-label={`Switch to ${option.label} theme`}
                role="radio"
                aria-checked={theme === option.name}
              >
                {option.icon}
                <span className="sr-only">{option.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
