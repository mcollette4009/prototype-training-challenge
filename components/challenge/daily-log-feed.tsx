"use client"

import { CheckCircle, Calendar, Clock, ImageIcon } from "lucide-react"

interface DailyLog {
  id: string
  date: string
  entry: string
  completed: boolean
  image?: string
  timestamp: string
}

interface DailyLogFeedProps {
  dailyLogs: DailyLog[]
  challengeTitle: string
}

export default function DailyLogFeed({ dailyLogs, challengeTitle }: DailyLogFeedProps) {
  const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const dateStr = date.toISOString().split("T")[0]
    const todayStr = today.toISOString().split("T")[0]
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    if (dateStr === todayStr) {
      return "Today"
    } else if (dateStr === yesterdayStr) {
      return "Yesterday"
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" })
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        })
      }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStreakInfo = () => {
    const completedLogs = sortedLogs.filter((log) => log.completed)
    if (completedLogs.length === 0) return null

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]

      const log = dailyLogs.find((l) => l.date === dateStr && l.completed)
      if (log) {
        currentStreak++
      } else {
        break
      }
    }

    return currentStreak
  }

  const currentStreak = getStreakInfo()

  if (sortedLogs.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center animate-slide-up">
        <Calendar size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No progress logs yet</h3>
        <p className="text-sm text-gray-500 mb-4">Start your journey by tapping a date above</p>
        <div className="text-xs text-gray-600">Tip: You can log entries for past, present, or future dates</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="text-brand-orange" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-white">Your Progress Journey</h3>
            <p className="text-sm text-gray-400">{sortedLogs.length} entries logged</p>
          </div>
        </div>

        {/* Streak Counter */}
        {currentStreak && currentStreak > 0 && (
          <div className="bg-gradient-to-r from-brand-green/20 to-brand-orange/20 border border-brand-green/30 rounded-2xl px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <div className="text-right">
                <div className="text-lg font-bold text-brand-green">{currentStreak}</div>
                <div className="text-xs text-gray-400">day streak</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Entries */}
      {sortedLogs.map((log, index) => (
        <div
          key={log.id}
          className="glass-card rounded-3xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300 group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  log.completed
                    ? "bg-gradient-to-br from-brand-green/30 to-brand-green/20 border border-brand-green/40"
                    : "bg-gradient-to-br from-brand-orange/30 to-brand-orange/20 border border-brand-orange/40"
                }`}
              >
                <Calendar size={18} className={log.completed ? "text-brand-green" : "text-brand-orange"} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{formatDate(log.date)}</h4>
                <p className="text-sm text-gray-400">{challengeTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Completion Badge */}
              {log.completed && (
                <div className="flex items-center space-x-2 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full animate-pulse">
                  <CheckCircle size={14} />
                  <span className="text-xs font-medium">Completed</span>
                </div>
              )}

              {/* Image Indicator */}
              {log.image && (
                <div className="p-1 bg-white/10 rounded-full">
                  <ImageIcon size={12} className="text-gray-400" />
                </div>
              )}

              {/* Timestamp */}
              <div className="text-right">
                <div className="text-xs text-gray-400">{formatTime(log.timestamp)}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-gray-100 leading-relaxed text-base">{log.entry}</p>
          </div>

          {/* Image */}
          {log.image && (
            <div className="relative overflow-hidden rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform duration-300">
              <img src={log.image || "/placeholder.svg"} alt="Progress photo" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                Progress Photo
              </div>
            </div>
          )}

          {/* Completion Status */}
          {log.completed && (
            <div className="p-4 bg-gradient-to-r from-brand-green/20 to-brand-green/10 border border-brand-green/30 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <div>
                  <p className="font-medium text-white">Challenge completed! 🎉</p>
                  <p className="text-sm text-gray-300">Another step towards building unstoppable discipline</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Load More Placeholder */}
      {sortedLogs.length >= 10 && (
        <div className="text-center py-6">
          <button className="text-brand-green hover:text-brand-orange transition-colors duration-300 text-sm font-medium">
            Load Earlier Entries
          </button>
        </div>
      )}
    </div>
  )
}
