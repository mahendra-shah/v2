"use client"

import { useState, useCallback, useRef } from "react"

/**
 * Custom hook for managing ChatBot responses
 * Uses a simple rule-based fallback since web-llm causes bundle issues
 */
export const useLLM = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isModelReady, setIsModelReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState({ progress: 0, text: "" })
  const [error, setError] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const contextRef = useRef("")

  /**
   * Initialize - just mark as ready immediately
   */
  const initializeModel = useCallback(async () => {
    setIsLoading(true)
    setLoadProgress({ progress: 50, text: "Initializing assistant..." })

    // Simulate brief loading for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    setLoadProgress({ progress: 100, text: "Ready!" })
    setIsModelReady(true)
    setIsLoading(false)
    return true
  }, [])

  /**
   * Generate a response using simple pattern matching
   * @param {Array} chatHistory - Array of { role, content } messages
   * @param {string} contextPrompt - The system context with user data
   * @param {function} onToken - Callback for streaming tokens
   */
  const generateResponse = useCallback(async (chatHistory, contextPrompt, onToken) => {
    setIsGenerating(true)
    setError(null)

    // Store context for reference
    contextRef.current = contextPrompt

    try {
      const userMessage = chatHistory[chatHistory.length - 1]?.content?.toLowerCase() || ""
      let response = ""

      // Parse context data
      const parseContextData = () => {
        const data = {
          totalHours: 0,
          totalDays: 0,
          projects: [],
          leaves: { total: 0, taken: 0, balance: 0 },
          activities: [],
        }

        try {
          // Extract hours worked
          const hoursMatch = contextPrompt.match(/Total Hours:\s*([\d.]+)/i)
          if (hoursMatch) data.totalHours = Number.parseFloat(hoursMatch[1])

          // Extract days
          const daysMatch = contextPrompt.match(/Days Worked:\s*(\d+)/i)
          if (daysMatch) data.totalDays = Number.parseInt(daysMatch[1])

          // Extract leave balance
          const leaveMatch = contextPrompt.match(/Leave Balance:\s*(\d+)/i)
          if (leaveMatch) data.leaves.balance = Number.parseInt(leaveMatch[1])

          // Extract projects
          const projectMatches = contextPrompt.match(/Project[s]?:\s*([^\n]+)/gi)
          if (projectMatches) {
            projectMatches.forEach((match) => {
              const projects = match.replace(/Project[s]?:\s*/i, "").split(",")
              data.projects.push(...projects.map((p) => p.trim()))
            })
          }
        } catch (e) {
          console.warn("Error parsing context:", e)
        }

        return data
      }

      const contextData = parseContextData()

      // Generate response based on user query
      if (userMessage.includes("hour") || userMessage.includes("time") || userMessage.includes("work")) {
        if (contextData.totalHours > 0) {
          response = `Based on your activity data, you've logged approximately ${contextData.totalHours.toFixed(1)} hours of work. ${contextData.totalDays > 0 ? `This spans across ${contextData.totalDays} working days.` : ""}`
        } else {
          response =
            "I can see your work activity data. To get specific hour counts, please make sure your daily activities are being logged in the Activity Tracker."
        }
      } else if (userMessage.includes("project")) {
        if (contextData.projects.length > 0) {
          response = `You're currently working on the following projects: ${contextData.projects.join(", ")}. Would you like more details about any specific project?`
        } else {
          response =
            "I don't see any specific project data in your records yet. You can add projects through the Activity Tracker form."
        }
      } else if (userMessage.includes("leave") || userMessage.includes("vacation") || userMessage.includes("off")) {
        response = `Regarding your leave status: You have ${contextData.leaves.balance} days of leave balance available. You can apply for leave through the Leave Application section in the navigation menu.`
      } else if (userMessage.includes("help") || userMessage.includes("what can")) {
        response =
          "I can help you with:\n\n• **Work Hours** - Ask about your logged work time\n• **Projects** - Information about your assigned projects\n• **Leave Balance** - Check your available leave days\n• **Activity Summary** - Overview of your recent activities\n\nJust ask me anything about your work data!"
      } else if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("hey")) {
        response =
          "Hello! I'm your AI assistant for the Daily Activity Tracker. How can I help you today? You can ask me about your work hours, projects, or leave balance."
      } else if (userMessage.includes("thank")) {
        response = "You're welcome! Feel free to ask if you have any other questions about your work data."
      } else {
        response =
          "I understand you're asking about your work data. I can help you with:\n\n• Work hours and time tracking\n• Project assignments\n• Leave balance and history\n• Activity summaries\n\nCould you please be more specific about what you'd like to know?"
      }

      // Simulate streaming for better UX
      let fullText = ""
      const words = response.split(" ")

      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30))
        fullText += (i > 0 ? " " : "") + words[i]
        if (onToken) {
          onToken(words[i], fullText)
        }
      }

      setIsGenerating(false)
      return response
    } catch (err) {
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate response")
      setIsGenerating(false)
      throw err
    }
  }, [])

  /**
   * Reset the chat context
   */
  const resetChat = useCallback(async () => {
    contextRef.current = ""
  }, [])

  return {
    initializeModel,
    generateResponse,
    resetChat,
    isLoading,
    isModelReady,
    loadProgress,
    error,
    isGenerating,
    isWebGPUSupported: true, // Always true for fallback mode
  }
}

export default useLLM
