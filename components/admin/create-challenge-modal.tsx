"use client"

import type React from "react"
import { useState } from "react"
import { X, Calendar, ImageIcon, Plus, Trash2 } from "lucide-react"

interface Challenge {
  title: string
  description: string
  startDate: string
  endDate: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  coverImage?: string
  dailyPrompts: string[]
}

interface CreateChallengeModalProps {
  onClose: () => void
  onSubmit: (challenge: Challenge) => void
}

export default function CreateChallengeModal({ onClose, onSubmit }: CreateChallengeModalProps) {
  const [formData, setFormData] = useState<Challenge>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: 30,
    difficulty: "Beginner",
    coverImage: "",
    dailyPrompts: [""],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate duration from dates
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    onSubmit({
      ...formData,
      duration,
      dailyPrompts: formData.dailyPrompts.filter((prompt) => prompt.trim() !== ""),
    })
  }

  const addPrompt = () => {
    setFormData((prev) => ({
      ...prev,
      dailyPrompts: [...prev.dailyPrompts, ""],
    }))
  }

  const removePrompt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dailyPrompts: prev.dailyPrompts.filter((_, i) => i !== index),
    }))
  }

  const updatePrompt = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dailyPrompts: prev.dailyPrompts.map((prompt, i) => (i === index ? value : prompt)),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Create New Challenge</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Challenge Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., 30-Day Hard Challenge"
              className="w-full px-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm transition-all duration-300"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this challenge is about..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm resize-none transition-all duration-300"
              required
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Difficulty Level</label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, difficulty: e.target.value as Challenge["difficulty"] }))
              }
              className="w-full px-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm transition-all duration-300"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Cover Image URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-3 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm transition-all duration-300"
              />
            </div>
            {formData.coverImage && (
              <div className="mt-2">
                <img
                  src={formData.coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-2xl border border-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Daily Prompts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Daily Prompts (Optional)</label>
              <button
                type="button"
                onClick={addPrompt}
                className="text-brand-green hover:text-brand-orange transition-colors duration-300 p-1"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {formData.dailyPrompts.map((prompt, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => updatePrompt(index, e.target.value)}
                    placeholder={`Day ${index + 1} prompt...`}
                    className="flex-1 px-4 py-2 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green backdrop-blur-sm text-sm transition-all duration-300"
                  />
                  {formData.dailyPrompts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrompt(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 glow-green hover:scale-105 transition-all duration-300"
          >
            <span>Create Challenge</span>
          </button>
        </form>
      </div>
    </div>
  )
}
