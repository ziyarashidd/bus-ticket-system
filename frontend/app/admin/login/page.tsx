"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { setAuthToken } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"

const API_BASE_URL = '/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: "admin",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      // Store user data in localStorage (token is handled by httpOnly cookie)
      setAuthToken("", data.user)

      setLoading(false)
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Button variant="ghost" onClick={() => router.push("/")} className="absolute top-4 left-4 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Button>

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Admin Panel</CardTitle>
                <CardDescription>PrintYatri Management System</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Admin Username"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login as Admin"}
              </Button>

              <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-semibold mb-1">Empowering Change Every Day:</p>
                <p>Welcome, Admin! Ready to take charge and create something amazing today? 🚀</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
