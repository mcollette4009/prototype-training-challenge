"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Users, Trophy, BarChart3, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import CreateChallengeModal from "@/components/admin/create-challenge-modal"
import EditChallengeModal from "@/components/admin/edit-challenge-modal"

export default function AdminDashboard() {
  const { user, challenges, users, dailyLogs, logout, createChallenge, updateChallenge, deleteChallenge } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<any>(null)

  if (!user || user.role !== "admin") return null

  const totalMembers = users.filter((u) => u.role === "member").length
  const totalLogs = dailyLogs.length
  const activeChallenges = challenges.filter((c) => new Date(c.endDate) > new Date()).length

  const handleDeleteChallenge = (challengeId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteChallenge(challengeId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 max-w-mobile mx-auto relative">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-header border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img src="/prototype-logo.png" alt="Prototype Training Systems" className="h-8 w-auto" />
            <div className="px-3 py-1 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded-full text-xs font-medium">
              Admin
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Header */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up border-2 border-brand-orange/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-orange">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm">Welcome back, {user.name}</p>
            </div>
            <div className="text-4xl">🛡️</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-orange">{challenges.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Challenges</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{totalMembers}</div>
            <div className="text-sm text-gray-400 mt-1">Members</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-green">{totalLogs}</div>
            <div className="text-sm text-gray-400 mt-1">Daily Logs</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
            <Settings size={24} className="text-brand-orange" />
            <span>Quick Actions</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-4 bg-gradient-to-r from-brand-orange/20 to-brand-green/20 rounded-2xl border border-brand-orange/30 hover:scale-105 transition-all duration-300"
            >
              <Plus size={24} className="text-brand-orange mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Create Challenge</div>
            </button>

            <button className="p-4 bg-gradient-to-r from-brand-green/20 to-brand-orange/20 rounded-2xl border border-brand-green/30 hover:scale-105 transition-all duration-300">
              <Users size={24} className="text-brand-green mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">Manage Members</div>
            </button>
          </div>
        </div>

        {/* Challenges Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Trophy size={20} className="text-brand-green" />
              <span>Manage Challenges</span>
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-brand-orange to-brand-green text-white px-4 py-2 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>

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
                        <BarChart3 size={16} className="text-brand-green" />
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
                      onClick={() => handleDeleteChallenge(challenge.id, challenge.title)}
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
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(challenge) => {
            createChallenge(challenge)
            setShowCreateModal(false)
          }}
        />
      )}

      {editingChallenge && (
        <EditChallengeModal
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onSubmit={(updatedChallenge) => {
            updateChallenge(editingChallenge.id, updatedChallenge)
            setEditingChallenge(null)
          }}
        />
      )}
    </div>
  )
}
