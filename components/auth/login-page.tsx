"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

interface LoginPageProps {
  onSwitchToSignup: () => void
  onSwitchToAdminLogin: () => void
}

export default function LoginPage({ onSwitchToSignup, onSwitchToAdminLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-orange/10 pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <Image
          src="/prototype-logo.png"
          alt="Prototype Training Systems"
          width={80}
          height={80}
          className="rounded-full glow-green"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-mobile">
        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your transformation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-brand-green hover:text-brand-orange font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Admin Portal Access */}
      <button
        onClick={onSwitchToAdminLogin}
        className="fixed bottom-4 right-4 p-3 bg-brand-orange/20 hover:bg-brand-orange/30 rounded-full transition-all opacity-50 hover:opacity-100"
      >
        <Shield className="text-brand-orange" size={20} />
      </button>
    </div>
  )
}
