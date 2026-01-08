import { createContext, useContext, useCallback, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sendChatMessage } from '../services/aiService'

const ChatContext = createContext(null)

export const useChat = () => {
  const value = useContext(ChatContext)
  if (!value) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return value
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
    setError(null)
  }, [])

  const openChat = useCallback(() => {
    setIsOpen(true)
    setError(null)
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Build messages array for API (excluding IDs and timestamps)
      const apiMessages = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content
      }))

      const response = await sendChatMessage(apiMessages)

      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: Date.now()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError('Failed to send message. Please try again.')

      // Add error message to chat
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact support@modlift.us for help.",
        timestamp: Date.now(),
        isError: true
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      messages,
      isOpen,
      isLoading,
      error,
      toggleChat,
      openChat,
      closeChat,
      sendMessage,
      clearHistory
    }),
    [messages, isOpen, isLoading, error, toggleChat, openChat, closeChat, sendMessage, clearHistory]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
