"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Calendar, Users, Trophy, Settings } from "lucide-react"
import CreateChallengeModal from "./create-challenge-modal"
import EditChallengeModal from "./edit-challenge-modal"

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  participants: number
  startDate: string
  endDate: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  coverImage?: string
  dailyPrompts: string[]
  joined: boolean
}

interface AdminDashboardProps {
  challenges: Challenge[]
  onCreateChallenge: (challenge: Omit<Challenge, "id" | "participants" | "joined">) => void
  onUpdateChallenge: (id: string, challenge: Partial<Challenge>) => void
  onDeleteChallenge: (id: string) => void
}

export default function AdminDashboard({
  challenges,
  onCreateChallenge,
  onUpdateChallenge,
  onDeleteChallenge,
}: AdminDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)

  const handleDelete = (challengeId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      onDeleteChallenge(challengeId)
    }
  }

  const activeChallenges = challenges.filter((c) => new Date(c.endDate) > new Date())
  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">Manage challenges and community</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 glow-green hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            <span>New Challenge</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-brand-green">{challenges.length}</div>
            <div className="text-sm text-gray-400">Total Challenges</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-brand-orange">{activeChallenges.length}</div>
            <div className="text-sm text-gray-400">Active Challenges</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl font-bold text-white">{totalParticipants}</div>
            <div className="text-sm text-gray-400">Total Participants</div>
          </div>
        </div>
      </div>

      {/* Challenges Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Settings size={20} className="text-brand-green" />
          <span>Manage Challenges</span>
        </h2>

        {challenges.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No challenges yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first challenge to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-brand-green to-brand-orange text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Create Challenge
            </button>
          </div>
        ) : (
          challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="glass-card rounded-3xl p-6 animate-slide-up hover:scale-[1.01] transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(challenge.endDate) > new Date()
                          ? "bg-green-400/20 text-green-400"
                          : "bg-gray-400/20 text-gray-400"
                      }`}
                    >
                      {new Date(challenge.endDate) > new Date() ? "Active" : "Ended"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">{challenge.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-brand-green" />
                      <span>{challenge.duration} days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-brand-orange" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    {challenge.dailyPrompts.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <span>{challenge.dailyPrompts.length} prompts</span>
                      </div>
                    )}
                  </div>
                </div>

                {challenge.coverImage && (
                  <div className="ml-4">
                    <img
                      src={challenge.coverImage || "/placeholder.svg"}
                      alt={challenge.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-sm text-gray-400">
                  <p>
                    {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                    {new Date(challenge.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingChallenge(challenge)}
                    className="p-2 text-gray-400 hover:text-brand-green rounded-xl hover:bg-brand-green/10 transition-all duration-300 touch-target"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id, challenge.title)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-400/10 transition-all duration-300 touch-target"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(challenge) => {
            onCreateChallenge(challenge)
            setShowCreateModal(false)
          }}
        />
      )}

      {editingChallenge && (
        <EditChallengeModal
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onSubmit={(updatedChallenge) => {
            onUpdateChallenge(editingChallenge.id, updatedChallenge)
            setEditingChallenge(null)
          }}
        />
      )}
    </div>
  )
}
