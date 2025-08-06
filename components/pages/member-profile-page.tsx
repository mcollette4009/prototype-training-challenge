"use client"

import { Settings, Edit, Trophy, Award, Sparkles, LogOut, Camera, Calendar, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "30-Day Hard Challenge",
    description: "Transform your life with daily discipline",
    duration: 30,
    difficulty: "Advanced",
  },
]

export default function MemberProfilePage() {
  const { user, logout } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  if (!user) return null

  const joinedChallenges = mockChallenges.filter((challenge) => user.joinedChallenges.includes(challenge.id))

  // Calculate progress stats
  const getProgressStats = () => {
    let totalDays = 0
    let completedDays = 0
    let currentStreak = 0
    let longestStreak = 0

    Object.entries(user.progress).forEach(([challengeId, progress]) => {
      totalDays += progress.length
      completedDays += progress.filter((p) => p.completed).length

      // Calculate streaks (simplified)
      let streak = 0
      let maxStreak = 0
      progress.forEach((p) => {
        if (p.completed) {
          streak++
          maxStreak = Math.max(maxStreak, streak)
        } else {
          streak = 0
        }
      })
      currentStreak = Math.max(currentStreak, streak)
      longestStreak = Math.max(longestStreak, maxStreak)
    })

    return { totalDays, completedDays, currentStreak, longestStreak }
  }

  const stats = getProgressStats()

  const handleEditProfile = () => {
    setShowEditProfile(true)
  }

  const handleSettings = () => {
    setShowSettings(true)
  }

  const handleAvatarChange = () => {
    alert("Avatar upload functionality - would open image picker")
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={handleAvatarChange} className="relative group">
                <img
                  src="/placeholder.svg?height=80&width=80&text=You"
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-brand-green to-brand-orange p-1 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </button>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-brand-green to-brand-orange rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-brand-green font-medium">{user.email}</p>
              <p className="text-sm text-brand-green capitalize">Member Account</p>
              <p className="text-sm text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={handleSettings}
            className="p-3 text-gray-400 hover:text-white touch-target rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            <Settings size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleEditProfile}
            className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-6 py-3 rounded-2xl flex items-center space-x-2 touch-target glow-green hover:scale-105 transition-all duration-300"
          >
            <Edit size={16} />
            <span className="font-semibold">Edit Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white/10 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 touch-target hover:bg-white/20 transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>

        <p className="text-gray-300 leading-relaxed">
          Committed to personal growth and building better habits every day. Currently working on transforming my life
          through daily challenges! 💪
        </p>
      </div>

      {/* Progress Stats Grid */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up">
        <button
          onClick={() => alert("Viewing detailed progress breakdown")}
          className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="text-3xl font-bold gradient-text">{stats.completedDays}</div>
          <div className="text-sm text-gray-400 mt-1">Days Completed</div>
        </button>
        <button
          onClick={() => alert("Viewing streak history")}
          className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-brand-orange">{stats.currentStreak}</div>
          <div className="text-sm text-gray-400 mt-1">Current Streak</div>
        </button>
        <button
          onClick={() => alert("Viewing all challenges")}
          className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-white">{joinedChallenges.length}</div>
          <div className="text-sm text-gray-400 mt-1">Active Challenges</div>
        </button>
        <button
          onClick={() => alert("Viewing completion rate")}
          className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="text-3xl font-bold text-white">
            {stats.totalDays > 0 ? Math.round((stats.completedDays / stats.totalDays) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-400 mt-1">Completion Rate</div>
        </button>
      </div>

      {/* Active Challenges */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Trophy size={24} className="text-brand-green" />
          <span>Active Challenges</span>
        </h3>

        {joinedChallenges.length === 0 ? (
          <div className="text-center py-8">
            <Trophy size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h4 className="text-lg font-semibold text-gray-400 mb-2">No active challenges</h4>
            <p className="text-sm text-gray-500">Join a challenge to start tracking your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {joinedChallenges.map((challenge) => {
              const challengeProgress = user.progress[challenge.id] || []
              const completedDays = challengeProgress.filter((p) => p.completed).length
              const progressPercentage = Math.round((completedDays / challenge.duration) * 100)

              return (
                <button
                  key={challenge.id}
                  onClick={() => alert(`Opening ${challenge.title} details`)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="text-left">
                    <h4 className="font-semibold text-white">{challenge.title}</h4>
                    <p className="text-sm text-gray-400">
                      {completedDays} of {challenge.duration} days completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-brand-green mb-2">{progressPercentage}%</div>
                    <div className="w-20 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-green to-brand-orange rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Challenge Progress Calendar */}
      {joinedChallenges.length > 0 && (
        <div className="glass-card rounded-3xl p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
            <Calendar size={24} className="text-brand-orange" />
            <span>Progress Calendar</span>
          </h3>

          {/* Mini Calendar View */}
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 pb-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Generate last 30 days for demo */}
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split("T")[0]

                // Check if this date has progress
                const hasProgress = Object.values(user.progress).some((progress) =>
                  progress.some((p) => p.date === dateStr),
                )
                const isCompleted = Object.values(user.progress).some((progress) =>
                  progress.some((p) => p.date === dateStr && p.completed),
                )

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-brand-green text-white"
                        : hasProgress
                          ? "bg-brand-orange text-white"
                          : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {date.getDate()}
                    {isCompleted && <CheckCircle size={8} className="absolute text-white" />}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-green rounded-full"></div>
                <span className="text-gray-400">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
                <span className="text-gray-400">Logged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                <span className="text-gray-400">No Activity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Award size={24} className="text-brand-orange" />
          <span>Achievements</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border bg-gradient-to-br from-brand-green/30 to-brand-orange/30 border-brand-green/50 glow-green">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-bold text-sm mb-1 text-white">First Steps</h4>
            <p className="text-xs text-gray-300">Joined your first challenge</p>
          </div>

          <div className="p-4 rounded-2xl border glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-3xl mb-3 grayscale">🔥</div>
            <h4 className="font-bold text-sm mb-1 text-gray-400">Streak Master</h4>
            <p className="text-xs text-gray-500">Maintain a 30-day streak</p>
          </div>

          <div className="p-4 rounded-2xl border glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-3xl mb-3 grayscale">❤️</div>
            <h4 className="font-bold text-sm mb-1 text-gray-400">Community Builder</h4>
            <p className="text-xs text-gray-500">Get 100 likes on posts</p>
          </div>

          <div className="p-4 rounded-2xl border glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-3xl mb-3 grayscale">📝</div>
            <h4 className="font-bold text-sm mb-1 text-gray-400">Journal Keeper</h4>
            <p className="text-xs text-gray-500">Write 50 journal entries</p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors duration-300 text-white">
                Notifications
              </button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors duration-300 text-white">
                Privacy
              </button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors duration-300 text-white">
                Account
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-colors duration-300 text-red-400"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full bg-white/5 text-white rounded-2xl p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                <textarea
                  defaultValue="Committed to personal growth and building better habits every day."
                  className="w-full bg-white/5 text-white rounded-2xl p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none h-24"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEditProfile(false)
                    alert("Profile updated successfully!")
                  }}
                  className="flex-1 bg-gradient-to-r from-brand-green to-brand-orange text-white py-3 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
