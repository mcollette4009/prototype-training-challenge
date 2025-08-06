"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  startDate: string
  endDate: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  coverImage?: string
  dailyPrompts: string[]
  participants: number
  createdBy: string
  createdAt: string
}

interface DailyLog {
  id: string
  userId: string
  challengeId: string
  date: string
  text: string
  completed: boolean
  photoUrl?: string
  timestamp: string
}

interface AuthContextType {
  user: User | null
  users: User[]
  challenges: Challenge[]
  dailyLogs: DailyLog[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  createChallenge: (challenge: Omit<Challenge, "id" | "participants" | "createdBy" | "createdAt">) => void
  updateChallenge: (id: string, updates: Partial<Challenge>) => void
  deleteChallenge: (id: string) => void
  joinChallenge: (challengeId: string) => void
  saveDailyLog: (challengeId: string, date: string, text: string, completed: boolean, photoUrl?: string) => void
  likeDailyLog: (logId: string) => void
  getLeaderboard: () => Array<{
    userId: string
    name: string
    avatar?: string
    points: number
    completionRate: number
    streak: number
    rank: number
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data initialization
const initializeMockData = () => {
  const mockUsers: User[] = [
    {
      id: "admin-1",
      name: "Admin User",
      email: "admin@prototype.com",
      role: "admin",
      joinedChallenges: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "member-1",
      name: "John Doe",
      email: "member@prototype.com",
      role: "member",
      joinedChallenges: ["challenge-1"],
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    },
    {
      id: "member-2",
      name: "Sarah Champion",
      email: "sarah@prototype.com",
      role: "member",
      joinedChallenges: ["challenge-1"],
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    {
      id: "member-3",
      name: "Mike Warrior",
      email: "mike@prototype.com",
      role: "member",
      joinedChallenges: ["challenge-1"],
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "/placeholder.svg?height=40&width=40&text=MW",
    },
  ]

  const mockChallenges: Challenge[] = [
    {
      id: "challenge-1",
      title: "30-Day Hard Challenge",
      description: "Transform your life with daily discipline. Push your limits every single day for 30 days straight.",
      startDate: "2025-01-01",
      endDate: "2025-01-30",
      duration: 30,
      difficulty: "Advanced",
      coverImage: "/placeholder.svg?height=200&width=300&text=30+Day+Challenge",
      dailyPrompts: [
        "What hard thing did you do today?",
        "How did you push your comfort zone?",
        "What did you learn about yourself?",
      ],
      participants: 1247,
      createdBy: "admin-1",
      createdAt: "2024-12-01T00:00:00Z",
    },
    {
      id: "challenge-2",
      title: "Morning Warrior",
      description: "Wake up at 5 AM every day and complete a structured morning routine.",
      startDate: "2025-01-15",
      endDate: "2025-02-14",
      duration: 30,
      difficulty: "Intermediate",
      coverImage: "/placeholder.svg?height=200&width=300&text=Morning+Warrior",
      dailyPrompts: ["What did you accomplish in your morning routine?", "How did you feel waking up early?"],
      participants: 892,
      createdBy: "admin-1",
      createdAt: "2024-12-15T00:00:00Z",
    },
  ]

  const mockDailyLogs: DailyLog[] = [
    {
      id: "log-1",
      userId: "member-2",
      challengeId: "challenge-1",
      date: "2025-01-08",
      text: "Completed a 5AM cold plunge for 3 minutes! The mental clarity afterward was incredible. Learning that discomfort is temporary but growth is permanent.",
      completed: true,
      photoUrl: "/placeholder.svg?height=200&width=300&text=Cold+Plunge",
      timestamp: "2025-01-08T06:00:00Z",
    },
    {
      id: "log-2",
      userId: "member-3",
      challengeId: "challenge-1",
      date: "2025-01-08",
      text: "Spoke at a networking event despite my fear of public speaking. Hands were shaking but I pushed through. Realized I'm more capable than I thought.",
      completed: true,
      timestamp: "2025-01-08T19:30:00Z",
    },
    {
      id: "log-3",
      userId: "member-1",
      challengeId: "challenge-1",
      date: "2025-01-07",
      text: "Woke up at 4:30 AM for a 10-mile run in the rain. Every step was a choice to keep going. Learning that discipline is built one decision at a time.",
      completed: true,
      photoUrl: "/placeholder.svg?height=200&width=300&text=Morning+Run",
      timestamp: "2025-01-07T05:00:00Z",
    },
  ]

  return { mockUsers, mockChallenges, mockDailyLogs }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize mock data
    const { mockUsers, mockChallenges, mockDailyLogs } = initializeMockData()
    setUsers(mockUsers)
    setChallenges(mockChallenges)
    setDailyLogs(mockDailyLogs)

    // Check for stored user session
    const storedUser = localStorage.getItem("prototype-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        const foundUser = mockUsers.find((u) => u.id === parsedUser.id)
        if (foundUser) {
          setUser(foundUser)
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("prototype-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication
    const validCredentials: Record<string, string> = {
      "admin@prototype.com": "admin123",
      "member@prototype.com": "password123",
      "sarah@prototype.com": "password123",
      "mike@prototype.com": "password123",
    }

    if (validCredentials[email] === password) {
      const foundUser = users.find((u) => u.email === email)
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("prototype-user", JSON.stringify(foundUser))
        setIsLoading(false)
        return true
      }
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: `member-${Date.now()}`,
      name,
      email,
      role: "member",
      joinedChallenges: [],
      createdAt: new Date().toISOString(),
      avatar: `/placeholder.svg?height=40&width=40&text=${name
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
    }

    setUsers((prev) => [...prev, newUser])
    setUser(newUser)
    localStorage.setItem("prototype-user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("prototype-user")
  }

  const createChallenge = (challengeData: Omit<Challenge, "id" | "participants" | "createdBy" | "createdAt">) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: `challenge-${Date.now()}`,
      participants: 0,
      createdBy: user?.id || "",
      createdAt: new Date().toISOString(),
    }

    setChallenges((prev) => [...prev, newChallenge])
  }

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    setChallenges((prev) => prev.map((challenge) => (challenge.id === id ? { ...challenge, ...updates } : challenge)))
  }

  const deleteChallenge = (id: string) => {
    setChallenges((prev) => prev.filter((challenge) => challenge.id !== id))
    setDailyLogs((prev) => prev.filter((log) => log.challengeId !== id))
  }

  const joinChallenge = (challengeId: string) => {
    if (!user) return

    setUser((prev) => {
      if (!prev) return prev
      const updatedUser = {
        ...prev,
        joinedChallenges: [...prev.joinedChallenges, challengeId],
      }
      localStorage.setItem("prototype-user", JSON.stringify(updatedUser))
      return updatedUser
    })

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, joinedChallenges: [...u.joinedChallenges, challengeId] } : u)),
    )

    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, participants: challenge.participants + 1 } : challenge,
      ),
    )
  }

  const saveDailyLog = (challengeId: string, date: string, text: string, completed: boolean, photoUrl?: string) => {
    if (!user) return

    const existingLogIndex = dailyLogs.findIndex(
      (log) => log.userId === user.id && log.challengeId === challengeId && log.date === date,
    )

    const logData = {
      id: existingLogIndex >= 0 ? dailyLogs[existingLogIndex].id : `log-${Date.now()}`,
      userId: user.id,
      challengeId,
      date,
      text,
      completed,
      photoUrl,
      timestamp: new Date().toISOString(),
    }

    if (existingLogIndex >= 0) {
      setDailyLogs((prev) => prev.map((log, index) => (index === existingLogIndex ? logData : log)))
    } else {
      setDailyLogs((prev) => [...prev, logData])
    }
  }

  const likeDailyLog = (logId: string) => {
    // Mock like functionality - in real app would track likes per user
    console.log(`Liked log ${logId}`)
  }

  const getLeaderboard = () => {
    const leaderboardData = users
      .filter((u) => u.role === "member")
      .map((u) => {
        const userLogs = dailyLogs.filter((log) => log.userId === u.id)
        const completedLogs = userLogs.filter((log) => log.completed)
        const points = completedLogs.length * 10 // 10 points per completion
        const completionRate = userLogs.length > 0 ? (completedLogs.length / userLogs.length) * 100 : 0

        // Calculate streak
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateStr = checkDate.toISOString().split("T")[0]

          const log = userLogs.find((l) => l.date === dateStr && l.completed)
          if (log) {
            streak++
          } else {
            break
          }
        }

        return {
          userId: u.id,
          name: u.name,
          avatar: u.avatar,
          points,
          completionRate: Math.round(completionRate),
          streak,
          rank: 0, // Will be set after sorting
        }
      })
      .sort((a, b) => b.points - a.points)
      .map((item, index) => ({ ...item, rank: index + 1 }))

    return leaderboardData
  }

  const value: AuthContextType = {
    user,
    users,
    challenges,
    dailyLogs,
    isLoading,
    login,
    signup,
    logout,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    joinChallenge,
    saveDailyLog,
    likeDailyLog,
    getLeaderboard,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
