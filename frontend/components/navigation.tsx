"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { getAuthUser, clearAuth } from "@/lib/auth"

export default function Navigation() {
  const router = useRouter()
  const user = getAuthUser()

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">PrintYatri</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} ({user.role})
          </span>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
