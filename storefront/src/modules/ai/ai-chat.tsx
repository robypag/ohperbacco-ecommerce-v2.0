"use client"

import React, { useState } from "react"
import { useScrollToBottom } from "@lib/hooks/scroll-to-bottom"
import { ChatCallout } from "./components/chat-callout"
import { ChatModal } from "./components/chat-modal"

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ChatCallout
        isOpen={isOpen}
        isBouncing={false}
        onClick={() => setIsOpen(true)}
      />

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default AiChat
