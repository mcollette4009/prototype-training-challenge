"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Home, Calendar, Trophy, User } from "lucide-react"
import HomePage from "@/components/pages/home-page"
import CalendarPage from "@/components/pages/calendar-page"
import LeaderboardPage from "@/components/pages/leaderboard-page"
import ProfilePage from "@/components/pages/profile-page"

type TabType = "home" | "calendar" | "leaderboard" | "profile"

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>("home")

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        console.error("Error loading user", error)
        return
      }
      setUser(data.user)
    }

    fetchUser()
  }, [])

  if (!user) return null

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
            <Tab icon={<Home size={20} />} label="Home" tab="home" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab icon={<Calendar size={20} />} label="Calendar" tab="calendar" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab icon={<Trophy size={20} />} label="Leaderboard" tab="leaderboard" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab icon={<User size={20} />} label="Profile" tab="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Tab({ icon, label, tab, activeTab, setActiveTab }: any) {
  const isActive = tab === activeTab
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
        isActive
          ? "bg-brand-orange/20 text-brand-orange"
          : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
