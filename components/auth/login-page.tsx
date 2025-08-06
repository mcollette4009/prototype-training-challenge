"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface LoginPageProps {
  onSwitchToSignup: () => void
  onSwitchToAdminLogin: () => void
}

export default function LoginPage({ onSwitchToSignup, onSwitchToAdminLogin }: LoginPageProps) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(formData.email, formData.password)
      if (!success) {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-orange/10 pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="relative">
          <Image
            src="/prototype-logo.png"
            alt="Prototype Training Systems"
            width={80}
            height={80}
            className="rounded-full glow-green"
          />
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-mobile">
        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your transformation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demo Credentials */}
            <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
              <p className="text-blue-400 text-sm font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-300 space-y-1">
                <p>Member: member@prototype.com / password123</p>
                <p>Admin: admin@prototype.com / admin123</p>
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
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
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
              className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-green flex items-center justify-center space-x-2"
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
                className="text-brand-green hover:text-brand-orange transition-colors font-medium"
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
        className="fixed bottom-4 right-4 p-3 bg-brand-orange/20 hover:bg-brand-orange/30 rounded-full transition-all duration-300 opacity-50 hover:opacity-100"
        title="Admin Portal"
      >
        <Shield className="text-brand-orange" size={20} />
      </button>
    </div>
  )
}
