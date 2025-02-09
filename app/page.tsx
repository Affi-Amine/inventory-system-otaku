"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="h-screen flex">
      {/* Left side - Sign in form */}
      <div className="w-[60%] flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-[#F8FAFC]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-500 font-medium text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-[#4F46E5] text-white py-2 px-4 rounded-md hover:bg-[#4338CA] transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="text-center">
            <div className="text-xl font-semibold">Welcome to Inventory System</div>
            <p className="text-gray-600">A professional dashboard to manage your inventory</p>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="w-[40%]">
        <div className="h-full relative">
          <Image
            src="/images/inventory.svg"
            alt="Inventory illustration"
            fill
            className="object-contain p-8"
            priority
          />
        </div>
      </div>
    </div>
  )
}

