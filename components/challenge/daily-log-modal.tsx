"use client"

import type React from "react"
import { useState } from "react"
import { X, Camera, Check, AlertCircle } from "lucide-react"

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

interface DailyLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (text: string, completed: boolean, photoUrl?: string) => void
  selectedDate: string
  challengeTitle: string
  existingLog?: DailyLog
}

export default function DailyLogModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  challengeTitle,
  existingLog,
}: DailyLogModalProps) {
  const [text, setText] = useState(existingLog?.text || "")
  const [completed, setCompleted] = useState(existingLog?.completed || false)
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(existingLog?.photoUrl)
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split("T")[0]) {
      return "Today"
    } else if (dateStr === yesterday.toISOString().split("T")[0]) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate save delay
    onSave(text.trim(), completed, photoUrl)
    setIsLoading(false)
  }

  const characterLimit = 500
  const remainingChars = characterLimit - text.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div className="w-full max-w-mobile bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Daily Challenge Log</h2>
            <p className="text-sm text-gray-400">
              {formatDate(selectedDate)} • {challengeTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Challenge Status */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Challenge Status</label>
            <div className="flex space-x-3">
              <button
                onClick={() => setCompleted(true)}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  completed
                    ? "bg-brand-green/20 border-brand-green text-brand-green"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-brand-green/50"
                }`}
              >
                <Check size={20} className="mx-auto mb-2" />
                <div className="text-sm font-semibold">Completed</div>
              </button>
              <button
                onClick={() => setCompleted(false)}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  !completed
                    ? "bg-brand-orange/20 border-brand-orange text-brand-orange"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-brand-orange/50"
                }`}
              >
                <AlertCircle size={20} className="mx-auto mb-2" />
                <div className="text-sm font-semibold">Attempted</div>
              </button>
            </div>
          </div>

          {/* Reflection Prompt */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Challenge Reflection</label>
            <div className="p-4 bg-brand-green/10 border border-brand-green/20 rounded-2xl">
              <p className="text-sm text-brand-green font-medium mb-2">Reflection Prompts:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• What hard thing did you do for today's challenge?</li>
                <li>• What did you learn about yourself?</li>
              </ul>
            </div>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your challenge experience and personal insights..."
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
                maxLength={characterLimit}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">{remainingChars} characters left</div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Progress Photo (Optional)</label>
            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Progress"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-xl hover:bg-red-500 transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-brand-green/50 transition-all duration-300">
                <Camera size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Tap to add photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 text-gray-300 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim() || isLoading}
            className="flex-1 py-4 bg-gradient-to-r from-brand-green to-brand-orange text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Save Entry</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
