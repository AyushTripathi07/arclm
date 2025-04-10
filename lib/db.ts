import { prisma } from "@/lib/prisma"
import type { Notebook } from "@/lib/generated/prisma"

export async function getNotebooks(): Promise<Notebook[]> {
  return prisma.notebook.findMany({ orderBy: { lastModified: "desc" } })
}

export async function getNotebookById(id: string): Promise<Notebook | null> {
  return prisma.notebook.findUnique({ where: { id } })
}

export async function generateSequentialTitle(): Promise<string> {
  const untitled = await prisma.notebook.findMany({
    where: { title: { startsWith: "Untitled " } },
  })

  if (untitled.length === 0) return "Untitled 0"

  const numbers = untitled.map((n) => {
    const match = n.title.match(/Untitled (\d+)/)
    return match ? parseInt(match[1], 10) : -1
  })

  return `Untitled ${Math.max(...numbers) + 1}`
}

export async function createNotebook(data: Partial<Notebook>): Promise<Notebook> {
  const title = await generateSequentialTitle()

  return prisma.notebook.create({
    data: {
      title,
      icon: data.icon ?? "folder",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      sources: 0,
      highlight: false,
      content: "",
      lastModified: new Date(),
    },
  })
}

export async function updateNotebook(id: string, updates: Partial<Notebook>): Promise<Notebook | null> {
  try {
    return await prisma.notebook.update({
      where: { id },
      data: {
        ...updates,
        lastModified: new Date(),
      },
    })
  } catch {
    return null
  }
}

export async function deleteNotebook(id: string): Promise<boolean> {
  try {
    await prisma.notebook.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}