"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loading) return <p className="text-white p-4">Loading...</p>

  if (user) {
    return (
      <div style={{ padding: "20px", color: "white", background: "black" }}>
        <h2>Welcome {user.email}</h2>
        <button
          onClick={handleLogout}
          style={{ marginTop: "10px", padding: "8px", background: "red", color: "white" }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", color: "white", background: "black" }}>
      <h1>Login or Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "250px", color: "black" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "250px", color: "black" }}
        />
        <button type="submit" style={{ padding: "8px", background: "green", color: "white" }}>
          Login
        </button>
      </form>

      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "250px", color: "black" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "250px", color: "black" }}
        />
        <button type="submit" style={{ padding: "8px", background: "blue", color: "white" }}>
          Sign Up
        </button>
      </form>
    </div>
  )
}
