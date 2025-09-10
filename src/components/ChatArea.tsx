import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChatBubble } from "./ChatBubble"
import { ChatInput } from "./ChatInput"
import { Button } from "@/components/ui/button"
import { RefreshCw, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hi! I'm Sah.ai, your mental health companion. How are you feeling today?",
    isBot: true,
    timestamp: "2:30 PM"
  }
]

// API configuration
const API_BASE_URL = "http://localhost:8000"

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Convert messages to the format expected by the backend
  const formatConversationHistory = (messages: Message[]) => {
    return messages
      .filter(msg => msg.id !== "1") // Exclude the initial greeting
      .map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text,
        timestamp: new Date().toISOString()
      }))
  }

  // Call the FastAPI backend
  const callChatAPI = async (userMessage: string, conversationHistory: any[]) => {
    try {
      console.log('Calling API with:', { userMessage, conversationHistory })
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory,
          user_id: `user_${Date.now()}` // Simple user ID generation
        })
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response data:', data)
      return data.response
    } catch (error) {
      console.error('Error calling chat API:', error)
      
      // Fallback response if API fails
      return "I'm sorry, I'm having trouble connecting right now. Please check that the backend server is running on http://localhost:8000 and try again. If you're in crisis, please reach out to a mental health professional immediately."
    }
  }

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Add user message immediately
    setMessages(prev => [...prev, newMessage])
    setIsTyping(true)

    try {
      // Get conversation history (including the message we just added)
      const updatedMessages = [...messages, newMessage]
      const conversationHistory = formatConversationHistory(updatedMessages)
      
      // Call the API
      const botResponseText = await callChatAPI(text, conversationHistory)
      
      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting bot response:', error)
      
      // Add error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing technical difficulties. Please ensure the backend server is running and try again.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([initialMessages[0]])
  }

  return (
    <div className="flex flex-col h-full gradient-main">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 gradient-card border-b border-border flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">Mental Health Bot</h2>
          <p className="text-sm text-muted-foreground">Always here to listen and support</p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="hover:bg-secondary rounded-xl"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Chat messages */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: message.id === "1" ? 0.5 : index * 0.1 }}
            >
              <ChatBubble
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                isFirstMessage={message.id === "1" && message.isBot}
              />
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 mb-4 w-full justify-start"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chat-bot flex items-center justify-center shadow-[var(--shadow-soft)] border-2 border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="chat-bubble-bot">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Chat input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}