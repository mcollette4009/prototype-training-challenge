"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface AdminLoginPageProps {
  onBackToLogin: () => void
}

export default function AdminLoginPage({ onBackToLogin }: AdminLoginPageProps) {
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
        setError("Invalid admin credentials")
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
      {/* Background gradient overlay - Orange theme for admin */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-green/10 pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="relative">
          <Image
            src="/prototype-logo.png"
            alt="Prototype Training Systems"
            width={80}
            height={80}
            className="rounded-full glow-orange"
          />
        </div>
      </div>

      {/* Admin Login Form */}
      <div className="w-full max-w-mobile">
        <div className="glass-card rounded-3xl p-8 animate-slide-up border-2 border-brand-orange/20">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onBackToLogin}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <Shield className="text-brand-orange" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-brand-orange">Admin Portal</h1>
                <p className="text-gray-300 text-sm">Secure access for administrators</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demo Credentials */}
            <div className="p-4 bg-brand-orange/10 rounded-2xl border border-brand-orange/20">
              <p className="text-xs text-brand-orange mb-2 font-medium">Demo Admin Credentials:</p>
              <div className="space-y-1 text-xs text-gray-300">
                <p>📧 admin@prototype.com</p>
                <p>🔑 admin123</p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all duration-300"
                  placeholder="Enter admin password"
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
              className="w-full bg-gradient-to-r from-brand-orange to-brand-green text-white py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-orange flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={20} />
                  <span>Admin Access</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
