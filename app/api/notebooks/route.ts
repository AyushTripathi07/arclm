import { type NextRequest, NextResponse } from "next/server"
import { getNotebooks, createNotebook } from "@/lib/db"

// GET /api/notebooks - Get all notebooks
export async function GET() {
  try {
    const notebooks = await getNotebooks()
    return NextResponse.json(notebooks)
  } catch (error) {
    console.error("Error fetching notebooks:", error)
    return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 })
  }
}

// POST /api/notebooks - Create a new notebook
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newNotebook = await createNotebook(data)
    return NextResponse.json(newNotebook, { status: 201 })
  } catch (error) {
    console.error("Error creating notebook:", error)
    return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 })
  }
}
