"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Edit3, BookOpen, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DailyLogModal from "@/components/challenge/daily-log-modal"

interface JournalEntry {
  id: string
  date: string
  challengeLog: string
  personalReflection?: string
  completed: boolean
  image?: string
  timestamp: string
}

interface JournalPageProps {
  onOpenDailyLog: (date: string) => void
}

export default function JournalPage({ onOpenDailyLog }: JournalPageProps) {
  const { user, updateJournalReflection } = useAuth()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [reflectionText, setReflectionText] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showCalendarOnly, setShowCalendarOnly] = useState(false)
  const [showDailyLogModal, setShowDailyLogModal] = useState(false)
  const [selectedLogDate, setSelectedLogDate] = useState<string | null>(null)

  if (!user) return null

  // Convert user progress to journal entries
  const getJournalEntries = (): JournalEntry[] => {
    const entries: JournalEntry[] = []

    Object.entries(user.progress).forEach(([challengeId, progressArray]) => {
      progressArray.forEach((progress) => {
        // Find if there's already a reflection for this entry
        const existingReflection = user.journalReflections?.[`${challengeId}-${progress.date}`]

        entries.push({
          id: `${challengeId}-${progress.date}`,
          date: progress.date,
          challengeLog: progress.entry || "Challenge completed",
          personalReflection: existingReflection,
          completed: progress.completed,
          image: progress.image,
          timestamp: new Date(progress.date).toISOString(),
        })
      })
    })

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const journalEntries = getJournalEntries()

  const handleSaveReflection = (entryId: string) => {
    if (reflectionText.trim()) {
      updateJournalReflection(entryId, reflectionText.trim())
      setSelectedEntry(null)
      setReflectionText("")
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStats = () => {
    const totalEntries = journalEntries.length
    const completedDays = journalEntries.filter((entry) => entry.completed).length
    const reflectionCount = journalEntries.filter((entry) => entry.personalReflection).length

    return { totalEntries, completedDays, reflectionCount }
  }

  const stats = getStats()

  // Calendar functionality
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDateStatus = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]

    const entry = journalEntries.find((e) => e.date === dateStr)
    if (!entry) return "empty"
    return entry.completed ? "completed" : "attempted"
  }

  const handleDateClick = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]
    setSelectedLogDate(dateStr)
    setShowDailyLogModal(true)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDateStatus(day)
      const isToday =
        new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 hover:scale-110 ${
            status === "completed"
              ? "bg-brand-green text-white shadow-lg"
              : status === "attempted"
                ? "bg-brand-orange text-white shadow-lg"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          } ${isToday ? "ring-2 ring-white/50" : ""}`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BookOpen size={28} className="text-brand-green" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">Journal</h1>
              <p className="text-gray-300 text-sm">Reflect on your transformation journey</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-green">{stats.totalEntries}</div>
            <div className="text-xs text-gray-400">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-orange">{stats.completedDays}</div>
            <div className="text-xs text-gray-400">Completed Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">{stats.reflectionCount}</div>
            <div className="text-xs text-gray-400">Reflections</div>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      {journalEntries.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No journal entries yet</h3>
          <p className="text-sm text-gray-500">Start logging your daily challenges to build your journal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="glass-card rounded-3xl p-6 animate-slide-up">
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${entry.completed ? "bg-brand-green/20" : "bg-brand-orange/20"}`}>
                    <Target size={20} className={entry.completed ? "text-brand-green" : "text-brand-orange"} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{formatDate(entry.date)}</h3>
                    <p className={`text-sm ${entry.completed ? "text-brand-green" : "text-brand-orange"}`}>
                      {entry.completed ? "Challenge Completed" : "Challenge Attempted"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge Log */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Challenge Log:</h4>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-gray-200 text-sm leading-relaxed">{entry.challengeLog}</p>
                </div>
              </div>

              {/* Progress Image */}
              {entry.image && (
                <div className="mb-4">
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt="Progress"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
              )}

              {/* Personal Reflection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                  <Edit3 size={16} />
                  <span>Personal Reflection:</span>
                </h4>

                {entry.personalReflection ? (
                  <div className="p-4 bg-brand-green/10 rounded-2xl border border-brand-green/20">
                    <p className="text-gray-200 text-sm leading-relaxed">{entry.personalReflection}</p>
                    <button
                      onClick={() => {
                        setSelectedEntry(entry.id)
                        setReflectionText(entry.personalReflection || "")
                      }}
                      className="mt-3 text-xs text-brand-green hover:text-brand-orange transition-colors"
                    >
                      Edit reflection
                    </button>
                  </div>
                ) : selectedEntry === entry.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Add your personal reflection on this experience..."
                      className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSaveReflection(entry.id)}
                        className="px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-medium hover:bg-brand-green/80 transition-all duration-300"
                      >
                        Save Reflection
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEntry(null)
                          setReflectionText("")
                        }}
                        className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedEntry(entry.id)}
                    className="w-full p-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-brand-green/50 hover:text-brand-green transition-all duration-300"
                  >
                    + Add personal reflection
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Calendar */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-brand-orange" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white">Progress Calendar</h2>
              <p className="text-sm text-gray-400">Click any date to log or update</p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="text-center min-w-[140px]">
              <h3 className="font-semibold text-white">{formatMonthYear()}</h3>
            </div>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid - Make it scrollable */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 sticky top-0 bg-gray-900/95 backdrop-blur-sm py-2 rounded-xl">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 pb-4">{renderCalendar()}</div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-brand-green rounded"></div>
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-brand-orange rounded"></div>
            <span className="text-xs text-gray-400">Attempted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span className="text-xs text-gray-400">Not logged</span>
          </div>
        </div>
      </div>
      {/* Daily Log Modal */}
      {showDailyLogModal && selectedLogDate && (
        <DailyLogModal
          date={selectedLogDate}
          existingLog={journalEntries.find((entry) => entry.date === selectedLogDate)}
          onSave={(date, entry, completed, image) => {
            // Handle save - this would normally update the backend
            setShowDailyLogModal(false)
            setSelectedLogDate(null)
            // Call the parent's onOpenDailyLog to update the main state
            onOpenDailyLog(date)
          }}
          onClose={() => {
            setShowDailyLogModal(false)
            setSelectedLogDate(null)
          }}
        />
      )}
    </div>
  )
}
