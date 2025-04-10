"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  Share,
  Upload,
  Plus,
  Info,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Bot,
  FileText,
  BookOpen,
  Clock,
  Download,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotebookPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [studioOpen, setStudioOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("sources")

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
          <h1 className="text-xl font-medium">Untitled notebook</h1>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Apps</p>
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sources Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              className="w-80 border-r border-gray-800 flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <TabsList className="bg-gray-800 border border-gray-700 p-1">
                    <TabsTrigger value="sources" className="data-[state=active]:bg-gray-700">
                      Sources
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">
                      Chat
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-full hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Close sidebar</span>
                  </Button>
                </div>

                <TabsContent value="sources" className="flex-1 flex flex-col p-0 mt-0">
                  <div className="p-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      <Search className="w-4 h-4" />
                      Discover
                    </Button>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
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
                          Saved sources will appear here
                        </motion.p>
                        <motion.p
                          className="text-sm"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file
                          directly from Google Drive.
                        </motion.p>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 flex flex-col p-0 mt-0">
                  <div className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search chat history..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-gray-400 font-medium px-2">Today</p>
                      <div className="p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                        <p className="text-sm truncate">How does the model context protocol work?</p>
                      </div>
                      <div className="p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                        <p className="text-sm truncate">Explain the key concepts in this document</p>
                      </div>

                      <p className="text-xs text-gray-400 font-medium mt-4 px-2">Yesterday</p>
                      <div className="p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                        <p className="text-sm truncate">Summarize the main points from all sources</p>
                      </div>
                      <div className="p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                        <p className="text-sm truncate">What are the limitations of this approach?</p>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!sidebarOpen && (
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-full hover:bg-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center p-8">
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
                Upload documents, websites, or other sources to start exploring with NotebookLM
              </p>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-6">Upload a source</Button>
            </motion.div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800 rounded-full p-2 flex items-center">
              <input
                type="text"
                placeholder="Upload a source to get started"
                className="bg-transparent flex-1 outline-none px-4 text-gray-400"
                disabled
              />
              <span className="text-xs text-gray-500 mr-2">0 sources</span>
              <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 transition-colors" disabled>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Studio Sidebar */}
        <AnimatePresence initial={false}>
          {studioOpen && (
            <motion.div
              className="w-80 border-l border-gray-800 flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="font-medium">Studio</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStudioOpen(false)}
                  className="rounded-full hover:bg-gray-800"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span className="sr-only">Close studio</span>
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

                  <div className="bg-gray-800 text-xs p-3 rounded-md mb-4 border border-gray-700">
                    <p>Upload at least one source to generate.</p>
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
          )}
        </AnimatePresence>

        {!studioOpen && (
          <div className="p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStudioOpen(true)}
              className="rounded-full hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Open studio</span>
            </Button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-800">
        NotebookLM can be inaccurate; please double check its responses.
      </div>
    </div>
  )
}
