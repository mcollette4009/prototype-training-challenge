"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isParticipant, setIsParticipant] = useState(false)
  const [loading, setLoading] = useState(true)
  const [challengeText, setChallengeText] = useState("")
  const [status, setStatus] = useState("")
  const challengeId = "e40167ff-9a88-400c-9ec1-0f7bb15582d8" // your challenge ID

  // Load user and check participation
  useEffect(() => {
    async function loadUserAndCheck() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUser(user)

      const { data: participants } = await supabase
        .from("challenge_participants")
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId)

      if (participants && participants.length > 0) {
        setIsParticipant(true)
      }

      setLoading(false)
    }

    loadUserAndCheck()
  }, [])

  // Handle joining the challenge
  async function joinChallenge() {
    if (!user) return
    const { error } = await supabase.from("challenge_participants").insert([
      { user_id: user.id, challenge_id: challengeId }
    ])
    if (!error) {
      setIsParticipant(true)
    } else {
      alert("Error joining challenge: " + error.message)
    }
  }

  // Handle logging a daily "hard thing"
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("")
    setLoading(true)

    if (!user) {
      setStatus("You must be logged in")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("logs").insert([
      {
        user_id: user.id,
        challenge_id: challengeId,
        log_date: new Date().toISOString().split("T")[0],
        text: challengeText,
        complete: true
      }
    ])

    if (error) {
      setStatus("❌ Failed to log challenge: " + error.message)
    } else {
      setStatus("✅ Challenge logged successfully!")
      setChallengeText("")
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="p-6 text-white">Loading your dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>

      {!isParticipant ? (
        <>
          <p className="mb-4">Welcome! Join the challenge to start logging your daily hard things.</p>
          <button
            onClick={joinChallenge}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Join Challenge
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="What was your hard thing today?"
              className="w-full p-3 text-black rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Challenge"}
            </button>
          </form>
          {status && <p className="mt-4">{status}</p>}
        </>
      )}
    </div>
  )
}
