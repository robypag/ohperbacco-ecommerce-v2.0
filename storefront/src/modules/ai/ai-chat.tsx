"use client"

import React, { useState } from "react"
import { ChatCallout } from "./components/chat-callout"
import { ChatModal } from "./components/chat-modal"
import { StoreCustomer } from "@medusajs/types"

export type AiChatProps = {
  customer?: StoreCustomer
}

const AiChat = ({ customer }: AiChatProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ChatCallout
        isOpen={isOpen}
        isBouncing={false}
        onClick={() => setIsOpen(true)}
      />

      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        greeting={customer?.first_name ?? customer?.email}
      />
    </>
  )
}

export default AiChat
