import { NextRequest, NextResponse } from "next/server"
import { updateProject, deleteProject } from "@/lib/sheets"
import type { Project } from "@/lib/types/project"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json() as Partial<Omit<Project, "id">>
    const updated = await updateProject(params.id, body)
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error("PUT /api/projects/[id] error:", err)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ok = await deleteProject(params.id)
    if (!ok) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
