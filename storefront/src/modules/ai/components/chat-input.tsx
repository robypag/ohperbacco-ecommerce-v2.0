"use client"

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai"
import { clx } from "@medusajs/ui"
import { motion } from "framer-motion"
import type React from "react"
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
} from "react"
import { toast } from "@medusajs/ui"
import { useLocalStorage, useWindowSize } from "usehooks-ts"

import { sanitizeUIMessages } from "../../../lib/util/ai"

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "../../common/icons/others"
import { PreviewAttachment } from "./message-types/preview-attachments"
import { Button } from "@medusajs/ui"
import { Textarea } from "@medusajs/ui"

const suggestedActions: Array<{
  title?: string
  label?: string
  action?: string
}> = [
  /*
  {
    title: "What is the weather",
    label: "in San Francisco?",
    action: "What is the weather in San Francisco?",
  },
  {
    title: "Help me draft an essay",
    label: "about Silicon Valley",
    action: "Help me draft a short essay about Silicon Valley",
  },
  */
]

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage("input", "")

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ""
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    })

    setAttachments([])
    setLocalStorageInput("")

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [attachments, handleSubmit, setAttachments, setLocalStorageInput, width])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType,
        }
      }
      const { error } = await response.json()
      toast.error(error)
    } catch (error) {
      toast.error("Failed to upload file, please try again!")
    }
  }

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      /*
      setUploadQueue(files.map((file) => file.name))

      try {
        const uploadPromises = files.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments =
          uploadedAttachments.filter(
            (attachment) => attachment !== undefined
          )

        if (
          successfullyUploadedAttachments.length > 0
        ) {
          setAttachments((currentAttachments) => [
            ...currentAttachments,
            ...successfullyUploadedAttachments,
          ])
        }
      } catch (error) {
        console.error("Error uploading files!", error)
      } finally {
        setUploadQueue([])
      }
      */
    },
    [setAttachments]
  )

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 &&
        suggestedActions.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={`suggested-action-${suggestedAction.title}-${index}`}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <Button
                  variant="transparent"
                  onClick={async () => {
                    window.history.replaceState({}, "", `/ai/chats/${chatId}`)

                    append({
                      role: "user",
                      content: suggestedAction.action!,
                    })
                  }}
                  className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-muted-foreground">
                    {suggestedAction.label}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll items-end">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Scrivi come se chiedessi ad un amico..."
        value={input}
        onChange={handleInput}
        className={clx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-sm bg-muted p-3",
          className
        )}
        rows={2}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            if (isLoading) {
              toast.error("Bacco sta elaborando la tua richiesta, attendi!")
            } else {
              submitForm()
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault()
            stop()
            setMessages((messages) => sanitizeUIMessages(messages))
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault()
            submitForm()
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      {/*<Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault()
          fileInputRef.current?.click()
        }}
        variant="transparent"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>
      */}
    </div>
  )
}
