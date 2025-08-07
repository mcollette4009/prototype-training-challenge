"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MemberDashboard() {
  const [log, setLog] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus("❌ You must be logged in.")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("challenge_logs").insert({
      user_id: user.id,
      description: log,
      date: new Date().toISOString().split("T")[0],
    })

    if (error) {
      setStatus("❌ Failed to log challenge: " + error.message)
    } else {
      setStatus("✅ Challenge logged successfully!")
      setLog("")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Member Dashboard</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder="What was your hard thing today?"
            className="bg-gray-800 text-white min-h-[140px]"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-orange transition-colors"
          >
            {loading ? "Saving..." : "Save Log"}
          </Button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-white bg-white/10 border border-white/20 rounded p-3">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
