"use client"

import React, { useState } from "react"
import { MessageCircle, Send, X } from "lucide-react";
import { Drawer, Container, Text, Input, Button } from "@medusajs/ui"
import Image from "next/image"
import { IconBacco } from "@modules/common/icons/bacco"
import { Overview } from "./components/overview"
import { useScrollToBottom } from "@lib/hooks/scroll-to-bottom";

type AIMessage = {
  type: "user" | "system" | "tool" | "assistant"
  content: string
}

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([] as AIMessage[])
  const [input, setInput] = useState("")

  interface HandleSendEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSend = (e: HandleSendEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages([...messages, { type: "user", content: input }])
    // Here you would typically make an API call to your AI service
    // For demo purposes, we'll just echo the message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `You said: ${input}`,
        },
      ])
    }, 1000)
    setInput("")
  }

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>()

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed sm:bottom-6 bottom-4 sm:right-6 right-4
          w-14 h-14 rounded-full
          bg-ui-bg-interactive text-ui-fg-on-color
          flex items-center justify-center shadow-lg
          hover:bg-ui-bg-interactive-hover transition-all z-50
          ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}
        `}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      <div className={`
        fixed sm:bottom-6 sm:right-6
        bottom-0 right-0
        sm:w-[496px] w-full
        sm:rounded-lg rounded-t-lg
        bg-ui-bg-base shadow-xl z-50
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        <Container className="sm:h-[calc(50vh)] h-[80vh] flex flex-col sm:rounded-lg rounded-t-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-ui-border-base flex justify-between items-center bg-ui-bg-base">
          <div className="flex items-center gap-2">
              <IconBacco className="w-8 h-8" />
              <Text className="text-ui-fg-base font-semibold">Chiedi a Bacco</Text>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-scroll p-4 space-y-4 bg-ui-bg-base" ref={messagesContainerRef}>
          {messages.length === 0 && <Overview />}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 text-xs ${
                    message.type === 'user'
                      ? 'bg-ui-bg-interactive text-ui-fg-on-color'
                      : 'bg-ui-bg-subtle text-ui-fg-base'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="border-t border-ui-border-base p-4 bg-ui-bg-base">
          <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 h-10 max-h-32 rounded-md border border-ui-border-base px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ui-border-interactive"
                rows={1}
                style={{
                  overflow: 'hidden',
                  height: 'auto',
                  minHeight: '40px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!input.trim()}
                className="p-2 h-10 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </>
  )
}

export default AiChat
