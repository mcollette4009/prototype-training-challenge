"use client"

import { useState } from "react"
import { ArrowLeft, CalendarIcon, Users, Clock } from "lucide-react"
import DailyLogCalendar from "../challenge/daily-log-calendar"
import DailyLogModal from "../challenge/daily-log-modal"
import DailyLogFeed from "../challenge/daily-log-feed"

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  participants: number
  startDate: string
  endDate: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  coverImage?: string
  dailyPrompts: string[]
  joined: boolean
}

interface DailyLog {
  id: string
  date: string
  entry: string
  completed: boolean
  image?: string
  timestamp: string
}

interface ChallengeDetailPageProps {
  challenge: Challenge
  onBack: () => void
  onJoinChallenge: (challengeId: string) => void
}

export default function ChallengeDetailPage({ challenge, onBack, onJoinChallenge }: ChallengeDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([
    {
      id: "1",
      date: "2024-01-15",
      entry: "Completed my 5AM workout and cold shower. Feeling energized and ready to tackle the day!",
      completed: true,
      image: "/placeholder.svg?height=200&width=300&text=Workout+Complete",
      timestamp: "2024-01-15T06:00:00Z",
    },
    {
      id: "2",
      date: "2024-01-14",
      entry: "Read 15 pages of 'Atomic Habits' and did my evening workout. The discipline is building!",
      completed: true,
      timestamp: "2024-01-14T20:30:00Z",
    },
  ])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleSaveLog = (date: string, entry: string, completed: boolean, image?: string) => {
    const existingLogIndex = dailyLogs.findIndex((log) => log.date === date)
    const newLog: DailyLog = {
      id: existingLogIndex >= 0 ? dailyLogs[existingLogIndex].id : Date.now().toString(),
      date,
      entry,
      completed,
      image,
      timestamp: new Date().toISOString(),
    }

    if (existingLogIndex >= 0) {
      setDailyLogs((prev) => prev.map((log, index) => (index === existingLogIndex ? newLog : log)))
    } else {
      setDailyLogs((prev) => [...prev, newLog])
    }

    setSelectedDate(null)
  }

  const getLogForDate = (date: string) => {
    return dailyLogs.find((log) => log.date === date)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-400/20"
      case "Intermediate":
        return "text-yellow-400 bg-yellow-400/20"
      case "Advanced":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
              >
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-300 text-sm">{challenge.description}</p>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center space-x-2">
            <CalendarIcon size={16} className="text-brand-green" />
            <span>{challenge.duration} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-brand-orange" />
            <span>{challenge.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-yellow-400" />
            <span>
              {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {challenge.coverImage && (
          <div className="relative overflow-hidden rounded-2xl mb-6">
            <img
              src={challenge.coverImage || "/placeholder.svg"}
              alt={challenge.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        )}

        {/* Join Button */}
        {!challenge.joined && (
          <button
            onClick={() => onJoinChallenge(challenge.id)}
            className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white py-4 rounded-2xl font-semibold text-lg glow-green hover:scale-105 transition-all duration-300"
          >
            Join Challenge
          </button>
        )}
      </div>

      {/* Daily Logging Calendar - Only show if joined */}
      {challenge.joined && (
        <>
          <DailyLogCalendar
            startDate={challenge.startDate}
            duration={challenge.duration}
            dailyLogs={dailyLogs}
            onDateSelect={handleDateSelect}
          />

          {/* Daily Log Feed */}
          <DailyLogFeed dailyLogs={dailyLogs} challengeTitle={challenge.title} />
        </>
      )}

      {/* Daily Log Modal */}
      {selectedDate && (
        <DailyLogModal
          date={selectedDate}
          existingLog={getLogForDate(selectedDate)}
          onSave={handleSaveLog}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
