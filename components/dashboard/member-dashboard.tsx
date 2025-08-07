"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MemberDashboard() {
  const [challenge, setChallenge] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch logged-in user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        console.error("Failed to get user:", error?.message)
      }
    }

    getUser()
  }, [])

  // Hardcoded challenge ID to join
  const CHALLENGE_ID = "e40167ff-9a88-400c-9ec1-0f7bb15582d8" // Replace if you created a new one

  const handleJoinChallenge = async () => {
    if (!userId) {
      setStatus("❌ You must be logged in.")
      return
    }

    const { error } = await supabase.from("challenge_participants").insert({
      user_id: userId,
      challenge_id: CHALLENGE_ID,
    })

    if (error) {
      setStatus(`❌ Error joining challenge: ${error.message}`)
    } else {
      setStatus("✅ You joined the challenge!")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    if (!userId) {
      setStatus("❌ You must be logged in.")
      setLoading(false)
      return
    }

    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase.from("challenge_logs").insert({
      user_id: userId,
      date: today,
      description: challenge,
    })

    if (error) {
      setStatus("❌ Failed to log challenge: " + error.message)
    } else {
      setStatus("✅ Challenge logged successfully!")
      setChallenge("")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>

      <button
        onClick={handleJoinChallenge}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mb-6"
      >
        Join Challenge
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
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
    </div>
  )
}
