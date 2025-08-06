"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import LoginPage from "@/components/auth/login-page"
import SignupPage from "@/components/auth/signup-page"
import AdminLoginPage from "@/components/auth/admin-login-page"
import MemberDashboard from "@/components/dashboard/member-dashboard" // ✅ import

type AuthPage = "login" | "signup" | "admin-login"

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPage>("login")

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // ✅ If logged in → go to dashboard
  if (user) {
    return <MemberDashboard />
  }

  // Not logged in → show auth pages
  switch (currentAuthPage) {
    case "signup":
      return <SignupPage onSwitchToLogin={() => setCurrentAuthPage("login")} />
    case "admin-login":
      return <AdminLoginPage onBackToLogin={() => setCurrentAuthPage("login")} />
    case "login":
    default:
      return (
        <LoginPage
          onSwitchToSignup={() => setCurrentAuthPage("signup")}
          onSwitchToAdminLogin={() => setCurrentAuthPage("admin-login")}
        />
      )
  }
}
