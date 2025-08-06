"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import LoginPage from "@/components/auth/login-page"
import SignupPage from "@/components/auth/signup-page"
import AdminLoginPage from "@/components/auth/admin-login-page"
import MemberDashboard from "@/components/dashboard/member-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"

type AuthPage = "login" | "signup" | "admin-login"

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPage>("login")

  // Load the current user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If logged in, show dashboard
  if (user) {
    const role = user.user_metadata?.role || "member" // Default to member
    if (role === "member") {
      return <MemberDashboard />
    } else if (role === "admin") {
      return <AdminDashboard />
    }
  }

  // Show authentication screens
  switch (currentAuthPage) {
    case "signup":
      return <SignupPage onSwitchToLogin={() => setCurrentAuthPage("login")} />
    case "admin-login":
      return <AdminLoginPage onBackToLogin={() => setCurrentAuthPage("login")} />
    case "login":
    default:
      return (
        <div className="relative">
          <LoginPage
            onSwitchToSignup={() => setCurrentAuthPage("signup")}
            onSwitchToAdminLogin={() => setCurrentAuthPage("admin-login")}
          />
        </div>
      )
  }
}
