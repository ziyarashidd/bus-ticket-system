"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getAuthUser } from "@/lib/auth"

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: "admin" | "agency" | "conductor"
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()

    if (!user) {
      router.push("/login")
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push("/")
      return
    }
  }, [router, requiredRole])

  return <>{children}</>
}
