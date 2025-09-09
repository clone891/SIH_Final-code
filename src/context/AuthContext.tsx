import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/"

export interface User {
  id?: string
  username: string
  firstName?: string
  lastName?: string
  email: string
  name?: string // Computed field for display
  profile_picture?: string
  created_at?: string
  updated_at?: string
}

export type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (input: { username: string; password: string }) => Promise<void>
  signup: (input: {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    confirm: string
  }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  updateProfile: (input: {
    username?: string
    firstName?: string
    lastName?: string
    email?: string
  }) => Promise<void>
  checkUsernameAvailability: (username: string) => Promise<boolean>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  )
  const [user, setUser] = useState<User | null>(() => {
    const v = localStorage.getItem("auth_user")
    try {
      const userData = v ? JSON.parse(v) : null
      if (userData) {
        // Ensure we have a computed name field
        return {
          ...userData,
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username
        }
      }
      return null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const persist = (res: { user: User; token: string }) => {
    setToken(res.token)
    localStorage.setItem("auth_token", res.token)
    if (res.user !== undefined) {
      // Add computed name field
      const userWithName = {
        ...res.user,
        name: res.user.name || `${res.user.firstName || ''} ${res.user.lastName || ''}`.trim() || res.user.username
      }
      setUser(userWithName)
      localStorage.setItem("auth_user", JSON.stringify(userWithName))
    }
  }

  // login
  const login = useCallback(
    async (input: { username: string; password: string }) => {
      setLoading(true)
      try {
        const res = await fetch(API + "auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: input.username,
            password: input.password,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail || "Login failed")
        }
        const data = await res.json() // { access, refresh, user? }
        
        // If user data is returned in login response, use it
        if (data.user) {
          persist({ user: data.user, token: data.access })
        } else {
          // Otherwise, fetch user profile after login
          const userRes = await fetch(API + "me/", {
            headers: { Authorization: "Bearer " + data.access },
          })
          if (userRes.ok) {
            const userData = await userRes.json()
            persist({ user: userData, token: data.access })
          } else {
            // Fallback to basic user info
            persist({ 
              user: { 
                username: input.username, 
                email: '', 
                firstName: '',
                lastName: ''
              }, 
              token: data.access 
            })
          }
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // signup (register → auto-login)
  const signup = useCallback(
    async (input: {
      username: string
      firstName: string
      lastName: string
      email: string
      password: string
      confirm: string
    }) => {
      setLoading(true)
      try {
        const res = await fetch(API + "auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.detail || "Signup failed")
        }

        const signupData = await res.json()

        // Auto-login after signup
        const loginRes = await fetch(API + "auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: input.username,
            password: input.password,
          }),
        })

        if (!loginRes.ok) {
          const loginError = await loginRes.json()
          throw new Error(loginError.detail || "Auto-login after signup failed")
        }

        const loginData = await loginRes.json()
        
        // Use user data from signup response if available, otherwise construct it
        const userData = loginData.user || signupData.user || {
          email: input.email,
          username: input.username,
          firstName: input.firstName,
          lastName: input.lastName,
        }

        persist({
          user: userData,
          token: loginData.access,
        })
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(API + "me/", {
        headers: { Authorization: "Bearer " + token },
      })
      if (!res.ok) {
        // If unauthorized, logout
        if (res.status === 401) {
          logout()
        }
        return
      }
      const userData = await res.json()
      const userWithName = {
        ...userData,
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username
      }
      setUser(userWithName)
      localStorage.setItem("auth_user", JSON.stringify(userWithName))
    } catch (error) {
      console.error("Failed to refresh profile:", error)
    }
  }, [token, logout])

  const updateProfile = useCallback(async (input: {
    username?: string
    firstName?: string
    lastName?: string
    email?: string
  }) => {
    if (!token) throw new Error("Not authenticated")
    
    setLoading(true)
    try {
      const res = await fetch(API + "me/", {
        method: "PATCH",
        headers: { 
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Profile update failed")
      }

      const updatedUser = await res.json()
      const userWithName = {
        ...updatedUser,
        name: updatedUser.name || `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.username
      }
      setUser(userWithName)
      localStorage.setItem("auth_user", JSON.stringify(userWithName))
    } finally {
      setLoading(false)
    }
  }, [token])

  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(API + `auth/check-username/?username=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: token ? { Authorization: "Bearer " + token } : {},
      })
      
      if (!res.ok) return false
      
      const data = await res.json()
      return data.available || false
    } catch (error) {
      console.error("Failed to check username availability:", error)
      return false
    }
  }, [token])

  useEffect(() => {
    if (token && !user) {
      refreshProfile()
    }
  }, [token, user, refreshProfile])

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
      refreshProfile,
      updateProfile,
      checkUsernameAvailability,
    }),
    [user, token, loading, login, signup, logout, refreshProfile, updateProfile, checkUsernameAvailability]
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}