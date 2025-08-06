"use client"

import { useState } from "react"
import { Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface DailyLog {
  id: string
  date: string
  entry: string
  completed: boolean
  image?: string
  timestamp: string
}

interface DailyLogCalendarProps {
  startDate: string
  duration: number
  dailyLogs: DailyLog[]
  onDateSelect: (date: string) => void
}

export default function DailyLogCalendar({ startDate, duration, dailyLogs, onDateSelect }: DailyLogCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date().toISOString().split("T")[0]

  // Get first day of current month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    calendarDays.push(date.toISOString().split("T")[0])
  }

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

  const getDateStatus = (date: string) => {
    const log = dailyLogs.find((l) => l.date === date)
    const isToday = date === today
    const isPast = new Date(date) < new Date(today)
    const isFuture = new Date(date) > new Date(today)

    if (log?.completed) {
      return "completed"
    } else if (log && !log.completed) {
      return "logged"
    } else if (isPast) {
      return "missed"
    } else if (isToday) {
      return "today"
    } else if (isFuture) {
      return "future"
    }
    return "available"
  }

  const getDateStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-br from-brand-green/40 to-brand-green/20 border-brand-green/60 text-white glow-green scale-105"
      case "logged":
        return "bg-gradient-to-br from-brand-orange/30 to-brand-orange/20 border-brand-orange/50 text-white"
      case "today":
        return "bg-gradient-to-br from-brand-orange/30 to-brand-orange/20 border-brand-orange/60 text-white animate-pulse-glow ring-2 ring-brand-orange/30"
      case "missed":
        return "bg-gray-600/20 border-gray-600/30 text-gray-500"
      case "future":
        return "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
      default:
        return "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20"
    }
  }

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const isDateInChallengePeriod = (date: string) => {
    const challengeStart = new Date(startDate)
    const challengeEnd = new Date(challengeStart)
    challengeEnd.setDate(challengeStart.getDate() + duration - 1)
    const checkDate = new Date(date)

    return checkDate >= challengeStart && checkDate <= challengeEnd
  }

  const completedDays = dailyLogs.filter((log) => log.completed).length
  const totalLoggedDays = dailyLogs.length

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up sticky top-24 z-40">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="text-brand-green" size={24} />
          <div>
            <h2 className="text-xl font-bold gradient-text">Daily Progress</h2>
            <p className="text-sm text-gray-400">30-Day Hard Challenge</p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 touch-target"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center min-w-[140px]">
            <h3 className="font-semibold text-white">{formatMonthYear()}</h3>
          </div>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300 touch-target"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 pb-2">
            {day}
          </div>
        ))}

        {/* Calendar Dates */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square min-h-[48px]"></div>
          }

          const dayNumber = new Date(date).getDate()
          const status = getDateStatus(date)
          const log = dailyLogs.find((l) => l.date === date)
          const isInChallenge = isDateInChallengePeriod(date)

          return (
            <button
              key={date}
              onClick={() => onDateSelect(date)}
              className={`
                relative aspect-square min-h-[48px] rounded-2xl border-2 transition-all duration-300 
                hover:scale-105 touch-target flex flex-col items-center justify-center
                ${getDateStyles(status)}
                ${!isInChallenge ? "opacity-50" : ""}
              `}
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <span className="text-sm font-bold">{dayNumber}</span>

              {/* Challenge Period Indicator */}
              {isInChallenge && <div className="absolute bottom-1 w-1 h-1 bg-current rounded-full opacity-60"></div>}

              {/* Completion Indicator */}
              {status === "completed" && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}

              {/* Log Entry Indicator */}
              {status === "logged" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange rounded-full animate-pulse"></div>
              )}

              {/* Today Indicator */}
              {status === "today" && (
                <div className="absolute inset-0 rounded-2xl border-2 border-brand-orange animate-ping opacity-30"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Progress Summary */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-brand-green rounded-full"></div>
              <span className="text-gray-300">{completedDays} completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-brand-orange rounded-full"></div>
              <span className="text-gray-300">{totalLoggedDays - completedDays} logged</span>
            </div>
          </div>
          <div className="text-brand-green font-semibold">{Math.round((completedDays / duration) * 100)}% complete</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green to-brand-orange rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedDays / duration) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Month Stats */}
      <div className="mt-4 p-3 bg-white/5 rounded-2xl">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>This Month</span>
          <span>
            {
              dailyLogs.filter((log) => {
                const logDate = new Date(log.date)
                return (
                  logDate.getMonth() === currentDate.getMonth() && logDate.getFullYear() === currentDate.getFullYear()
                )
              }).length
            }{" "}
            days logged
          </span>
        </div>
      </div>
    </div>
  )
}
