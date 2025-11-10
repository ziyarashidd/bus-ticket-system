import { type NextRequest, NextResponse } from "next/server"

// ✅ Backend base URL (Render or Local)
const BACKEND_URL =
  process.env.BACKEND_URL || "https://bus-ticket-system-2phn.onrender.com"

/**
 * ✅ GET — Fetch all conductors (optionally by agencyId)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Forward query string if present
    const response = await fetch(
      `${BACKEND_URL}/api/conductors${request.nextUrl.search}`,
      {
        method: "GET",
        headers: {
          Cookie: `auth_token=${token}`,
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Conductors fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch conductors" },
      { status: 500 }
    )
  }
}

/**
 * ✅ POST — Create a new conductor
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/conductors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Conductor creation error:", error)
    return NextResponse.json(
      { error: "Failed to create conductor" },
      { status: 500 }
    )
  }
}

/**
 * ✅ PUT — Update existing conductor
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id)
      return NextResponse.json(
        { error: "Missing conductor ID" },
        { status: 400 }
      )

    // ✅ Correct backend route
    const response = await fetch(`${BACKEND_URL}/api/conductors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${token}`,
      },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Conductor update error:", error)
    return NextResponse.json(
      { error: "Failed to update conductor" },
      { status: 500 }
    )
  }
}

/**
 * ✅ DELETE — Delete a conductor by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id)
      return NextResponse.json(
        { error: "Missing conductor ID" },
        { status: 400 }
      )

    const response = await fetch(`${BACKEND_URL}/api/conductors/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth_token=${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Conductor deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete conductor" },
      { status: 500 }
    )
  }
}
