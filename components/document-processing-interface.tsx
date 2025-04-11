"use client"

import { useState, useEffect, useRef } from "react"
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
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export interface DocumentProcessingProps {
  documentName: string
  documentType?: string
  onProcessingComplete?: () => void
  onProcessingError?: (error: string) => void
  processingEndpoint?: string
  documentData?: FormData
  allowCancellation?: boolean
}

export default function DocumentProcessingInterface({
  documentName = "document.pdf",
  documentType = "PDF",
  onProcessingComplete,
  onProcessingError,
  processingEndpoint = "https://trivially-humble-anemone.ngrok-free.app/process-pdf",
  documentData,
  allowCancellation = true,
}: DocumentProcessingProps) {
  // State management
  const [processingMessages, setProcessingMessages] = useState<ProcessingMessage[]>([])
  const [isProcessingActive, setIsProcessingActive] = useState(false)
  const [isProcessingComplete, setIsProcessingComplete] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState<ProcessingStage | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)
  
  // Track which thinking sections are expanded
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({})

  // Refs for DOM manipulation
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Auto-scroll to the latest message
  // const scrollToLatestMessage = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(() => {
  //   scrollToLatestMessage()
  // }, [processingMessages])

  // Start processing when document data is provided
  useEffect(() => {
    if (documentData) {
      processDocument(documentData)
    }

    return () => {
      // Clean up by aborting any in-progress fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [documentData])

  // Update estimated time remaining
  useEffect(() => {
    if (isProcessingActive && processingStartTime && overallProgress > 0) {
      const elapsedTime = (Date.now() - processingStartTime) / 1000
      const estimatedTotal = elapsedTime / (overallProgress / 100)
      const remaining = Math.max(0, estimatedTotal - elapsedTime)
      setEstimatedTimeRemaining(Math.round(remaining))
    }
  }, [isProcessingActive, processingStartTime, overallProgress])

  // Process the document and handle streaming responses
  const processDocument = async (formData: FormData) => {
    setIsProcessingActive(true)
    setProcessingMessages([])
    setProcessingError(null)
    setCurrentStage(null)
    setOverallProgress(0)
    setProcessingStartTime(Date.now())
    setEstimatedTimeRemaining(null)
    setExpandedThinking({})

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = await fetch(processingEndpoint, {
        method: "POST",
        body: formData,
        signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let buffer = ""

      // Process the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // Split on double newlines (SSE protocol)
        const parts = buffer.split("\n\n")
        buffer = parts.pop() || ""

        for (const part of parts) {
          const clean = part.replace(/^data: /gm, "").trim()
          if (clean) {
            try {
              // Parse the incoming message
              const rawMessage = JSON.parse(clean)

              // Transform to our standardized format
              const processedMessage: ProcessingMessage = {
                category: mapMessageType(rawMessage.type),
                content: rawMessage.content,
                elapsedSeconds: rawMessage.elapsed_seconds,
                timestamp: Date.now(),
                stage: determineStage(rawMessage),
                progress: calculateProgress(rawMessage),
              }

              // Update the current stage if applicable
              if (processedMessage.stage) {
                setCurrentStage(processedMessage.stage)
              }

              // Update overall progress
              updateOverallProgress(processedMessage)

              // Add or update the message in state
              updateProcessingMessages(processedMessage)
            } catch (err) {
              console.error("Failed to parse message:", clean, err)
            }
          }
        }
      }

      // Processing completed successfully
      setIsProcessingComplete(true)
      setOverallProgress(100)

      // Add completion message
      const completionMessage: ProcessingMessage = {
        category: MessageCategory.COMPLETION,
        content: `${documentType} processing completed successfully.`,
        elapsedSeconds: Math.round((Date.now() - (processingStartTime || Date.now())) / 1000),
        timestamp: Date.now(),
        stage: ProcessingStage.COMPLETION,
      }

      setProcessingMessages((prev) => [...prev, completionMessage])

      // Notify parent component
      onProcessingComplete?.()
    } catch (err) {
      // Only set error if not aborted
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setProcessingError(errorMessage)

        // Add error message
        const errorObj: ProcessingMessage = {
          category: MessageCategory.ERROR,
          content: errorMessage,
          elapsedSeconds: Math.round((Date.now() - (processingStartTime || Date.now())) / 1000),
          timestamp: Date.now(),
        }

        setProcessingMessages((prev) => [...prev, errorObj])

        // Notify parent component
        onProcessingError?.(errorMessage)
      }
    } finally {
      setIsProcessingActive(false)
      abortControllerRef.current = null
    }
  }

  // Toggle thinking section visibility
  const toggleThinkingSection = (messageIndex: number) => {
    setExpandedThinking(prev => ({
      ...prev,
      [messageIndex]: !prev[messageIndex]
    }))
  }

  // Map raw message type to our standardized MessageCategory
  const mapMessageType = (type: string): MessageCategory => {
    switch (type) {
      case "status":
        return MessageCategory.STATUS
      case "progress":
        return MessageCategory.PROGRESS
      case "image_analysis":
        return MessageCategory.IMAGE_ANALYSIS
      case "summary":
      case "final_summary":  // Add this line
        return MessageCategory.SUMMARY
      case "error":
        return MessageCategory.ERROR
      case "completion":
        return MessageCategory.COMPLETION
      default:
        return MessageCategory.STATUS
    }
  }

  // Determine the processing stage from the message
  const determineStage = (message: any): ProcessingStage | undefined => {
    if (message.type === "final_summary") {
      return ProcessingStage.SUMMARIZATION
    }
    const content = message.content?.toLowerCase() || ""

    if (content.includes("extract")) return ProcessingStage.EXTRACTION
    if (content.includes("image analysis") || content.includes("processing images"))
      return ProcessingStage.IMAGE_PROCESSING
    if (content.includes("analysis")) return ProcessingStage.ANALYSIS
    if (content.includes("summary") || content.includes("summarization")) return ProcessingStage.SUMMARIZATION
    if (content.includes("complete") || content.includes("finished")) return ProcessingStage.COMPLETION

    return undefined
  }

  // Calculate progress percentage from the message
  const calculateProgress = (message: any): number | undefined => {
    // Extract progress from message if available
    if (message.progress !== undefined) return message.progress

    // Try to infer progress from content
    const content = message.content || ""
    const progressMatch = content.match(/(\d+)%/)
    if (progressMatch) return Number.parseInt(progressMatch[1], 10)

    return undefined
  }

  // Update overall progress based on current stage and message
  const updateOverallProgress = (message: ProcessingMessage) => {
    // Weight each stage differently in the overall progress
    const stageWeights = {
      [ProcessingStage.EXTRACTION]: 0.2,
      [ProcessingStage.IMAGE_PROCESSING]: 0.3,
      [ProcessingStage.ANALYSIS]: 0.2,
      [ProcessingStage.SUMMARIZATION]: 0.3,
      [ProcessingStage.COMPLETION]: 1.0,
    }

    if (message.stage === ProcessingStage.COMPLETION) {
      setOverallProgress(100)
      return
    }

    if (message.stage && message.progress) {
      // Calculate weighted progress for this stage
      const stageWeight = stageWeights[message.stage]
      const stageProgress = message.progress / 100

      // Determine base progress based on current stage
      let baseProgress = 0
      if (message.stage === ProcessingStage.EXTRACTION) baseProgress = 0
      else if (message.stage === ProcessingStage.IMAGE_PROCESSING) baseProgress = 20
      else if (message.stage === ProcessingStage.ANALYSIS) baseProgress = 50
      else if (message.stage === ProcessingStage.SUMMARIZATION) baseProgress = 70

      // Calculate new overall progress
      const newProgress = baseProgress + stageWeight * 100 * stageProgress
      setOverallProgress(Math.min(99, Math.round(newProgress))) // Cap at 99% until complete
    }
  }

  // Add or update processing messages in state
  const updateProcessingMessages = (message: ProcessingMessage) => {
    setProcessingMessages((prev) => {
      // For progress messages, update the existing one instead of adding a new one
      if (message.category === MessageCategory.PROGRESS && prev.length > 0) {
        const lastMsg = prev[prev.length - 1]
        if (lastMsg.category === MessageCategory.PROGRESS && lastMsg.stage === message.stage) {
          return [...prev.slice(0, -1), message]
        }
      }
      return [...prev, message]
    })
  }

  // Cancel the current processing operation
  const handleCancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()

      // Add cancellation message
      const cancellationMessage: ProcessingMessage = {
        category: MessageCategory.STATUS,
        content: "Processing cancelled by user.",
        elapsedSeconds: Math.round((Date.now() - (processingStartTime || Date.now())) / 1000),
        timestamp: Date.now(),
      }

      setProcessingMessages((prev) => [...prev, cancellationMessage])
      setIsProcessingActive(false)
    }
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
      isExpanded 
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
                        isCompleted ? "bg-green-500" : isActive ? "bg-blue-500 animate-pulse" : "bg-gray-600"
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
    if (processingMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
          <div className="animate-spin mb-4">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p>Initializing document processing...</p>
        </div>
      )
    }

    return processingMessages.map((message, index) => {
      const isFirstOfCategory = index === 0 || processingMessages[index - 1].category !== message.category
      const isFirstOfStage = message.stage && (index === 0 || processingMessages[index - 1].stage !== message.stage)
      
      // Process content to check for thinking section
      const { hasThinking, thinking, finalContent, isExpanded } = processThinkingContent(message.content, index)

      return (
        <motion.div
          key={`${message.category}-${index}-${message.elapsedSeconds}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 bg-gray-700/30 p-3 rounded border-l-2 border-gray-600 text-gray-300 text-xs overflow-auto max-h-96"
                          >
                            <div className="whitespace-pre-wrap font-mono">{thinking}</div>
                          </motion.div>
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
        </motion.div>
      )
    })
  }

  // Render the processing summary (shown when complete)
  const renderProcessingSummary = () => {
    if (!isProcessingComplete) return null

    const totalTime = processingStartTime ? Math.round((Date.now() - processingStartTime) / 1000) : 0

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.5 }}
        className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
      >
        <h4 className="text-sm font-medium text-gray-300 mb-2">Processing Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Total Time:</span>
            <span className="text-gray-200">{totalTime} seconds</span>
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
            <span className="text-gray-200">{processingMessages.length}</span>
          </div>
        </div>
      </motion.div>
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

          {allowCancellation && isProcessingActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelProcessing}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-gray-400">Overall Progress</span>
            <div className="flex items-center gap-2">
              {/* <span className="text-gray-300">{overallProgress}%</span> */}
              {estimatedTimeRemaining !== null && isProcessingActive && (
                <span className="text-gray-400">~{estimatedTimeRemaining}s remaining</span>
              )}
            </div>
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

          {processingError && !isProcessingActive && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-300">Error</span>
              </div>
              <div className="pl-10">
                <div className="bg-gray-800 rounded-lg p-3 text-sm text-red-400 max-w-[90%]">{processingError}</div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}