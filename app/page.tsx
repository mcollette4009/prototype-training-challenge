"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import LoginPage from "@/components/auth/login-page"
import SignupPage from "@/components/auth/signup-page"
import AdminLoginPage from "@/components/auth/admin-login-page"
import MemberDashboard from "@/components/dashboard/member-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"

type AuthPage = "login" | "signup" | "admin-login"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPage>("login")

  // Show loading state
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

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.role === "member") {
      return <MemberDashboard />
    } else if (user.role === "admin") {
      return <AdminDashboard />
    }
  }

  // Show authentication pages
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
