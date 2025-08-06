"use client"

import { Shield, Users, ArrowRight } from "lucide-react"
import Image from "next/image"

interface RoleSelectionProps {
  onRoleSelect: (role: "admin" | "member") => void
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background with logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative">
            <Image
              src="/prototype-logo.png"
              alt="Prototype Training Systems"
              width={300}
              height={300}
              className="rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-orange/20 rounded-full backdrop-blur-3xl"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-brand-orange/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image
                src="/prototype-logo.png"
                alt="Prototype Training Systems"
                width={80}
                height={80}
                className="rounded-full glow-green"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-orange/20 rounded-full backdrop-blur-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Choose Your Role</h1>
          <p className="text-gray-300 text-lg">Select how you'd like to access the platform</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4 animate-slide-up">
          {/* Admin Role */}
          <button
            onClick={() => onRoleSelect("admin")}
            className="w-full glass-card rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-brand-orange/20 to-brand-orange/30 rounded-2xl group-hover:from-brand-orange/30 group-hover:to-brand-orange/40 transition-all duration-300">
                <Shield size={32} className="text-brand-orange" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-white mb-2">Admin</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Create and manage challenges, view participant data, and moderate community content
                </p>
              </div>
              <ArrowRight
                size={24}
                className="text-gray-400 group-hover:text-brand-orange transition-colors duration-300"
              />
            </div>
          </button>

          {/* Member Role */}
          <button
            onClick={() => onRoleSelect("member")}
            className="w-full glass-card rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-r from-brand-green/20 to-brand-green/30 rounded-2xl group-hover:from-brand-green/30 group-hover:to-brand-green/40 transition-all duration-300">
                <Users size={32} className="text-brand-green" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-white mb-2">Member</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Join challenges, track progress, write journal entries, and connect with the community
                </p>
              </div>
              <ArrowRight
                size={24}
                className="text-gray-400 group-hover:text-brand-green transition-colors duration-300"
              />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 animate-fade-in">
          <p>Demo mode - You can switch roles anytime from the profile page</p>
        </div>
      </div>
    </div>
  )
}
