"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Notebook } from "@/lib/generated/prisma"

type NotebooksContextType = {
  notebooks: Notebook[]
  loading: boolean
  error: string | null
  addNotebook: (notebook: Partial<Notebook>) => Promise<Notebook | null>
  updateNotebook: (notebook: Partial<Notebook>) => Promise<Notebook | null>
  deleteNotebook: (id: string) => Promise<boolean>
  refreshNotebooks: () => Promise<void>
}

const NotebooksContext = createContext<NotebooksContextType | undefined>(undefined)

export function NotebooksProvider({ children }: { children: ReactNode }) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notebooks from the API
  const fetchNotebooks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notebooks")

      if (!response.ok) {
        throw new Error("Failed to fetch notebooks")
      }

      const data = await response.json()
      setNotebooks(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching notebooks:", err)
      setError("Failed to load notebooks. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Initialize notebooks on component mount
  useEffect(() => {
    fetchNotebooks()
  }, [])

  // Add a new notebook
  const addNotebook = async (notebookData: Partial<Notebook>): Promise<Notebook | null> => {
    try {
      const response = await fetch("/api/notebooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notebookData),
      })

      if (!response.ok) {
        throw new Error("Failed to create notebook")
      }

      const newNotebook = await response.json()
      setNotebooks((prev) => [...prev, newNotebook])
      return newNotebook
    } catch (err) {
      console.error("Error creating notebook:", err)
      setError("Failed to create notebook. Please try again.")
      return null
    }
  }

  // Update a notebook
  const updateNotebook = async (notebook: Partial<Notebook>): Promise<Notebook | null> => {
    if (!notebook.id) {
      setError("Notebook ID is required for updates")
      return null
    }

    try {
      const response = await fetch(`/api/notebooks/${notebook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notebook),
      })

      if (!response.ok) {
        throw new Error("Failed to update notebook")
      }

      const updatedNotebook = await response.json()

      setNotebooks((prev) => prev.map((nb) => (nb.id === updatedNotebook.id ? updatedNotebook : nb)))

      return updatedNotebook
    } catch (err) {
      console.error("Error updating notebook:", err)
      setError("Failed to update notebook. Please try again.")
      return null
    }
  }

  // Delete a notebook
  const deleteNotebook = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/notebooks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notebook")
      }

      setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id))
      return true
    } catch (err) {
      console.error("Error deleting notebook:", err)
      setError("Failed to delete notebook. Please try again.")
      return false
    }
  }

  // Refresh notebooks
  const refreshNotebooks = async (): Promise<void> => {
    await fetchNotebooks()
  }

  return (
    <NotebooksContext.Provider
      value={{
        notebooks,
        loading,
        error,
        addNotebook,
        updateNotebook,
        deleteNotebook,
        refreshNotebooks,
      }}
    >
      {children}
    </NotebooksContext.Provider>
  )
}

export function useNotebooks() {
  const context = useContext(NotebooksContext)
  if (context === undefined) {
    throw new Error("useNotebooks must be used within a NotebooksProvider")
  }
  return context
}
