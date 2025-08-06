"use client"

import { useState } from "react"
import { Search, Filter, Users, Calendar, Clock, ChevronRight, Star, Trophy } from "lucide-react"
import ChallengeDetailPage from "./challenge-detail-page"

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  participants: number
  startDate: string
  endDate: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  coverImage?: string
  dailyPrompts: string[]
  joined: boolean
  featured?: boolean
}

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "joined">("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "30-Day Hard Challenge",
      description: "Transform your life with daily discipline. Workout, diet, reading, and cold exposure.",
      duration: 30,
      participants: 15420,
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      difficulty: "Advanced",
      category: "Lifestyle",
      coverImage: "/placeholder.svg?height=200&width=400&text=30-Day+Hard+Challenge",
      dailyPrompts: [
        "Complete a 45-minute workout",
        "Follow your diet strictly",
        "Read 10 pages of non-fiction",
        "Take a 5-minute cold shower",
        "Drink 1 gallon of water",
      ],
      joined: true,
      featured: true,
    },
    {
      id: "2",
      title: "Morning Routine Mastery",
      description: "Build the perfect morning routine to set yourself up for success every day.",
      duration: 21,
      participants: 8930,
      startDate: "2024-01-15",
      endDate: "2024-02-04",
      difficulty: "Beginner",
      category: "Habits",
      coverImage: "/placeholder.svg?height=200&width=400&text=Morning+Routine",
      dailyPrompts: ["Wake up at 6 AM", "Make your bed immediately", "Meditate for 10 minutes", "Write 3 gratitudes"],
      joined: false,
    },
    {
      id: "3",
      title: "Fitness Foundation",
      description: "Build strength and endurance with progressive workouts designed for beginners.",
      duration: 28,
      participants: 12100,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      difficulty: "Beginner",
      category: "Fitness",
      coverImage: "/placeholder.svg?height=200&width=400&text=Fitness+Foundation",
      dailyPrompts: ["Complete assigned workout", "Track your progress", "Stretch for 10 minutes"],
      joined: false,
    },
    {
      id: "4",
      title: "Mindfulness Journey",
      description: "Develop mental clarity and emotional resilience through daily mindfulness practices.",
      duration: 14,
      participants: 6750,
      startDate: "2024-01-20",
      endDate: "2024-02-02",
      difficulty: "Intermediate",
      category: "Mental Health",
      coverImage: "/placeholder.svg?height=200&width=400&text=Mindfulness+Journey",
      dailyPrompts: ["Meditate for 15 minutes", "Practice gratitude journaling", "Do a body scan exercise"],
      joined: true,
    },
  ]

  const categories = ["all", "Lifestyle", "Habits", "Fitness", "Mental Health", "Productivity"]

  const filteredChallenges = mockChallenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory
    const matchesTab = activeTab === "browse" || (activeTab === "joined" && challenge.joined)

    return matchesSearch && matchesCategory && matchesTab
  })

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

  const handleJoinChallenge = (challengeId: string) => {
    // In a real app, this would make an API call
    alert(`Joined challenge ${challengeId}!`)
  }

  if (selectedChallenge) {
    return (
      <ChallengeDetailPage
        challenge={selectedChallenge}
        onBack={() => setSelectedChallenge(null)}
        onJoinChallenge={handleJoinChallenge}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Challenges</h1>
            <p className="text-gray-400">Transform yourself through structured challenges</p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="text-brand-orange" size={20} />
            <span className="text-sm text-gray-300">Level up your life</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "browse"
                ? "bg-brand-green text-white glow-green"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "joined"
                ? "bg-brand-green text-white glow-green"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            My Challenges
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300 appearance-none"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800">
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="space-y-4">
        {filteredChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            className="glass-card rounded-3xl p-6 animate-slide-up hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedChallenge(challenge)}
          >
            {/* Featured Badge */}
            {challenge.featured && (
              <div className="flex items-center space-x-2 mb-4">
                <Star className="text-yellow-400" size={16} />
                <span className="text-xs font-medium text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">
                  Featured Challenge
                </span>
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* Challenge Image */}
              <div className="w-24 h-24 bg-gradient-to-br from-brand-green/20 to-brand-orange/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                {challenge.coverImage ? (
                  <img
                    src={challenge.coverImage || "/placeholder.svg"}
                    alt={challenge.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Trophy className="text-brand-green" size={32} />
                )}
              </div>

              {/* Challenge Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{challenge.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                {/* Challenge Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-brand-green" />
                    <span>{challenge.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} className="text-brand-orange" />
                    <span>{challenge.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-yellow-400" />
                    <span>{challenge.category}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {challenge.joined && (
                      <span className="text-xs font-medium text-brand-green bg-brand-green/20 px-2 py-1 rounded-full">
                        ✅ Joined
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-brand-green hover:text-brand-orange transition-colors duration-300">
                    <span className="text-sm font-medium">{challenge.joined ? "View Progress" : "Learn More"}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <div className="glass-card rounded-3xl p-12 text-center animate-slide-up">
          <Trophy className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Challenges Found</h3>
          <p className="text-gray-400 mb-6">
            {activeTab === "joined"
              ? "You haven't joined any challenges yet. Browse available challenges to get started!"
              : "Try adjusting your search or filter criteria."}
          </p>
          {activeTab === "joined" && (
            <button
              onClick={() => setActiveTab("browse")}
              className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Browse Challenges
            </button>
          )}
        </div>
      )}
    </div>
  )
}
