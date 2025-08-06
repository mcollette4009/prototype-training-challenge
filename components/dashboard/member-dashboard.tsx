"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MemberDashboard() {
  const [challenge, setChallenge] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    // Get the logged in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus("You must be logged in")
      setLoading(false)
      return
    }

    // Insert into Supabase challenge_logs table
    const { error } = await supabase.from("challenge_logs").insert({
      user_id: user.id,
      description: challenge,
      date: new Date().toISOString().split("T")[0]
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
