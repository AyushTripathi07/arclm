"use client"
import { useRouter } from "next/navigation"
import { Settings, Grid3X3, Plus, Search, FolderPlus, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotebookCard from "@/components/notebook-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNotebooks } from "@/lib/notebooks-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { notebooks, loading, error, addNotebook } = useNotebooks()

  const handleCreateNew = async () => {
    // Create a new blank notebook (title will be generated on the server)
    const newNotebook = await addNotebook({
      icon: "folder",
    })

    if (newNotebook) {
      router.push(`/notebook/${newNotebook.id}`)
    }
  }

  // Filter notebooks based on search query
  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[#1e1f23] text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-5 h-5 bg-[#1e1f23] rounded-full"></div>
          </motion.div>
          <h1 className="text-xl font-medium">ArcLM</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800">
            <Grid3X3 className="w-5 h-5" />
            <span className="sr-only">Apps</span>
          </Button>
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          ></motion.div>
        </div>
      </header>

      <main className="container mx-auto p-8 max-w-6xl">
        <motion.h1
          className="text-5xl font-bold mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to ArcLM
        </motion.h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCreateNew}
              className="bg-white hover:bg-gray-200 text-black rounded-full shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create new
            </Button>

            <div className="relative">
              <Input
                type="text"
                placeholder="Search notebooks..."
                className="w-full md:w-64 bg-gray-800 border-gray-700 rounded-full pl-10 focus-visible:ring-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-md rounded-r-none border border-gray-700 bg-gray-800 hover:bg-gray-700"
              >
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
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span className="sr-only">List view</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-md rounded-l-none border border-gray-700 border-l-0 bg-gray-800 hover:bg-gray-700"
              >
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
                <span className="sr-only">Grid view</span>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border border-gray-700 bg-gray-800 hover:bg-gray-700 rounded-md">
                  Most recent
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
                    className="w-4 h-4 ml-2"
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Most recent</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <Star className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  <span>Newest first</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  <span>Oldest first</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-gray-800 border border-gray-700 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
              All
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-gray-700">
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-gray-700">
              Favorites
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-md text-red-200">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-4 bg-red-900/50 border-red-700 hover:bg-red-800"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden border-0 bg-[#2a2b30] p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="w-12 h-12 rounded-md bg-[#3a3b40]" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mb-2 bg-[#3a3b40]" />
                    <Skeleton className="h-4 w-1/2 bg-[#3a3b40]" />
                  </div>
                ))}
              </div>
            ) : filteredNotebooks.length === 0 ? (
              <div className="text-center p-12 bg-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-gray-400">No notebooks found. Create a new one to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNotebooks.map((notebook, index) => (
                  <motion.div
                    key={notebook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <NotebookCard
                      id={notebook.id}
                      title={notebook.title}
                      icon={notebook.icon as "folder" | "plug"}
                      date={notebook.date}
                      sources={notebook.sources}
                      highlight={notebook.highlight}
                      onClick={() => router.push(`/notebook/${notebook.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden border-0 bg-[#2a2b30] p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="w-12 h-12 rounded-md bg-[#3a3b40]" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mb-2 bg-[#3a3b40]" />
                    <Skeleton className="h-4 w-1/2 bg-[#3a3b40]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNotebooks
                  .sort(
                    (a, b) =>
                      new Date(b.lastModified || b.date).getTime() - new Date(a.lastModified || a.date).getTime(),
                  )
                  .slice(0, 4)
                  .map((notebook, index) => (
                    <motion.div
                      key={notebook.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotebookCard
                        id={notebook.id}
                        title={notebook.title}
                        icon={notebook.icon as "folder" | "plug"}
                        date={notebook.date}
                        sources={notebook.sources}
                        highlight={notebook.highlight}
                        onClick={() => router.push(`/notebook/${notebook.id}`)}
                      />
                    </motion.div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden border-0 bg-[#2a2b30] p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="w-12 h-12 rounded-md bg-[#3a3b40]" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mb-2 bg-[#3a3b40]" />
                    <Skeleton className="h-4 w-1/2 bg-[#3a3b40]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNotebooks
                  .filter((n) => n.highlight)
                  .map((notebook, index) => (
                    <motion.div
                      key={notebook.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <NotebookCard
                        id={notebook.id}
                        title={notebook.title}
                        icon={notebook.icon as "folder" | "plug"}
                        date={notebook.date}
                        sources={notebook.sources}
                        highlight={notebook.highlight}
                        onClick={() => router.push(`/notebook/${notebook.id}`)}
                      />
                    </motion.div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
