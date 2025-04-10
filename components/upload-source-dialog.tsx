"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, LinkIcon, Globe, Youtube, FileText, Copy, FileUp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

interface UploadSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSourceAdded?: () => void
}

export default function UploadSourceDialog({ open, onOpenChange, onSourceAdded }: UploadSourceDialogProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sourceLimit, setSourceLimit] = useState(0)

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
      console.log("Files dropped:", e.dataTransfer.files)
      // Simulate source added
      setSourceLimit(10)
      if (onSourceAdded) {
        setTimeout(() => {
          onSourceAdded()
          onOpenChange(false)
        }, 1000)
      }
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Files selected:", e.target.files)
      // Simulate source added
      setSourceLimit(10)
      if (onSourceAdded) {
        setTimeout(() => {
          onSourceAdded()
          onOpenChange(false)
        }, 1000)
      }
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate source added
    setSourceLimit(10)
    if (onSourceAdded) {
      setTimeout(() => {
        onSourceAdded()
        onOpenChange(false)
      }, 1000)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate source added
    setSourceLimit(10)
    if (onSourceAdded) {
      setTimeout(() => {
        onSourceAdded()
        onOpenChange(false)
      }, 1000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#1e1f23] text-white border-gray-800">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-[#1e1f23] rounded-full"></div>
            </div>
            <div>
              <DialogTitle className="text-xl">NotebookLM</DialogTitle>
              <DialogDescription className="text-gray-400">Add sources</DialogDescription>
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
        </DialogHeader>

        <div className="mt-4">
          <p className="text-gray-300 mb-2">
            Sources let NotebookLM base its responses on the information that matters most to you.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            (Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)
          </p>
        </div>

        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="upload" className="mt-0">
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
              <p className="text-gray-500 text-sm">Supported file types: PDF, txt, Markdown, Audio (e.g. mp3)</p>
            </div>
          </TabsContent>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-gray-700 mb-2"
                onClick={() => setActiveTab("drive")}
              >
                <FileUp className="w-5 h-5" />
                Google Drive
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600">
                  <FileText className="w-4 h-4 mr-1" />
                  Google Docs
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600">
                  <FileText className="w-4 h-4 mr-1" />
                  Google Slides
                </Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-gray-700 mb-2"
                onClick={() => setActiveTab("link")}
              >
                <LinkIcon className="w-5 h-5" />
                Link
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600">
                  <Youtube className="w-4 h-4 mr-1" />
                  YouTube
                </Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-gray-700 mb-2"
                onClick={() => setActiveTab("text")}
              >
                <FileText className="w-5 h-5" />
                Paste text
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copied text
              </Button>
            </div>
          </div>

          <TabsContent value="drive" className="mt-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Import from Google Drive</h3>
              <p className="text-gray-400 mb-4">Select files from your Google Drive to import as sources.</p>
              <Button className="bg-blue-600 hover:bg-blue-700">Connect Google Drive</Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Add a link</h3>
              <p className="text-gray-400 mb-4">Enter a URL to a website, YouTube video, or other online content.</p>
              <form onSubmit={handleUrlSubmit}>
                <Input placeholder="https://" className="bg-gray-700 border-gray-600 mb-4" />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Link
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Paste text</h3>
              <p className="text-gray-400 mb-4">Paste text content to add as a source.</p>
              <form onSubmit={handleTextSubmit}>
                <Textarea
                  placeholder="Paste your text here..."
                  className="bg-gray-700 border-gray-600 mb-4 min-h-[150px]"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Text
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 mt-4">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Source limit</span>
          <Progress value={sourceLimit} className="flex-1 h-2 bg-gray-700" />
          <span className="text-gray-400">{sourceLimit} / 50</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
