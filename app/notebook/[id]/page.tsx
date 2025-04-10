"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useNotebooks } from "@/lib/notebooks-context"

// Dynamically import the BentoLayout component to avoid SSR issues with animations
const BentoLayout = dynamic(() => import("./bento-layout"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#1e1f23] text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  ),
})

export default function NotebookPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { notebooks, loading } = useNotebooks()
  const [notebook, setNotebook] = useState<any>(null)

  useEffect(() => {
    if (id && notebooks.length > 0) {
      const foundNotebook = notebooks.find((n) => n.id === id)
      if (foundNotebook) {
        setNotebook(foundNotebook)
      } else {
        // Notebook not found, redirect to home
        router.push("/")
      }
    }
  }, [id, notebooks, router])

  if (loading || !notebook) {
    return (
      <div className="min-h-screen bg-[#1e1f23] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return <BentoLayout />
}
