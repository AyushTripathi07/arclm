"use client"

import { useState, useRef } from "react"
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ImageIcon,
  RefreshCw,
  FileDigit,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// Professional type definitions with clear naming
export enum ProcessingStage {
  EXTRACTION = "extraction",
  ANALYSIS = "analysis",
  IMAGE_PROCESSING = "image_processing",
  SUMMARIZATION = "summarization",
  COMPLETION = "completion",
}

export enum MessageCategory {
  STATUS = "status",
  PROGRESS = "progress",
  IMAGE_ANALYSIS = "image_analysis",
  SUMMARY = "summary",
  ERROR = "error",
  COMPLETION = "completion",
}

export interface ProcessingMessage {
  category: MessageCategory
  content: string
  elapsedSeconds: number
  timestamp?: number
  stage?: ProcessingStage
  progress?: number
}

export interface StaticDocumentProcessingProps {
  documentName: string
  documentType: string
  messages: ProcessingMessage[]
  overallProgress: number
  currentStage: ProcessingStage | null
  isProcessingComplete: boolean
  processingError: string | null
  processingStartTime: string | null
  totalProcessingTime: number
  notebookId?: string
}

export default function StaticDocumentProcessing({
  documentName,
  documentType,
  messages,
  overallProgress,
  currentStage,
  isProcessingComplete,
  processingError,
  processingStartTime,
  totalProcessingTime,
  notebookId,
}: StaticDocumentProcessingProps) {
  // Track which thinking sections are expanded
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({})

  // Refs for DOM manipulation
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Toggle thinking section visibility
  const toggleThinkingSection = (messageIndex: number) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [messageIndex]: !prev[messageIndex],
    }))
  }

  // Get the appropriate icon for each message category
  const getMessageIcon = (category: MessageCategory) => {
    switch (category) {
      case MessageCategory.STATUS:
        return <FileText className="w-5 h-5" />
      case MessageCategory.PROGRESS:
        return <Clock className="w-5 h-5" />
      case MessageCategory.IMAGE_ANALYSIS:
        return <ImageIcon className="w-5 h-5" />
      case MessageCategory.SUMMARY:
        return <BarChart3 className="w-5 h-5" />
      case MessageCategory.ERROR:
        return <AlertCircle className="w-5 h-5" />
      case MessageCategory.COMPLETION:
        return <CheckCircle className="w-5 h-5" />
      default:
        return <FileDigit className="w-5 h-5" />
    }
  }

  // Get the appropriate color scheme for each message category
  const getMessageColorScheme = (category: MessageCategory) => {
    switch (category) {
      case MessageCategory.STATUS:
        return "bg-blue-500/20 text-blue-500"
      case MessageCategory.PROGRESS:
        return "bg-purple-500/20 text-purple-500"
      case MessageCategory.IMAGE_ANALYSIS:
        return "bg-amber-500/20 text-amber-500"
      case MessageCategory.SUMMARY:
        return "bg-teal-500/20 text-teal-500"
      case MessageCategory.ERROR:
        return "bg-red-500/20 text-red-500"
      case MessageCategory.COMPLETION:
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  // Get a human-readable name for each message category
  const getMessageCategoryName = (category: MessageCategory) => {
    switch (category) {
      case MessageCategory.STATUS:
        return "Status Update"
      case MessageCategory.PROGRESS:
        return "Processing"
      case MessageCategory.IMAGE_ANALYSIS:
        return "Image Analysis"
      case MessageCategory.SUMMARY:
        return "Document Summary"
      case MessageCategory.ERROR:
        return "Error"
      case MessageCategory.COMPLETION:
        return "Process Complete"
      default:
        return "Information"
    }
  }

  // Get a human-readable name for each processing stage
  const getStageName = (stage: ProcessingStage) => {
    switch (stage) {
      case ProcessingStage.EXTRACTION:
        return "Text Extraction"
      case ProcessingStage.IMAGE_PROCESSING:
        return "Image Processing"
      case ProcessingStage.ANALYSIS:
        return "Content Analysis"
      case ProcessingStage.SUMMARIZATION:
        return "Summarization"
      case ProcessingStage.COMPLETION:
        return "Completion"
      default:
        return "Processing"
    }
  }

  // Process content to extract thinking section
  const processThinkingContent = (content: string, messageIndex: number) => {
    const thinkPattern = /<think>([\s\S]*?)<\/think>/
    const thinkMatch = content.match(thinkPattern)

    if (!thinkMatch) {
      return { hasThinking: false, thinking: "", finalContent: content }
    }

    const thinking = thinkMatch[1].trim()
    const finalContent = content.replace(thinkPattern, "").trim()

    const isExpanded = expandedThinking[messageIndex] || false

    return {
      hasThinking: true,
      thinking,
      finalContent,
      isExpanded,
    }
  }

  // Render the processing stages indicator
  const renderProcessingStages = () => {
    const stages = [
      ProcessingStage.EXTRACTION,
      ProcessingStage.IMAGE_PROCESSING,
      ProcessingStage.ANALYSIS,
      ProcessingStage.SUMMARIZATION,
      ProcessingStage.COMPLETION,
    ]

    return (
      <div className="flex items-center justify-between mb-4 px-2">
        {stages.map((stage, index) => {
          const isActive = currentStage === stage
          const isCompleted =
            (stage === ProcessingStage.EXTRACTION && overallProgress >= 20) ||
            (stage === ProcessingStage.IMAGE_PROCESSING && overallProgress >= 50) ||
            (stage === ProcessingStage.ANALYSIS && overallProgress >= 70) ||
            (stage === ProcessingStage.SUMMARIZATION && overallProgress >= 99) ||
            (stage === ProcessingStage.COMPLETION && isProcessingComplete)

          return (
            <TooltipProvider key={stage}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mb-1 transition-colors duration-300 ${
                        isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    />
                    {index < stages.length - 1 && (
                      <div className={`h-0.5 w-12 -mt-2 ${isCompleted ? "bg-green-500" : "bg-gray-600"}`} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>{getStageName(stage)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    )
  }

  // Render all processing messages
  const renderProcessingMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
          <div className="mb-4">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p>No processing messages available</p>
        </div>
      )
    }

    return messages.map((message, index) => {
      const isFirstOfCategory = index === 0 || messages[index - 1].category !== message.category
      const isFirstOfStage = message.stage && (index === 0 || messages[index - 1].stage !== message.stage)

      // Process content to check for thinking section
      const { hasThinking, thinking, finalContent, isExpanded } = processThinkingContent(message.content, index)

      return (
        <div
          key={`${message.category}-${index}-${message.elapsedSeconds}`}
          className={`${isFirstOfCategory || isFirstOfStage ? "mt-4" : "mt-2"}`}
        >
          {isFirstOfCategory && (
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getMessageColorScheme(message.category)}`}
              >
                {getMessageIcon(message.category)}
              </div>
              <span className="text-sm font-medium text-gray-300">{getMessageCategoryName(message.category)}</span>
            </div>
          )}

          {isFirstOfStage && message.stage && (
            <div className="pl-10 mb-2">
              <div className="text-xs font-medium text-gray-400">{getStageName(message.stage)}</div>
            </div>
          )}

          <div className="pl-10">
            <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-200 max-w-[90%]">
              <div className="flex justify-between items-start">
                {hasThinking ? (
                  <div className="w-full">
                    <div>{finalContent}</div>

                    {/* Thinking section toggle button */}
                    {hasThinking && (
                      <div className="mt-2 border-t border-gray-700 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleThinkingSection(index)}
                          className="text-xs flex items-center gap-1 text-gray-400 hover:text-gray-200 p-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide thinking process
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show thinking process
                            </>
                          )}
                        </Button>

                        {/* Collapsible thinking section */}
                        {isExpanded && (
                          <div className="mt-2 bg-gray-700/30 p-3 rounded border-l-2 border-gray-600 text-gray-300 text-xs overflow-auto max-h-96">
                            <div className="whitespace-pre-wrap font-mono">{thinking}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>{message.content}</div>
                )}
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{message.elapsedSeconds}s</span>
              </div>

              {message.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={message.progress} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })
  }

  // Render the processing summary (shown when complete)
  const renderProcessingSummary = () => {
    if (!isProcessingComplete) return null

    return (
      <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Processing Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Total Time:</span>
            <span className="text-gray-200">{totalProcessingTime} seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Document:</span>
            <span className="text-gray-200">{documentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Messages:</span>
            <span className="text-gray-200">{messages.length}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1b1f] rounded-lg overflow-hidden">
      {/* Header with document info and progress */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-white">{documentName}</h3>
              <p className="text-xs text-gray-400">{documentType} Processing</p>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-gray-400">Overall Progress</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Processing stages visualization */}
        {renderProcessingStages()}
      </div>

      {/* Main content area with messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col">
          <div className="flex items-start gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-gray-300" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-200">
              <p>
                Processing document: <span className="font-medium">{documentName}</span>
              </p>
            </div>
          </div>

          {renderProcessingMessages()}
          {renderProcessingSummary()}

          {processingError && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-300">Error</span>
              </div>
              <div className="pl-10">
                <div className="bg-gray-800 rounded-lg p-3 text-sm text-red-400 max-w-[90%]">{processingError}</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
