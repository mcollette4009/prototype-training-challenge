"use client"

import { useState } from "react"
import { Plus, Target, Heart, MessageCircle, Share2, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DailyLogModal from "@/components/challenge/daily-log-modal"

export default function HomePage() {
  const { user, challenges, dailyLogs, joinChallenge, saveDailyLog, likeDailyLog, users } = useAuth()
  const [showDailyLogModal, setShowDailyLogModal] = useState(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const [likedLogs, setLikedLogs] = useState<Set<string>>(new Set())

  if (!user) return null

  const today = new Date().toISOString().split("T")[0]
  const joinedChallenges = challenges.filter((c) => user.joinedChallenges.includes(c.id))
  const availableChallenges = challenges.filter((c) => !user.joinedChallenges.includes(c.id))

  // Get today's log for the main challenge
  const getTodayLog = (challengeId: string) => {
    return dailyLogs.find((log) => log.userId === user.id && log.challengeId === challengeId && log.date === today)
  }

  // Get social feed (all users' logs, newest first)
  const socialFeed = dailyLogs
    .map((log) => {
      const logUser = users.find((u) => u.id === log.userId)
      const challenge = challenges.find((c) => c.id === log.challengeId)
      return {
        ...log,
        userName: logUser?.name || "Unknown User",
        userAvatar: logUser?.avatar || "/placeholder.svg?height=40&width=40&text=?",
        challengeTitle: challenge?.title || "Unknown Challenge",
      }
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10) // Show latest 10 posts

  const handleOpenDailyLog = (challengeId: string) => {
    setSelectedChallengeId(challengeId)
    setShowDailyLogModal(true)
  }

  const handleSaveDailyLog = (text: string, completed: boolean, photoUrl?: string) => {
    if (selectedChallengeId) {
      saveDailyLog(selectedChallengeId, today, text, completed, photoUrl)
    }
    setShowDailyLogModal(false)
    setSelectedChallengeId(null)
  }

  const handleLike = (logId: string) => {
    const newLikedLogs = new Set(likedLogs)
    if (likedLogs.has(logId)) {
      newLikedLogs.delete(logId)
    } else {
      newLikedLogs.add(logId)
    }
    setLikedLogs(newLikedLogs)
    likeDailyLog(logId)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Good morning, {user.name.split(" ")[0]}!</h1>
            <p className="text-gray-300 text-sm">Ready to push your limits today?</p>
          </div>
          <div className="text-4xl">💪</div>
        </div>
      </div>

      {/* Active Challenges */}
      {joinedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Your Active Challenges</h2>
          {joinedChallenges.map((challenge) => {
            const todayLog = getTodayLog(challenge.id)
            const userLogs = dailyLogs.filter((log) => log.userId === user.id && log.challengeId === challenge.id)
            const completedDays = userLogs.filter((log) => log.completed).length
            const progressPercentage = Math.round((completedDays / challenge.duration) * 100)

            return (
              <div key={challenge.id} className="glass-card rounded-3xl p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-brand-green/20 rounded-2xl">
                      <Target className="text-brand-green" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                      <p className="text-sm text-gray-400">
                        Day {userLogs.length + 1} of {challenge.duration}
                      </p>
                    </div>
                  </div>

                  {todayLog?.completed && (
                    <div className="flex items-center space-x-2 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full">
                      <CheckCircle size={16} />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-brand-green to-brand-orange h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{completedDays} days completed</span>
                    <span>{progressPercentage}%</span>
                  </div>
                </div>

                <p className="text-gray-100 mb-4 leading-relaxed">
                  {challenge.dailyPrompts[0] || "What hard thing did you do today?"}
                </p>

                <button
                  onClick={() => handleOpenDailyLog(challenge.id)}
                  className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white font-semibold py-4 px-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>{todayLog ? "Update Today's Log" : "Log Today's Challenge"}</span>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Available Challenges */}
      {availableChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Available Challenges</h2>
          {availableChallenges.map((challenge) => (
            <div key={challenge.id} className="glass-card rounded-3xl p-6 animate-slide-up">
              <div className="flex items-center space-x-4 mb-4">
                {challenge.coverImage && (
                  <img
                    src={challenge.coverImage || "/placeholder.svg"}
                    alt={challenge.title}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                  <p className="text-sm text-gray-400">{challenge.participants.toLocaleString()} participants</p>
                  <span className="inline-block px-2 py-1 bg-brand-green/20 text-brand-green rounded-full text-xs mt-1">
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>

              <button
                onClick={() => joinChallenge(challenge.id)}
                className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white font-semibold py-3 px-6 rounded-2xl hover:scale-[1.02] transition-all duration-300"
              >
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Social Feed */}
      {socialFeed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Community Feed</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock size={16} />
              <span>Latest updates</span>
            </div>
          </div>

          {socialFeed.map((item, index) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.userAvatar || "/placeholder.svg"}
                    alt={item.userName}
                    className="w-12 h-12 rounded-2xl border-2 border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white">{item.userName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{item.challengeTitle}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <Share2 size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-100 leading-relaxed mb-4">{item.text}</p>

              {/* Photo */}
              {item.photoUrl && (
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={item.photoUrl || "/placeholder.svg"}
                    alt="Challenge photo"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    likedLogs.has(item.id)
                      ? "bg-red-500/20 text-red-400"
                      : "hover:bg-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <Heart size={16} className={likedLogs.has(item.id) ? "fill-current" : ""} />
                  <span className="text-sm font-medium">{likedLogs.has(item.id) ? "1" : "0"}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300">
                  <MessageCircle size={16} />
                  <span className="text-sm font-medium">0</span>
                </button>

                {item.completed && (
                  <div className="flex items-center space-x-2 text-xs text-brand-green">
                    <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                    <span>Challenge completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Log Modal */}
      {showDailyLogModal && selectedChallengeId && (
        <DailyLogModal
          isOpen={showDailyLogModal}
          onClose={() => {
            setShowDailyLogModal(false)
            setSelectedChallengeId(null)
          }}
          onSave={handleSaveDailyLog}
          selectedDate={today}
          challengeTitle={challenges.find((c) => c.id === selectedChallengeId)?.title || "Challenge"}
          existingLog={getTodayLog(selectedChallengeId)}
        />
      )}
    </div>
  )
}
