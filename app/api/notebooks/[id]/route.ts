import { type NextRequest, NextResponse } from "next/server"
import { getNotebookById, updateNotebook, deleteNotebook } from "@/lib/db"

// GET /api/notebooks/:id - Get a specific notebook
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const notebook = await getNotebookById(params.id)

    if (!notebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 })
    }

    return NextResponse.json(notebook)
  } catch (error) {
    console.error("Error fetching notebook:", error)
    return NextResponse.json({ error: "Failed to fetch notebook" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const data = await request.json()
    const params = await context.params
    const notebookId = params.id // ✅ Access params from context

    const updatedNotebook = await updateNotebook(notebookId, data)

    if (!updatedNotebook) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 })
    }

    return NextResponse.json(updatedNotebook)
  } catch (err) {
    console.error("PUT /api/notebooks/[id] error:", err)
    return NextResponse.json({ error: "Failed to update notebook" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = await context.params
    const deleted = deleteNotebook(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Notebook not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/notebooks/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete notebook" }, { status: 500 })
  }
}