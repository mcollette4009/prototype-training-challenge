"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface SignupPageProps {
  onSwitchToLogin: () => void
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(formData.name, formData.email, formData.password)
      if (!success) {
        setError("Email already exists")
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
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

      {/* Signup Form */}
      <div className="w-full max-w-mobile">
        <div className="glass-card rounded-3xl p-8 animate-slide-up">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onSwitchToLogin}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Join the Challenge</h1>
              <p className="text-gray-300 text-sm">Create your member account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green/50 transition-all duration-300"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-green to-brand-orange text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-green flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-brand-green hover:text-brand-orange transition-colors font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
