"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, LinkIcon, Globe, FileText, Copy, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

interface UploadSourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSourceAdded?: (formData?: FormData, fileName?: string) => void
}

type SourceType = "upload" | "drive" | "link" | "text" | "website" | "youtube" | "copied"

export default function UploadSourceModal({ open, onOpenChange, onSourceAdded }: UploadSourceModalProps) {
  const [activeView, setActiveView] = useState<SourceType>("upload")
  const [previousView, setPreviousView] = useState<SourceType | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState("")
  const [pastedText, setPastedText] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    // Handle file drop logic here
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      const formData = new FormData()
      formData.append("file", file)

      if (onSourceAdded) {
        onSourceAdded(formData, file.name)
        onOpenChange(false)
      }
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append("file", file)

    if (onSourceAdded) {
      onSourceAdded(formData, file.name)
      onOpenChange(false)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (url.trim()) {
      const formData = new FormData()
      formData.append("url", url.trim())

      if (onSourceAdded) {
        onSourceAdded(formData, "Website Content")
        onOpenChange(false)
      }
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (pastedText.trim()) {
      const formData = new FormData()
      formData.append("text", pastedText.trim())

      if (onSourceAdded) {
        onSourceAdded(formData, "Pasted Text")
        onOpenChange(false)
      }
    }
  }

  const navigateTo = (view: SourceType) => {
    setPreviousView(activeView)
    setActiveView(view)
  }

  const goBack = () => {
    if (previousView) {
      setActiveView(previousView)
      setPreviousView(null)
    }
  }

  const getDialogTitle = () => {
    if (activeView === "upload") return "Add sources"
    if (activeView === "website") return "Website URL"
    if (activeView === "text") return "Paste copied text"
    if (activeView === "link") return "Link"
    if (activeView === "copied") return "Copied text"
    return "Add sources"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#1e1f23] text-white border-gray-800 p-0">
        <DialogTitle className="sr-only">{getDialogTitle()}</DialogTitle>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-[#1e1f23] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-medium">ArcLM</h2>
              {activeView === "upload" && <p className="text-gray-400 text-sm">Add sources</p>}
              {activeView === "website" && <p className="text-gray-400 text-sm">Website URL</p>}
              {activeView === "text" && <p className="text-gray-400 text-sm">Paste copied text</p>}
              {activeView === "copied" && <p className="text-gray-400 text-sm">Copied text</p>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Upload View */}
        {activeView === "upload" && (
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Sources let ArcLM base its responses on the information that matters most to you.
              </p>
              <p className="text-gray-400 text-sm">
                (Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
                isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4"
              >
                <Upload className="w-6 h-6 text-blue-500" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2">Upload sources</h3>
              <p className="text-gray-400 text-center mb-4">
                Drag & drop or{" "}
                <button className="text-blue-500 hover:underline focus:outline-none" onClick={handleFileSelect}>
                  choose file
                </button>{" "}
                to upload
              </p>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
              <p className="text-gray-500 text-sm">Supported file types: PDF, TXT, Markdown</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="w-5 h-5" />
                  <span className="text-lg">Link</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm bg-gray-700 border-gray-600 hover:bg-gray-600 h-10"
                  onClick={() => navigateTo("website")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5" />
                  <span className="text-lg">Paste text</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm bg-gray-700 border-gray-600 hover:bg-gray-600 h-10"
                  onClick={() => navigateTo("copied")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copied text
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Website URL View */}
        {activeView === "website" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-gray-300">
              <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={goBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <span>Website URL</span>
            </div>

            <p className="text-gray-300 mb-6">Paste in a Web URL below to upload as a source in ArcLM.</p>

            <form onSubmit={handleUrlSubmit}>
              <div className="relative mb-6">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL*"
                  className="bg-gray-800 border-gray-700 pl-10 py-6"
                />
                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>

              <div className="text-sm text-gray-400 mb-6">
                <p className="mb-1">Notes</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Only the visible text on the website will be imported at this moment</li>
                  <li>Paid articles are not supported</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!url.trim()}>
                  Insert
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Paste Text View */}
        {(activeView === "text" || activeView === "copied") && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-gray-300">
              <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={goBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <span>Paste copied text</span>
            </div>

            <p className="text-gray-300 mb-6">Paste your copied text below to upload as a source in ArcLM</p>

            <form onSubmit={handleTextSubmit}>
              <Textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste text here*"
                className="bg-gray-800 border-gray-700 mb-6 min-h-[200px] w-full"
              />

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!pastedText.trim()}>
                  Insert
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
