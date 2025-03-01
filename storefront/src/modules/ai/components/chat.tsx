"use client"

import type { Attachment, Message } from "ai"
import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { getModel } from "@lib/util/ai"
import { useWindowSize } from "usehooks-ts"
import { useScrollToBottom } from "lib/hooks/scroll-to-bottom"

import { Overview } from "../components/overview"
import { PreviewMessage, ThinkingMessage } from "./message-types/messages"

import { IVote } from "@lib/ai/database/models/vote.model"
import { MultimodalInput } from "../components/chat-input"
import { toast } from "@medusajs/ui"

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string
  initialMessages: Array<Message>
  selectedModelId?: string
}) {
  const { mutate } = useSWRConfig()
  const modelId = getModel()
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
    body: { id, modelId: modelId },
    initialMessages,
    onFinish: () => {
      mutate("/api/history")
    },
  })

  const { width: windowWidth = 1920, height: windowHeight = 1090 } =
    useWindowSize()

  // const { data: votes } = useSWR(`/api/vote?chatId=${id}`, fetcher)
  const votes: Array<IVote> = []

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  return (
    <>
      <div className="flex flex-col min-w-0 min-h-36 bg-background">
        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
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
