"use client"

import type { Message } from "ai"
import { clx } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, User, Loader2 } from "lucide-react"
import { MemoizedReactMarkdown } from "@modules/common/components/markdown"
import { PreviewAttachment } from "./preview-attachments"
import { MessageActions } from "./message-actions"
import { IVote } from "@lib/ai/database/models/vote.model"
import { IconBacco } from "@modules/common/icons/bacco"
import ProductList from "./product-list"
import Link from "next/link"
import { memo, useMemo, useState } from "react"
import equal from "fast-deep-equal"

export const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string
  message: Message
  vote: IVote | undefined
  isLoading: boolean
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={clx(
            "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl"
          )}
        >
          {message.role === "assistant" ? (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border self-start">
              <IconBacco className="w-6 h-6" />
            </div>
          ) : (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border self-end">
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {message.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state, args } = toolInvocation

                  if (state === "result") {
                    const { result } = toolInvocation
                    if (result && result.length > 0) {
                      return (
                        <div key={toolCallId} className="mt-1">
                          {/* Here we can add additional tool outputs */}
                          {toolName === "getProducts" && (
                            <ProductList items={result} />
                          )}
                        </div>
                      )
                    } else {
                      return (
                        <div key={toolCallId} className="mt-1">
                          {toolName === "getProducts" && (
                            <ProductList items={[]} />
                          )}
                        </div>
                      )
                    }
                  }
                  return (
                    <div key={toolCallId}>
                      {toolName === "getProducts" ? (
                        <ProductList />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Cerco le informazioni rilevanti...
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {message.content && (
              <div className="flex flex-col gap-4 text-sm">
                <MemoizedReactMarkdown
                  components={{
                    a: ({ node, children, ...props }) => {
                      return (
                        <Link
                          href={props.href as string}
                          className="text-crimson-60 font-semibold"
                        >
                          {children}
                        </Link>
                      )
                    },
                  }}
                >
                  {message.content as string}
                </MemoizedReactMarkdown>
              </div>
            )}

            {message.experimental_attachments && (
              <div className="flex flex-row gap-2">
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              vote={vote}
              isLoading={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (prevProps.message.reasoning !== nextProps.message.reasoning)
      return false
    if (prevProps.message.content !== nextProps.message.content) return false
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false
    if (!equal(prevProps.vote, nextProps.vote)) return false

    return true
  }
)

export const ThinkingMessage = () => {
  const role = "assistant"

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={clx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border self-start">
          <Sparkles size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground text-sm">
            Dammi solo un attimo...
          </div>
        </div>
      </div>
    </motion.div>
  )
}
