import { Container, Text, Button } from "@medusajs/ui"
import { X, RotateCcw, Minimize } from "lucide-react"
import { IconBacco } from "@modules/common/icons/bacco"
import { ChatPanel } from "./chat-panel"
import { generateId } from "ai"
import { useState } from "react"

type ChatModalProps = {
  isOpen: boolean
  onClose: () => void
  greeting?: string
}

export const ChatModal = ({ isOpen, onClose, greeting }: ChatModalProps) => {
  const [chatKey, setChatKey] = useState(generateId())
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    setChatKey(generateId())
    setShowResetConfirm(false)
  }

  const cancelReset = () => {
    setShowResetConfirm(false)
  }

  return (
    <div
      className={`
        fixed sm:bottom-6 sm:right-6
        bottom-0 right-0
        sm:w-[496px] w-full
        sm:rounded-lg rounded-t-lg
        bg-ui-bg-base shadow-xl z-50
        transform transition-all duration-300 ease-in-out
        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <Container className="flex flex-col sm:rounded-lg rounded-t-lg">
        {/* Header */}
        <div className="px-4 py-3 border-b border-ui-border-base flex justify-between items-center bg-ui-bg-base">
          <div className="flex items-center gap-2">
            <IconBacco className="w-8 h-8" />
            <Text className="text-lg font-semibold">
              {greeting ? `👋🏻 ${greeting}!` : "Bentornato!"}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
              title="Reset chat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
            >
              <Minimize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showResetConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 sm:rounded-lg rounded-t-lg">
            <div className="bg-ui-bg-base p-6 rounded-lg shadow-lg max-w-[80%]">
              <Text className="text-lg font-semibold mb-4">
                Confermi di voler resettare la chat?
              </Text>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={cancelReset}>
                  Annulla
                </Button>
                <Button variant="primary" onClick={confirmReset}>
                  Conferma
                </Button>
              </div>
            </div>
          </div>
        )}

        <ChatPanel key={chatKey} id={chatKey} initialMessages={[]} />
      </Container>
    </div>
  )
}
