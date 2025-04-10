"use client"

import type React from "react"

import { MoreVertical, Star, Folder, Plug, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { useNotebooks } from "@/lib/notebooks-context"
import { useRouter } from "next/navigation"

interface NotebookCardProps {
  id: string
  title: string
  icon: "folder" | "plug"
  date: string
  sources: number
  highlight?: boolean
  onClick?: () => void
}

export default function NotebookCard({
  id,
  title,
  icon,
  date,
  sources,
  highlight = false,
  onClick,
}: NotebookCardProps) {
  const { updateNotebook, deleteNotebook } = useNotebooks()
  const router = useRouter()

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await updateNotebook({
      id,
      highlight: !highlight,
    })
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteNotebook(id)
  }

  return (
    <Card
      className={`rounded-lg overflow-hidden border-0 ${highlight ? "bg-[#1a2b1a]" : "bg-[#2a2b30]"} hover:bg-opacity-80 transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <motion.div
            className="w-12 h-12 rounded-md bg-[#3a3b40] flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {icon === "folder" ? (
              <Folder className="w-6 h-6 text-amber-400" />
            ) : (
              <Plug className="w-6 h-6 text-green-400" />
            )}
          </motion.div>
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-700">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer" onClick={toggleFavorite}>
                <Star className={`mr-2 h-4 w-4 ${highlight ? "fill-yellow-400 text-yellow-400" : ""}`} />
                <span>{highlight ? "Remove from favorites" : "Add to favorites"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/notebook/${id}`)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Open notebook</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-red-400" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-medium mb-1">{title}</h3>
        <div className="text-sm text-gray-400">
          {date} • {sources} {sources === 1 ? "source" : "sources"}
        </div>
      </CardContent>
    </Card>
  )
}
