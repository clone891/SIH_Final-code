import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShinyTextProps {
  text: string
  className?: string
  animationDuration?: number
  shimmerWidth?: number
}

export function ShinyText({
  text,
  className = "",
  animationDuration = 2,
  shimmerWidth = 100
}: ShinyTextProps) {
  return (
    <div className={cn("relative inline-block overflow-hidden cursor-pointer", className)}>
      <span
        className="relative z-10 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-bold"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {text}
      </span>

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 -top-0 -bottom-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.9) 50%,
            transparent 75%
          )`,
          width: `${shimmerWidth}%`,
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </div>
  )
}
