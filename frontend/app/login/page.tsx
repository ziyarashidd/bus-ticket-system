"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { setAuthToken } from "@/lib/auth"

const API_BASE_URL = '/api'

export default function LoginPage() {
  const router = useRouter()
  const [agencyCode, setAgencyCode] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onLogin = async (role: "agency" | "conductor") => {
    setError("")
    setIsLoading(true)

    if (!agencyCode || !username || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agencyCode,
          username,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setIsLoading(false)
        return
      }

      // Store user data in localStorage (token is handled by httpOnly cookie)
      setAuthToken("", data.user)

      setIsLoading(false)
      if (role === "agency") {
        router.push("/agency/dashboard")
      } else {
        router.push("/conductor/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="w-full max-w-md mt-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Conductor / Agency Login</CardTitle>
            <CardDescription>Enter your credentials to access the ticketing system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="agency">Agency Code</Label>
              <Input
                id="agency"
                value={agencyCode}
                onChange={(e) => setAgencyCode(e.target.value)}
                placeholder="e.g. AY123"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john.doe"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pass">Password</Label>
              <Input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-2">
              <Button onClick={() => onLogin("conductor")} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Conductor"}
              </Button>
              <Button variant="secondary" onClick={() => onLogin("agency")} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Agency"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground pt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p>Conductors and Agencies use their respective credentials created in the admin panel.</p>
            </div>

            {/* Admin Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Are you an admin?</p>
              <Link href="/admin/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Admin Panel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
