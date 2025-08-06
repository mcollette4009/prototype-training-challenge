"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DailyLogModal from "@/components/challenge/daily-log-modal"

export default function CalendarPage() {
  const { user, challenges, dailyLogs, saveDailyLog } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showDailyLogModal, setShowDailyLogModal] = useState(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)

  if (!user) return null

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateString)

    // Default to first joined challenge
    const firstChallenge = challenges.find((c) => user.joinedChallenges.includes(c.id))
    if (firstChallenge) {
      setSelectedChallengeId(firstChallenge.id)
      setShowDailyLogModal(true)
    }
  }

  const getDateStatus = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dateObj = new Date(currentYear, currentMonth, day)

    // Check if user has any logs for this date
    const hasLog = dailyLogs.some((log) => log.userId === user.id && log.date === dateString)
    const hasCompletedLog = dailyLogs.some((log) => log.userId === user.id && log.date === dateString && log.completed)

    const isToday = dateObj.toDateString() === today.toDateString()
    const isPast = dateObj < today
    const isFuture = dateObj > today

    if (hasCompletedLog) {
      return "completed"
    } else if (hasLog) {
      return "attempted"
    } else if (isToday) {
      return "today"
    } else if (isPast) {
      return "missed"
    } else {
      return "future"
    }
  }

  const getDateStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-br from-brand-green/30 to-brand-green/20 border-brand-green/40 text-brand-green"
      case "attempted":
        return "bg-gradient-to-br from-brand-orange/30 to-brand-orange/20 border-brand-orange/40 text-brand-orange"
      case "today":
        return "bg-gradient-to-br from-brand-orange/30 to-brand-orange/20 border-brand-orange/40 text-brand-orange ring-2 ring-brand-orange/50"
      case "missed":
        return "bg-white/5 border-white/10 text-gray-500"
      case "future":
        return "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
      default:
        return "bg-white/5 border-white/10 text-gray-400"
    }
  }

  const handleSaveDailyLog = (text: string, completed: boolean, photoUrl?: string) => {
    if (selectedDate && selectedChallengeId) {
      saveDailyLog(selectedChallengeId, selectedDate, text, completed, photoUrl)
    }
    setShowDailyLogModal(false)
    setSelectedDate(null)
    setSelectedChallengeId(null)
  }

  const getExistingLog = () => {
    if (!selectedDate || !selectedChallengeId) return undefined
    return dailyLogs.find(
      (log) => log.userId === user.id && log.challengeId === selectedChallengeId && log.date === selectedDate,
    )
  }

  // Generate calendar days
  const calendarDays = []

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getCompletionStats = () => {
    const monthLogs = dailyLogs.filter((log) => {
      const logDate = new Date(log.date)
      return log.userId === user.id && logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear
    })

    const completed = monthLogs.filter((log) => log.completed).length
    const total = daysInMonth
    const percentage = Math.round((completed / total) * 100)

    return { completed, total, percentage }
  }

  const stats = getCompletionStats()

  return (
    <div className="p-4 space-y-6">
      {/* Stats Card */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Target className="text-brand-orange" size={20} />
            <h3 className="text-lg font-bold text-white">This Month</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-green">{stats.percentage}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-brand-green to-brand-orange h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>{stats.completed} days completed</span>
          <span>{stats.total - stats.completed} days remaining</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateMonth("prev")} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
            <ChevronLeft className="text-gray-400" size={20} />
          </button>

          <h2 className="text-xl font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>

          <button onClick={() => navigateMonth("next")} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square"></div>
            }

            const status = getDateStatus(day)
            const styles = getDateStyles(status)

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-2xl border-2 font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center relative ${styles}`}
              >
                <span>{day}</span>
                {status === "completed" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-green rounded-full border-2 border-gray-900"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-brand-green"></div>
              <span className="text-gray-400">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-brand-orange"></div>
              <span className="text-gray-400">Attempted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-600"></div>
              <span className="text-gray-400">Missed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-white/20"></div>
              <span className="text-gray-400">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

        <button
          onClick={() => {
            const todayString = today.toISOString().split("T")[0]
            setSelectedDate(todayString)
            const firstChallenge = challenges.find((c) => user.joinedChallenges.includes(c.id))
            if (firstChallenge) {
              setSelectedChallengeId(firstChallenge.id)
              setShowDailyLogModal(true)
            }
          }}
          className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white font-semibold py-4 px-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Log Today's Challenge</span>
        </button>
      </div>

      {/* Daily Log Modal */}
      {showDailyLogModal && selectedDate && selectedChallengeId && (
        <DailyLogModal
          isOpen={showDailyLogModal}
          onClose={() => {
            setShowDailyLogModal(false)
            setSelectedDate(null)
            setSelectedChallengeId(null)
          }}
          onSave={handleSaveDailyLog}
          selectedDate={selectedDate}
          challengeTitle={challenges.find((c) => c.id === selectedChallengeId)?.title || "Challenge"}
          existingLog={getExistingLog()}
        />
      )}
    </div>
  )
}
