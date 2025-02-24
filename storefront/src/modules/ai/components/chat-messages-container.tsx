import { Text } from "@medusajs/ui"
import { Overview } from "./overview"
import { PreviewMessage } from "./message-types/messages"

export type AIMessage = {
  type: "user" | "system" | "tool" | "assistant"
  content: string
}

type ChatMessagesProps = {
  messages: AIMessage[]
  messagesContainerRef: React.RefObject<HTMLDivElement>
}

export const ChatMessages = ({
  messages,
  messagesContainerRef,
}: ChatMessagesProps) => {
  return (
    <div
      className="flex-1 overflow-y-scroll p-4 space-y-4 bg-ui-bg-base"
      ref={messagesContainerRef}
    >
      {messages.length === 0 && <Overview />}
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={id}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote: IVote) => vote.messageId === message.id)
              : undefined
          }
        />
      ))}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs rounded-lg p-3 text-xs ${
              message.type === "user"
                ? "bg-ui-bg-interactive text-ui-fg-on-color"
                : "bg-ui-bg-subtle text-ui-fg-base"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )
}
