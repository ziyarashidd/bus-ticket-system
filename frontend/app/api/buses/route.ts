import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://bus-ticket-system-2phn.onrender.com"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/buses${request.nextUrl.search}`, {
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
    console.error("Buses fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch buses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/buses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `auth_token=${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Bus creation error:", error)
    return NextResponse.json({ error: "Failed to create bus" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const busId = request.nextUrl.searchParams.get("id")

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/buses?id=${busId}`, {
      method: "DELETE",
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
    console.error("Bus deletion error:", error)
    return NextResponse.json({ error: "Failed to delete bus" }, { status: 500 })
  }
}

