import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/agencies`, {
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
    console.error("Agencies fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward request to backend (public registration - no auth required)
    const response = await fetch(`${BACKEND_URL}/api/agencies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Agency creation error:", error)
    return NextResponse.json({ error: "Failed to create agency" }, { status: 500 })
  }
}

// Update agency (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 })
    }

    const body = await request.json()

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/agencies/${id}`, {
      method: "PUT",
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

    return NextResponse.json(data)
  } catch (error) {
    console.error("Agency update error:", error)
    return NextResponse.json({ error: "Failed to update agency" }, { status: 500 })
  }
}

// Delete agency (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 })
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/agencies/${id}`, {
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
    console.error("Agency deletion error:", error)
    return NextResponse.json({ error: "Failed to delete agency" }, { status: 500 })
  }
}
