import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { CursorGradient } from "./CursorGradient"
import { useTheme } from "./ThemeProvider"
import { useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const hideNavRoutes = ["/", "/login", "/signup"]
  const [isSidebarVisible, setIsSidebarVisible] = useState(!hideNavRoutes.includes(location.pathname))
  const { theme } = useTheme()

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <CursorGradient className={`h-screen w-full flex flex-col ${theme === 'dark' ? 'cursor-gradient-dark' : ''}`}>
      {!hideNavRoutes.includes(location.pathname) && (
        <Header isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      )}

      <div className="flex flex-1 relative overflow-hidden justify-start items-start">
        {/* Toggleable Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarVisible && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            marginLeft: isSidebarVisible ? 0 : 0
          }}
          transition={{ delay: 0.2 }}
          className="flex-1 h-full overflow-hidden"
        >
          {children}
        </motion.main>
      </div>
    </CursorGradient>
  )
}
