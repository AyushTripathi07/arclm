"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Settings,
  Share,
  BookOpen,
  Clock,
  Bot,
  Info,
  MoreVertical,
  Download,
  Trash2,
  RefreshCw,
  Pencil,
  Upload,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotebooks } from "@/lib/notebooks-context"
import { Input } from "@/components/ui/input"
import UploadSourceModal from "@/components/upload-source-modal"

export default function BentoLayout() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { notebooks, updateNotebook, loading } = useNotebooks()

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [notebook, setNotebook] = useState<any>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState("")
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  useEffect(() => {
    if (id && notebooks.length > 0) {
      const foundNotebook = notebooks.find((n) => n.id === id)
      if (foundNotebook) {
        setNotebook(foundNotebook)
        setTitle(foundNotebook.title)
      } else {
        router.push("/")
      }
    }
  }, [id, notebooks, router])

  const handleTitleChange = async () => {
    if (notebook && title.trim() !== notebook.title) {
      await updateNotebook({
        id: notebook.id,
        title: title.trim(),
      })
    }
    setIsEditingTitle(false)
  }

  const startEditingTitle = () => {
    setIsEditingTitle(true)
    setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 10)
  }

  const handleSourceAdded = () => {
    // Update notebook with new source
    if (notebook) {
      updateNotebook({
        id: notebook.id,
        sources: (notebook.sources || 0) + 1,
      })
    }
  }

  if (loading || !notebook) {
    return (
      <div className="min-h-screen bg-[#1e1f23] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1f23] text-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
          >
            <div className="w-5 h-5 bg-[#1e1f23] rounded-full"></div>
          </motion.div>
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleChange()
                }
              }}
              className="bg-gray-800 border-gray-700 h-8 text-xl font-medium w-64"
            />
          ) : (
            <h1 className="text-xl font-medium cursor-pointer hover:underline" onClick={startEditingTitle}>
              {notebook.title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800">
                  <Settings className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          ></motion.div>
        </div>
      </header>

      <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        {/* Left Sidebar Card */}
        <AnimatePresence initial={false}>
          {leftSidebarOpen ? (
            <motion.div
              className="w-20 bg-[#1a1b1f] rounded-xl overflow-hidden flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center p-4 gap-6">
                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-800 bg-gray-800">
                  <FileText className="w-5 h-5 text-blue-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-800"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-800">
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              <div className="mt-auto p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLeftSidebarOpen(false)}
                  className="rounded-lg hover:bg-gray-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(true)}
              className="h-10 w-10 rounded-lg hover:bg-gray-800 self-start"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </AnimatePresence>

        {/* Center Content Card */}
        <motion.div
          className="flex-1 bg-[#1a1b1f] rounded-xl overflow-hidden flex flex-col"
          layout
          transition={{ duration: 0.3 }}
        >
          <div className="border-b border-gray-800 p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-800 border border-gray-700 p-1">
                <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="sources" className="data-[state=active]:bg-gray-700">
                  Sources
                </TabsTrigger>
              </TabsList>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1 mt-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              {notebook.sources === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <motion.div
                    className="text-center max-w-md"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-medium mb-4">Add a source to get started</h2>
                    <p className="text-gray-400 mb-6">
                      Upload documents, websites, or other sources to start exploring with ArcLM
                    </p>
                    <Button
                      className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-6"
                      onClick={() => setUploadModalOpen(true)}
                    >
                      Upload a source
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400">{notebook.sources} source(s)</span>
                  </div>

                  <h1 className="text-3xl font-bold mb-4">{notebook.title}</h1>

                  <p className="text-gray-300 mb-6">
                    {notebook.content || "Start typing or add sources to begin working with your notebook."}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-gray-800 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Start typing..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-full pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                <div className="absolute right-2 top-2">
                  <span className="text-xs text-gray-500 mr-2">{notebook.sources} source(s)</span>
                  <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 h-8 w-8">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar Card */}
        <AnimatePresence initial={false}>
          {rightSidebarOpen ? (
            <motion.div
              className="w-80 bg-[#1a1b1f] rounded-xl overflow-hidden flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-b border-gray-800 p-4 flex items-center justify-between">
                <h2 className="font-medium">Studio</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRightSidebarOpen(false)}
                  className="rounded-full hover:bg-gray-800"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Audio Overview</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-gray-800">
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Generate audio summaries from your sources</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <motion.div
                    className="bg-gray-800 rounded-lg p-4 flex items-start gap-3 mt-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Deep Dive conversation</h4>
                      <p className="text-sm text-gray-400">Two hosts (English only)</p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      Customize
                    </Button>
                    <Button className="w-full bg-gray-700 hover:bg-gray-600">Generate</Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Notes</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-gray-800">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          <span>Export notes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Clear all notes</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mb-4 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add note
                  </Button>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      variant="outline"
                      className="text-xs h-auto py-2 flex items-center justify-center gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4" />
                      Study guide
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs h-auto py-2 flex items-center justify-center gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      <FileText className="w-4 h-4" />
                      Briefing doc
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="text-xs h-auto py-2 w-full flex items-center justify-center gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                  >
                    <Clock className="w-4 h-4" />
                    Timeline
                  </Button>

                  <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400 mt-8">
                    <div>
                      <motion.div
                        className="mx-auto mb-4 w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <FileText className="w-8 h-8" />
                      </motion.div>
                      <motion.p
                        className="font-medium mb-1"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Saved notes will appear here
                      </motion.p>
                      <motion.p
                        className="text-sm"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Save a chat message to create a new note, or click Add note above.
                      </motion.p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightSidebarOpen(true)}
              className="h-10 w-10 rounded-lg hover:bg-gray-800 self-start"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-gray-500 py-2">
        ArcLM can be inaccurate; please double check its responses.
      </div>

      {/* Upload Source Modal */}
      <UploadSourceModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} onSourceAdded={handleSourceAdded} />
    </div>
  )
}
