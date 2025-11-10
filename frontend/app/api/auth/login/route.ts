import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://bus-ticket-system-2phn.onrender.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agencyCode, username, password, role } = body

    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For admin role, agencyCode is not required
    if (role !== "admin" && !agencyCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agencyCode, username, password, role }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Set the token as an httpOnly cookie for security
    const nextResponse = NextResponse.json(data)

    if (data.token) {
      nextResponse.cookies.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })
    }

    return nextResponse
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

