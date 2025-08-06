import { supabase } from "@/lib/supabaseClient"
import { useState } from "react"

export default function LoginPage({ onSwitchToSignup, onSwitchToAdminLogin }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full mb-2 p-2 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full mb-2 p-2 text-black"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-green-500 px-4 py-2">Login</button>
      </form>
      <button onClick={onSwitchToSignup} className="mt-2 underline">Sign up</button>
      <button onClick={onSwitchToAdminLogin} className="mt-2 underline">Admin Login</button>
    </div>
  )
}
