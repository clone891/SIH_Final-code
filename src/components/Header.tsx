import { Moon, Sun, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { motion } from "framer-motion"
import { ShinyText } from "./ShinyText"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  isSidebarVisible: boolean
  toggleSidebar: () => void
}

export function Header({ isSidebarVisible, toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Helper function to get display name
  const getDisplayName = () => {
    if (user?.username) return user.username
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0] // Use part before @ as fallback
    return "User"
  }

  // Helper function to get avatar initials
  const getAvatarInitials = () => {
    const displayName = getDisplayName()
    if (user?.username) {
      // For username, take first 2 characters
      return user.username.slice(0, 2).toUpperCase()
    }
    if (user?.name) {
      // For full name, take first letter of each word
      return user.name.split(" ").map((word: string) => word[0]).join("").slice(0, 2).toUpperCase()
    }
    if (user?.email) {
      // For email, take first 2 characters before @
      return user.email.split('@')[0].slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-border px-6 flex items-center justify-between shadow-[var(--shadow-soft)] z-10"
      style={{
        background: 'linear-gradient(135deg, rgba(60, 45, 90, 0.95), rgba(80, 65, 110, 0.9))',
        backdropFilter: 'blur(10px)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl hover:scale-105 transition-all duration-200 shadow-md"
        >
          {isSidebarVisible ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div
          className="relative px-4 py-2 rounded-2xl border-2 border-white/20 hover:border-white/40 hover:scale-110 transition-all duration-300 ease-out cursor-pointer hover:shadow-lg overflow-hidden flex items-center gap-2"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
          onClick={() => window.location.href = '/'}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F32a7517d76b941f98c61312e3af1852a%2F6a39e12b078049088a0866e5389412e1?format=webp&width=800"
            alt="App logo"
            className="relative z-10 h-7 w-7 object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="relative z-10 text-xl font-bold text-white">
            Sahai
          </span>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                110deg,
                transparent 25%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 75%
              )`,
              width: "100%",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.5,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl hover:scale-105 transition-all duration-200 shadow-md"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {!isAuthenticated ? (
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => (window.location.href = "/login")}
            >
              Log in
            </Button>
            <Button
              className="rounded-xl"
              onClick={() => (window.location.href = "/signup")}
            >
              Sign up
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 shadow hover:bg-white/90 transition-all duration-200 cursor-pointer"
                 onClick={() => window.location.href = "/profile"}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getAvatarInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-sm font-medium text-gray-800 hidden md:inline-block max-w-[180px] truncate">
                  @{getDisplayName()}
                </span>
                {user?.name && user?.username && (
                  <span className="text-xs text-gray-500 hidden lg:inline-block max-w-[180px] truncate">
                    {user.name}
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" className="rounded-xl hover:bg-white/20" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </motion.div>
    </motion.header>
  )
}