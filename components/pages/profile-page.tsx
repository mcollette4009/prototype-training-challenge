"use client"

import { useState } from "react"
import { Settings, Trophy, Calendar, Target, LogOut, Edit3, Camera, Mail, Phone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, logout, challenges, dailyLogs } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  if (!user) return null

  const joinedChallenges = challenges.filter((c) => user.joinedChallenges.includes(c.id))
  const userLogs = dailyLogs.filter((log) => log.userId === user.id)
  const completedLogs = userLogs.filter((log) => log.completed)

  const getCompletionStats = () => {
    const completed = completedLogs.length
    const total = userLogs.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Calculate current streak
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]

      const log = userLogs.find((l) => l.date === dateStr && l.completed)
      if (log) {
        streak++
      } else {
        break
      }
    }

    return { completed, total, percentage, streak }
  }

  const stats = getCompletionStats()

  const handleSaveProfile = () => {
    // Mock save - in real app would update user data
    setIsEditing(false)
  }

  const achievements = [
    {
      id: 1,
      title: "First Step",
      description: "Completed your first challenge",
      icon: "🎯",
      earned: stats.completed > 0,
    },
    { id: 2, title: "Week Warrior", description: "7-day completion streak", icon: "🔥", earned: stats.streak >= 7 },
    { id: 3, title: "Consistency King", description: "15 days completed", icon: "👑", earned: stats.completed >= 15 },
    {
      id: 4,
      title: "Challenge Champion",
      description: "Complete the 30-day challenge",
      icon: "🏆",
      earned: stats.completed >= 30,
    },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-brand-orange rounded-3xl flex items-center justify-center text-2xl font-bold text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-brand-orange rounded-full hover:scale-110 transition-transform">
              <Camera size={12} className="text-white" />
            </button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Full name"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Email address"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                  <span className="text-sm text-brand-green">Active Member</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 hover:bg-white/10 rounded-2xl transition-colors"
          >
            <Edit3 className="text-gray-400" size={20} />
          </button>
        </div>

        {isEditing && (
          <div className="flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-gradient-to-r from-brand-green to-brand-orange text-white font-semibold py-3 px-6 rounded-2xl hover:scale-[1.02] transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-white/10 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Trophy className="text-brand-orange" size={20} />
          <span>Your Progress</span>
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-green">{stats.completed}</div>
            <div className="text-sm text-gray-400">Days Completed</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-orange">{stats.streak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.percentage}%</div>
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{joinedChallenges.length}</div>
            <div className="text-sm text-gray-400">Challenges Joined</div>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-brand-green to-brand-orange h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="text-brand-green" size={20} />
          <span>Active Challenges</span>
        </h3>

        {joinedChallenges.length === 0 ? (
          <div className="text-center py-8">
            <Target size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h4 className="text-lg font-semibold text-gray-400 mb-2">No active challenges</h4>
            <p className="text-sm text-gray-500">Join a challenge to start tracking your progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {joinedChallenges.map((challenge) => {
              const challengeLogs = userLogs.filter((log) => log.challengeId === challenge.id)
              const challengeCompleted = challengeLogs.filter((log) => log.completed).length
              const progressPercentage = Math.round((challengeCompleted / challenge.duration) * 100)

              return (
                <div key={challenge.id} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white">{challenge.title}</h4>
                      <p className="text-sm text-gray-400">
                        {challengeCompleted} of {challenge.duration} days completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-green">{progressPercentage}%</div>
                      <div className="text-xs text-gray-400">complete</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-brand-green to-brand-orange h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Trophy className="text-yellow-400" size={20} />
          <span>Achievements</span>
        </h3>

        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                achievement.earned
                  ? "bg-gradient-to-r from-brand-green/20 to-brand-orange/20 border-brand-green/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-bold ${achievement.earned ? "text-white" : "text-gray-400"}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Settings className="text-gray-400" size={20} />
          <span>Account Settings</span>
        </h3>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="text-gray-400" size={20} />
              <span className="text-white">Email Notifications</span>
            </div>
            <div className="w-12 h-6 bg-brand-green rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <Phone className="text-gray-400" size={20} />
              <span className="text-white">Push Notifications</span>
            </div>
            <div className="w-12 h-6 bg-white/20 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <span className="text-white">Calendar Sync</span>
            </div>
            <div className="w-12 h-6 bg-white/20 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/30 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
