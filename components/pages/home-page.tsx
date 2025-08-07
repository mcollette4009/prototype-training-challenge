"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Target, Heart, MessageCircle, Share2, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import DailyLogModal from "@/components/challenge/daily-log-modal"
import BackButton from "@/components/ui/back-button"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [challenges, setChallenges] = useState<any[]>([])
  const [dailyLogs, setDailyLogs] = useState<any[]>([])
  const [showDailyLogModal, setShowDailyLogModal] = useState(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const [likedLogs, setLikedLogs] = useState<Set<string>>(new Set())

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      const { data: challenges } = await supabase.from("challenges").select("*")
      setChallenges(challenges || [])

      const { data: logs } = await supabase.from("challenge_logs").select("*")
      setDailyLogs(logs || [])
    }

    fetchData()
  }, [])

  const getTodayLog = (challengeId: string) => {
    return dailyLogs.find(
      (log) => log.user_id === user?.id && log.challenge_id === challengeId && log.date === today
    )
  }

  const handleOpenDailyLog = (challengeId: string) => {
    setSelectedChallengeId(challengeId)
    setShowDailyLogModal(true)
  }

  const handleSaveDailyLog = async (text: string, completed: boolean, photoUrl?: string) => {
    if (!selectedChallengeId || !user) return

    const existingLog = dailyLogs.find(
      (l) => l.user_id === user.id && l.challenge_id === selectedChallengeId && l.date === today
    )

    if (existingLog) {
      await supabase
        .from("challenge_logs")
        .update({ text, completed, photo_url: photoUrl })
        .eq("id", existingLog.id)
    } else {
      await supabase.from("challenge_logs").insert({
        user_id: user.id,
        challenge_id: selectedChallengeId,
        date: today,
        text,
        completed,
        photo_url: photoUrl,
        timestamp: new Date().toISOString(),
      })
    }

    alert("✅ Log saved!")

    // Refresh logs
    const { data: updatedLogs } = await supabase.from("challenge_logs").select("*")
    setDailyLogs(updatedLogs || [])

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
    <div className="p-4 space-y-6 text-white">
      {/* ✅ Back Button */}
      <BackButton label="Back to Dashboard" />

      {/* ✅ Welcome */}
      <div className="glass-card rounded-3xl p-6">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-sm text-gray-300">Here’s your progress for today.</p>
      </div>

      {/* ✅ Challenges */}
      {challenges.map((challenge) => {
        const userLogs = dailyLogs.filter(
          (log) => log.user_id === user?.id && log.challenge_id === challenge.id
        )
        const todayLog = getTodayLog(challenge.id)
        const completedDays = userLogs.filter((log) => log.completed).length
        const progressPercentage = Math.round((completedDays / challenge.duration) * 100)

        return (
          <div key={challenge.id} className="glass-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-bold">{challenge.title}</h2>
                <p className="text-sm text-gray-400">
                  {completedDays} / {challenge.duration} days complete
                </p>
              </div>
              {todayLog?.completed && (
                <div className="flex items-center space-x-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium">Completed</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <button
              onClick={() => handleOpenDailyLog(challenge.id)}
              className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white font-semibold py-3 px-6 rounded-xl hover:scale-105 transition-all"
            >
              {todayLog ? "Update Log" : "Log Today's Challenge"}
            </button>
          </div>
        )
      })}

      {/* ✅ Social Feed */}
      {dailyLogs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Community Feed</h2>
          {dailyLogs.map((item, i) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-4 text-white border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold">User: {item.user_id.slice(0, 6)}</p>
                  <p className="text-sm text-gray-400">{formatTimeAgo(item.timestamp)}</p>
                </div>
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-xl ${
                    likedLogs.has(item.id)
                      ? "bg-red-500/20 text-red-400"
                      : "text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Heart size={16} className={likedLogs.has(item.id) ? "fill-current" : ""} />
                  <span className="text-sm">{likedLogs.has(item.id) ? "1" : "0"}</span>
                </button>
              </div>
              <p className="text-sm text-gray-200">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Log Modal */}
      {showDailyLogModal && selectedChallengeId && (
        <DailyLogModal
          isOpen={showDailyLogModal}
          onClose={() => {
            setShowDailyLogModal(false)
            setSelectedChallengeId(null)
          }}
          onSave={handleSaveDailyLog}
          selectedDate={today}
          challengeTitle={
            challenges.find((c) => c.id === selectedChallengeId)?.title || "Challenge"
          }
          existingLog={getTodayLog(selectedChallengeId)}
        />
      )}
    </div>
  )
}
