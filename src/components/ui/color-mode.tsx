"use client"

import { ThemeProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"

export type ColorModeProviderProps = ThemeProviderProps
export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      disableTransitionOnChange 
      enableSystem={false}
      defaultTheme="light"
      {...props} 
    />
  )
}