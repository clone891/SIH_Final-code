import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-4 gradient-card border-t border-border"
      style={{
        lineHeight: "63px"
      }}
    >
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={disabled}
            className="min-h-[44px] border-border rounded-2xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, rgb(240, 235, 255), rgb(230, 220, 250))",
              border: "1px solid rgba(120, 105, 150, 0.3)",
              color: "rgb(60, 45, 90)",
              fontWeight: "500"
            }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="h-11 w-11 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-200 hover:scale-105"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  )
}
