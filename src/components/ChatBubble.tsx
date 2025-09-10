// import { motion } from "framer-motion"
// import { Bot, User } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface ChatBubbleProps {
//   message: string
//   isBot: boolean
//   timestamp?: string
// }

// export function ChatBubble({ message, isBot, timestamp }: ChatBubbleProps) {
//   const bubbleVariants = {
//     initial: { 
//       opacity: 0, 
//       y: 20, 
//       scale: 0.95 
//     },
//     animate: { 
//       opacity: 1, 
//       y: 0, 
//       scale: 1,
//       transition: {
//         type: "spring" as const,
//         stiffness: 300,
//         damping: 25
//       }
//     }
//   }

//   return (
//     <motion.div
//       variants={bubbleVariants}
//       initial="initial"
//       animate="animate"
//       className={cn(
//         "flex items-start gap-3 mb-4",
//         isBot ? "justify-start" : "justify-end flex-row-reverse"
//       )}
//     >
//       {/* Avatar */}
//       <div className={cn(
//         "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-[var(--shadow-soft)]",
//         isBot ? "bg-muted" : "bg-primary"
//       )}>
//         {isBot ? (
//           <Bot className="h-4 w-4 text-muted-foreground" />
//         ) : (
//           <User className="h-4 w-4 text-primary-foreground" />
//         )}
//       </div>

//       {/* Message bubble */}
//       <div className={cn(
//         "max-w-xs lg:max-w-md",
//         isBot ? "animate-slide-in-left" : "animate-slide-in-right"
//       )}>
//         <div className={cn(
//           "p-3 rounded-2xl shadow-[var(--shadow-chat)] transition-all duration-200 hover:shadow-[var(--shadow-medium)]",
//           isBot 
//             ? "chat-bubble-bot rounded-bl-md" 
//             : "chat-bubble-user rounded-br-md"
//         )}>
//           <p className="text-sm leading-relaxed">{message}</p>
//         </div>
        
//         {timestamp && (
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className={cn(
//               "text-xs text-muted-foreground mt-1 px-1",
//               isBot ? "text-left" : "text-right"
//             )}
//           >
//             {timestamp}
//           </motion.p>
//         )}
//       </div>
//     </motion.div>
//   )
// }


import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { TypewriterText } from "./TypewriterText"

interface ChatBubbleProps {
  message: string
  isBot: boolean
  timestamp?: string
  isFirstMessage?: boolean
}

export function ChatBubble({ message, isBot, timestamp, isFirstMessage = false }: ChatBubbleProps) {
  const bubbleVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  }

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className={cn(
        "flex items-start gap-3 mb-4 w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {/* Bot Avatar (left side) */}
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-[var(--shadow-soft)] bg-chat-bot border-2 border-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}

      {/* Message bubble */}
      <div className={cn(
        "max-w-xs lg:max-w-md flex flex-col",
        isBot ? "items-start animate-slide-in-left" : "items-end animate-slide-in-right"
      )}>
        <div className={cn(
          "p-3 rounded-2xl shadow-[var(--shadow-chat)] transition-all duration-200 hover:shadow-[var(--shadow-medium)]",
          isBot
            ? "chat-bubble-bot rounded-bl-md"
            : "chat-bubble-user rounded-br-md"
        )}>
          {isFirstMessage && isBot ? (
            <TypewriterText
              text={message}
              speed={60}
              className="text-sm leading-relaxed"
            />
          ) : (
            <p className="text-sm leading-relaxed">{message}</p>
          )}
        </div>

        {timestamp && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-xs text-muted-foreground mt-1 px-1",
              isBot ? "text-left" : "text-right"
            )}
          >
            {timestamp}
          </motion.p>
        )}
      </div>

      {/* User Avatar (right side) */}
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-[var(--shadow-soft)] bg-chat-user border-2 border-white/20">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </motion.div>
  )
}
