import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://bus-ticket-system-2phn.onrender.com"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/agencies/pending`, {
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
    console.error("Pending agencies fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch pending agencies" }, { status: 500 })
  }
}
