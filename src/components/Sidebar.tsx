import { useState } from "react"
import { motion } from "framer-motion"
import { NavLink, useLocation } from "react-router-dom"
import {
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Heart,
  Users,
  HelpCircle,
  FileText,
  User,
  Gamepad2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { id: "chat", path: "/chat", icon: MessageCircle, label: "Sahai bot" },
  { id: "emergency", path: "/emergency", icon: AlertTriangle, label: "Emergency Contact Requirements" },
  { id: "progress", path: "/progress", icon: TrendingUp, label: "Your Progress" },
  { id: "booking", path: "/booking", icon: Calendar, label: "Counselling Booking System" },
  { id: "wellness", path: "/wellness", icon: Heart, label: "Wellness Hub" },
  { id: "support", path: "/support", icon: Users, label: "Peer Support Form" },
  { id: "help", path: "/help", icon: HelpCircle, label: "Health and Support" },
  { id: "summary", path: "/summary", icon: FileText, label: "Chat Summary" },
  { id: "gamified-dashboard", path: "/gamified-dashboard", icon: Gamepad2, label: "Gamified Dashboard" },
  { id: "profile", path: "/profile", icon: User, label: "Profile" },
]

export function Sidebar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    })
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop } = e.currentTarget
    setIsScrolled(scrollTop > 10)
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 border-r border-border flex flex-col gradient-card shadow-[var(--shadow-medium)]"
    >
      {/* Scrollable Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-6 py-6 space-y-2 mb-[115px]"
        onScroll={handleScroll}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          margin: '8px',
          marginBottom: '123px'
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold text-foreground mb-6"
        >
          Navigation
        </motion.h2>

        {navigationItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            custom={index}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "nav-button",
                isActive && "nav-button-active"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  )
}
