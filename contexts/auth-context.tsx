"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  role: string
  department: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  isAdmin: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const email = localStorage.getItem("email")
    const name = localStorage.getItem("name")
    const role = localStorage.getItem("role")
    const department = localStorage.getItem("department")

    if (email && name) {
      setUser({ email, name, role: role || "user", department: department || "" })
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Protect routes
    if (!isLoading) {
      const publicPaths = ["/login", "/"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!isLoggedIn && !isPublicPath) {
        router.push("/login")
      } else if (isLoggedIn && isPublicPath) {
        router.push("/dashboard")
      }
    }
  }, [isLoggedIn, isLoading, pathname, router])

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setIsLoggedIn(false)
    router.push("/login")
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
