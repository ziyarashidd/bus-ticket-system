import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.BACKEND_URL || "https://bus-ticket-system-2phn.onrender.com"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/auth/validate`, {
      method: "GET",
      headers: {
        "Cookie": `auth_token=${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Validation error:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}

