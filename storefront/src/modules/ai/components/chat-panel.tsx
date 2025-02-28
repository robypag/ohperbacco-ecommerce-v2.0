"use client"

import { useState, useEffect } from "react"
import type { Attachment, Message } from "ai"
import { useChat } from "@ai-sdk/react"
import useSWR, { useSWRConfig } from "swr"
import { getModel, fetcher } from "@lib/util/ai"
import { useWindowSize } from "usehooks-ts"
import { useScrollToBottom } from "@lib/hooks/scroll-to-bottom"
import { Overview } from "../components/overview"
import { PreviewMessage, ThinkingMessage } from "./message-types/messages"
import { ErrorMessage } from "./message-types/error-message"
import { IVote } from "@lib/ai/database/models/vote.model"
import { MultimodalInput } from "./chat-input"
import { StoreCustomer } from "@medusajs/types"

export function ChatPanel({
  id,
  initialMessages,
  customer,
}: {
  id: string
  initialMessages: Array<Message>
  customer?: StoreCustomer
}) {
  const { mutate } = useSWRConfig()
  const modelId = getModel()
  const [hasError, setHasError] = useState(false)

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    data: streamingData,
  } = useChat({
    id: id,
    sendExtraMessageFields: true,
    body: { id, modelId: modelId, customerId: customer?.id },
    initialMessages,
    onFinish: () => {
      mutate("/api/history")
    },
    onError: (error) => {
      setHasError(true)
    },
  })

  const { width: windowWidth = 1920, height: windowHeight = 1090 } =
    useWindowSize()

  const { data: votes } = useSWR(`/api/vote?chatId=${id}`, fetcher)
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  return (
    <>
      <div className="flex flex-col min-w-0 bg-background">
        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 min-h-[500px] max-h-[500px]"
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
          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <ThinkingMessage />
            )}

          {hasError && <ErrorMessage />}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  )
}
