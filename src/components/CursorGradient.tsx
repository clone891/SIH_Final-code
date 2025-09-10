import React, { useEffect, useState } from 'react'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { useTheme } from './ThemeProvider'

interface CursorGradientProps {
  children: React.ReactNode
  className?: string
}

export function CursorGradient({ children, className = '' }: CursorGradientProps) {
  const { x, y } = useCursorPosition()
  const { theme } = useTheme()
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  // Calculate gradient position as percentage
  const gradientX = windowSize.width > 0 ? (x / windowSize.width) * 100 : 50
  const gradientY = windowSize.height > 0 ? (y / windowSize.height) * 100 : 50

  // Light mode gradient colors - more visible and pronounced
  const lightGradient = `
    radial-gradient(
      circle at ${gradientX}% ${gradientY}%,
      rgba(130, 115, 170, 1) 0%,
      rgba(150, 135, 190, 0.9) 15%,
      rgba(170, 155, 210, 0.8) 30%,
      rgba(190, 175, 230, 0.7) 45%,
      rgba(210, 195, 240, 0.6) 60%,
      rgba(230, 215, 250, 0.4) 75%,
      rgba(245, 235, 255, 0.2) 100%
    ),
    linear-gradient(135deg, rgb(220,205,240), rgb(200,185,230), rgb(210,195,245))
  `

  // Dark mode gradient colors
  const darkGradient = `
    radial-gradient(
      circle at ${gradientX}% ${gradientY}%,
      rgba(70, 55, 100, 0.9) 0%,
      rgba(90, 75, 130, 0.8) 20%,
      rgba(100, 85, 130, 0.6) 40%,
      rgba(110, 95, 140, 0.4) 60%,
      rgba(120, 105, 150, 0.2) 80%,
      rgba(130, 115, 160, 0.1) 100%
    ),
    linear-gradient(135deg, rgba(100,85,130,0.8), rgba(78,70,126,0.6), rgba(89,84,155,0.4))
  `

  // Create dynamic gradient based on cursor position and theme
  const dynamicStyle = {
    background: theme === 'dark' ? darkGradient : lightGradient,
    '--cursor-x': `${gradientX}%`,
    '--cursor-y': `${gradientY}%`,
    transition: 'background 0.1s ease-out',
  } as React.CSSProperties

  return (
    <div
      className={`cursor-gradient-container ${className}`}
      style={dynamicStyle}
    >
      {children}
    </div>
  )
}
