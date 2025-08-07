"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

interface User {
  id: string
  name: string
  email: string
  role: "member" | "admin"
  joinedChallenges: string[]
  createdAt: string
  avatar?: string
}

interface Challenge {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  cover_image?: string
  daily_prompts: string[]
  participants: number
  created_by: string
  created_at: string
}

interface DailyLog {
  id: string
  user_id: string
  challenge_id: string
  date: string
  description: string
  completed: boolean
  photo_url?: string
  timestamp: string
}

interface AuthContextType {
  user: User | null
  challenges: Challenge[]
  dailyLogs: DailyLog[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  joinChallenge: (challengeId: string) => Promise<void>
  saveDailyLog: (challengeId: string, date: string, description: string, completed: boolean, photoUrl?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (!supabaseUser) {
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (profile) {
        const joined = await supabase
          .from("challenge_participants")
          .select("challenge_id")
          .eq("user_id", supabaseUser.id)

        const joinedChallenges = joined.data?.map((j) => j.challenge_id) || []

        setUser({
          id: profile.id,
          name: profile.name || "",
          email: profile.email,
          role: "member",
          joinedChallenges,
          createdAt: profile.created_at,
          avatar: profile.avatar || "",
        })
      }

      const { data: challengesData } = await supabase.from("challenges").select("*")
      setChallenges(challengesData || [])

      const { data: logs } = await supabase.from("challenge_logs").select("*")
      setDailyLogs(logs || [])

      setIsLoading(false)
    }

    fetchUserData()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data?.user && !error) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        name,
        role: "member",
      })
      return true
    }
    return false
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const joinChallenge = async (challengeId: string) => {
    if (!user) return

    await supabase.from("challenge_participants").insert({
      user_id: user.id,
      challenge_id: challengeId,
    })

    setUser((prev) =>
      prev ? { ...prev, joinedChallenges: [...prev.joinedChallenges, challengeId] } : prev
    )
  }

  const saveDailyLog = async (
    challengeId: string,
    date: string,
    description: string,
    completed: boolean,
    photoUrl?: string
  ) => {
    if (!user) return

    const existing = await supabase
      .from("challenge_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .eq("date", date)
      .single()

    if (existing.data) {
      await supabase
        .from("challenge_logs")
        .update({
          description,
          completed,
          photo_url: photoUrl,
          timestamp: new Date().toISOString(),
        })
        .eq("id", existing.data.id)
    } else {
      await supabase.from("challenge_logs").insert({
        user_id: user.id,
        challenge_id: challengeId,
        date,
        description,
        completed,
        photo_url: photoUrl,
        timestamp: new Date().toISOString(),
      })
    }

    const { data: updatedLogs } = await supabase.from("challenge_logs").select("*")
    setDailyLogs(updatedLogs || [])
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        challenges,
        dailyLogs,
        isLoading,
        login,
        signup,
        logout,
        joinChallenge,
        saveDailyLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
