"use client"

import { useState } from "react"
import { Trophy, Medal, Award, TrendingUp, Crown, Star, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LeaderboardPage() {
  const { user, getLeaderboard } = useAuth()
  const [activeTab, setActiveTab] = useState<"overall" | "weekly" | "friends">("overall")
  const [selectedPeriod, setSelectedPeriod] = useState("this-month")

  if (!user) return null

  const leaderboardData = getLeaderboard()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />
      case 2:
        return <Medal className="text-gray-300" size={24} />
      case 3:
        return <Award className="text-amber-600" size={24} />
      default:
        return (
          <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
            {rank}
          </div>
        )
    }
  }

  const getRankBackground = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) {
      return "bg-gradient-to-r from-brand-green/20 to-brand-orange/20 border-brand-orange/30 glow-orange"
    }

    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30"
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-300/30"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  const currentUserData = leaderboardData.find((data) => data.userId === user.id)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-orange/20 rounded-2xl">
              <Trophy className="text-brand-orange" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Leaderboard</h1>
              <p className="text-gray-400">See how you stack up</p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent pr-8"
            >
              <option value="this-week" className="bg-gray-800">
                This Week
              </option>
              <option value="this-month" className="bg-gray-800">
                This Month
              </option>
              <option value="all-time" className="bg-gray-800">
                All Time
              </option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab("overall")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "overall"
                ? "bg-brand-orange text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "weekly" ? "bg-brand-orange text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "friends"
                ? "bg-brand-orange text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUserData && (
        <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentUserData.avatar || "/placeholder.svg"}
                alt={currentUserData.name}
                className="w-16 h-16 rounded-2xl border-2 border-brand-green"
              />
              <div className="absolute -top-2 -right-2 bg-brand-green text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                #{currentUserData.rank}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{currentUserData.name}</h3>
              <p className="text-sm text-gray-400">Your current position</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-brand-orange">{currentUserData.points}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div>
                <div className="text-xl font-bold text-brand-green">{currentUserData.streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">{currentUserData.completionRate}%</div>
                <div className="text-xs text-gray-400">Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Star className="text-yellow-400" size={20} />
            <span>Top Performers</span>
          </h3>

          <div className="flex items-end justify-center space-x-4">
            {/* 2nd Place */}
            {leaderboardData[1] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <img
                    src={leaderboardData[1].avatar || "/placeholder.svg"}
                    alt={leaderboardData[1].name}
                    className="w-16 h-16 rounded-2xl border-2 border-gray-300 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-300 text-gray-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    2
                  </div>
                </div>
                <div className="bg-gray-300/20 rounded-t-2xl p-4 h-20 flex flex-col justify-end">
                  <div className="text-sm font-bold text-white">{leaderboardData[1].name}</div>
                  <div className="text-xs text-gray-300">{leaderboardData[1].points} pts</div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboardData[0] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <img
                    src={leaderboardData[0].avatar || "/placeholder.svg"}
                    alt={leaderboardData[0].name}
                    className="w-20 h-20 rounded-2xl border-2 border-yellow-400 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                  <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400" size={20} />
                </div>
                <div className="bg-yellow-400/20 rounded-t-2xl p-4 h-24 flex flex-col justify-end">
                  <div className="text-sm font-bold text-white">{leaderboardData[0].name}</div>
                  <div className="text-xs text-yellow-400">{leaderboardData[0].points} pts</div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboardData[2] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <img
                    src={leaderboardData[2].avatar || "/placeholder.svg"}
                    alt={leaderboardData[2].name}
                    className="w-16 h-16 rounded-2xl border-2 border-amber-600 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-amber-100 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    3
                  </div>
                </div>
                <div className="bg-amber-600/20 rounded-t-2xl p-4 h-16 flex flex-col justify-end">
                  <div className="text-sm font-bold text-white">{leaderboardData[2].name}</div>
                  <div className="text-xs text-amber-400">{leaderboardData[2].points} pts</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <TrendingUp className="text-brand-green" size={20} />
            <span>Full Rankings</span>
          </h3>
          <div className="text-sm text-gray-400">{leaderboardData.length} participants</div>
        </div>

        <div className="space-y-3">
          {leaderboardData.map((userData, index) => (
            <div
              key={userData.userId}
              className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${getRankBackground(
                userData.rank,
                userData.userId === user.id,
              )}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex items-center space-x-2 w-12">{getRankIcon(userData.rank)}</div>

                {/* Avatar */}
                <img src={userData.avatar || "/placeholder.svg"} alt={userData.name} className="w-12 h-12 rounded-xl" />

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white">{userData.name}</h4>
                    {userData.userId === user.id && (
                      <span className="text-xs bg-brand-green/20 text-brand-green px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{userData.completionRate}% completion</span>
                    <span>•</span>
                    <span>{userData.streak} day streak</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{userData.points}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Award className="text-brand-orange" size={20} />
          <span>Recent Achievements</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-sm font-medium text-white">Fire Starter</div>
            <div className="text-xs text-gray-400">10+ day streak</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">💪</div>
            <div className="text-sm font-medium text-white">Challenger</div>
            <div className="text-xs text-gray-400">Completed 3 challenges</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-sm font-medium text-white">Rising Star</div>
            <div className="text-xs text-gray-400">Top 10 this week</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-white">Consistent</div>
            <div className="text-xs text-gray-400">90% completion rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
