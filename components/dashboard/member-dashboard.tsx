"use client"

import { useState } from "react"
import { Home, Calendar, Trophy, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import HomePage from "@/components/pages/home-page"
import CalendarPage from "@/components/pages/calendar-page"
import LeaderboardPage from "@/components/pages/leaderboard-page"
import ProfilePage from "@/components/pages/profile-page"

type TabType = "home" | "calendar" | "leaderboard" | "profile"

export default function MemberDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("home")

  if (!user || user.role !== "member") return null

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />
      case "calendar":
        return <CalendarPage />
      case "leaderboard":
        return <LeaderboardPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 max-w-mobile mx-auto relative">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-header border-b border-white/10">
        <div className="flex items-center justify-center p-4">
          <img src="/prototype-logo.png" alt="Prototype Training Systems" className="h-8 w-auto" />
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-mobile z-50">
        <div className="glass-nav border-t border-white/10 px-4 py-2">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "home"
                  ? "bg-brand-orange/20 text-brand-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home size={20} />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "calendar"
                  ? "bg-brand-orange/20 text-brand-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Calendar size={20} />
              <span className="text-xs font-medium">Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "leaderboard"
                  ? "bg-brand-orange/20 text-brand-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Trophy size={20} />
              <span className="text-xs font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-brand-orange/20 text-brand-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <User size={20} />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
