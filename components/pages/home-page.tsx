"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Target, CheckCircle, Clock, Share2, Heart, MessageCircle } from "lucide-react"
import DailyLogModal from "@/components/challenge/daily-log-modal"
import { useAuth } from "@/contexts/auth-context"

interface Profile {
  id: string
  name: string
  avatar?: string
}

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  cover_image?: string
  daily_prompts: string[]
  participants: number
}

interface ChallengeLog {
  id: string
  user_id: string
  challenge_id: string
  date: string
  text: string
  completed: boolean
  timestamp: string
  photo_url?: string
}

export default function HomePage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [logs, setLogs] = useState<ChallengeLog[]>([])
  const [joinedIds, setJoinedIds] = useState<string[]>([])
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const [showDailyLogModal, setShowDailyLogModal] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [{ data: profilesData }, { data: challengesData }, { data: logsData }, { data: joinData }] =
        await Promise.all([
          supabase.from("profiles").select("id, name, avatar"),
          supabase.from("challenges").select("*"),
          supabase.from("challenge_logs").select("*"),
          supabase.from("challenge_participants").select("*"),
        ])

      setProfiles(profilesData || [])
      setChallenges(challengesData || [])
      setLogs(logsData || [])
      setJoinedIds(joinData?.filter((j) => j.user_id === user.id).map((j) => j.challenge_id) || [])
    }

    fetchData()
  }, [user])

  const joinedChallenges = challenges.filter((c) => joinedIds.includes(c.id))
  const availableChallenges = challenges.filter((c) => !joinedIds.includes(c.id))

  const handleJoin = async (challengeId: string) => {
    await supabase.from("challenge_participants").insert({
      user_id: user.id,
      challenge_id: challengeId,
    })
    setJoinedIds((prev) => [...prev, challengeId])
  }

  const handleSaveDailyLog = async (text: string, completed: boolean, photoUrl?: string) => {
    if (!selectedChallengeId) return

    const existingLog = logs.find(
      (l) => l.user_id === user.id && l.challenge_id === selectedChallengeId && l.date === today
    )

    if (existingLog) {
      await supabase.from("challenge_logs").update({
        text,
        completed,
        photo_url: photoUrl,
      }).eq("id", existingLog.id)
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

    setShowDailyLogModal(false)
    setSelectedChallengeId(null)

    // Refresh logs
    const { data: updatedLogs } = await supabase.from("challenge_logs").select("*")
    setLogs(updatedLogs || [])
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 1000 / 60 / 60)
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "Yesterday"
    return `${diffDays}d ago`
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-white">Welcome, {user?.user_metadata?.name?.split(" ")[0] || "Warrior"}</h1>

      {/* Joined Challenges */}
      {joinedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Active Challenges</h2>
          {joinedChallenges.map((challenge) => {
            const todayLog = logs.find(
              (l) => l.user_id === user.id && l.challenge_id === challenge.id && l.date === today
            )
            const completedDays = logs.filter((l) => l.user_id === user.id && l.challenge_id === challenge.id && l.completed).length
            const progress = Math.round((completedDays / challenge.duration) * 100)

            return (
              <div key={challenge.id} className="glass-card p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{challenge.title}</h3>
                  {todayLog?.completed && (
                    <span className="text-sm text-brand-green flex items-center space-x-1">
                      <CheckCircle size={16} /> <span>Completed</span>
                    </span>
                  )}
                </div>
                <div className="bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-green h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm text-white">{challenge.daily_prompts?.[0] || "What did you do today?"}</p>
                <button
                  onClick={() => {
                    setSelectedChallengeId(challenge.id)
                    setShowDailyLogModal(true)
                  }}
                  className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  {todayLog ? "Update Log" : "Log Today's Challenge"}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Available Challenges */}
      {availableChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Available Challenges</h2>
          {availableChallenges.map((challenge) => (
            <div key={challenge.id} className="glass-card p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-white">{challenge.title}</h3>
              <p className="text-sm text-gray-300">{challenge.description}</p>
              <button
                onClick={() => handleJoin(challenge.id)}
                className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Social Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={16} /> Community Feed
        </h2>
        {logs
          .filter((l) => l.text)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10)
          .map((log) => {
            const profile = profiles.find((p) => p.id === log.user_id)
            const challenge = challenges.find((c) => c.id === log.challenge_id)
            return (
              <div key={log.id} className="glass-card p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={profile?.avatar || "/placeholder.svg"} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white text-sm font-semibold">{profile?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-400">
                        {challenge?.title || "Challenge"} • {formatTimeAgo(log.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Share2 size={16} className="text-gray-400" />
                </div>
                <p className="text-sm text-white">{log.text}</p>
              </div>
            )
          })}
      </div>

      {/* Modal */}
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
          existingLog={logs.find((l) => l.user_id === user.id && l.challenge_id === selectedChallengeId && l.date === today)}
        />
      )}
    </div>
  )
}
