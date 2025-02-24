"use client"

import type { Message } from "ai"
import { toast } from "@medusajs/ui"
import { useSWRConfig } from "swr"
import { useCopyToClipboard } from "usehooks-ts"
import { IVote } from "@lib/ai/database/models/vote.model"
import { getMessageIdFromAnnotations } from "@lib/util/ai"
import {
  CopyIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "modules/common/icons/others"
import { Button } from "@medusajs/ui"

export function MessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string
  message: Message
  vote: IVote | undefined
  isLoading: boolean
}) {
  const { mutate } = useSWRConfig()
  const [_, copyToClipboard] = useCopyToClipboard()

  if (isLoading) return null
  if (message.role === "user") return null
  if (message.toolInvocations && message.toolInvocations.length > 0) return null

  return (
    <div className="flex flex-row gap-2">
      <Button
        className="py-1 px-2 h-fit text-muted-foreground"
        variant="transparent"
        onClick={async () => {
          await copyToClipboard(message.content as string)
          toast.success("Copied to clipboard!")
        }}
      >
        <CopyIcon />
      </Button>

      <Button
        className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
        disabled={vote?.isUpvoted}
        variant="transparent"
        onClick={async () => {
          const messageId = getMessageIdFromAnnotations(message)
          try {
            await fetch("/api/vote", {
              method: "PATCH",
              body: JSON.stringify({
                chatId,
                messageId,
                type: "up",
              }),
            })
            toast.success("Upvoted!", {
              description: "Your vote has been recorded.",
              duration: 3000,
            })
          } catch (error: any) {
            toast.error("Error!", {
              description: "Your vote has not been recorded.",
              duration: 3000,
            })
          }
        }}
      >
        <ThumbUpIcon />
      </Button>

      <Button
        className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
        variant="transparent"
        disabled={vote && !vote.isUpvoted}
        onClick={async () => {
          const messageId = getMessageIdFromAnnotations(message)
          try {
            await fetch("/api/vote", {
              method: "PATCH",
              body: JSON.stringify({
                chatId,
                messageId,
                type: "down",
              }),
            })
            toast.success("Downvoted!", {
              description: "Your vote has been recorded.",
              duration: 3000,
            })
          } catch (error: any) {
            toast.error("Error!", {
              description: "Your vote has not been recorded.",
              duration: 3000,
            })
          }
        }}
      >
        <ThumbDownIcon />
      </Button>
    </div>
  )
}
