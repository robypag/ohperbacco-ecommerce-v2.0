import { IconBacco } from "@modules/common/icons/bacco"

type ChatCalloutProps = {
  isOpen: boolean
  isBouncing: boolean
  onClick: () => void
}

export const ChatCallout = ({
  isOpen,
  isBouncing,
  onClick,
}: ChatCalloutProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed sm:bottom-6 bottom-4 sm:right-6 right-4
        w-14 h-14 rounded-full border border-crimson-60
        flex items-center justify-center shadow-lg z-50
        ${isBouncing ? "animate animate-bounce" : ""}
        ${
          isOpen
            ? "opacity-0 pointer-events-none scale-90"
            : "opacity-100 scale-100"
        }
      `}
      aria-label="Open chat"
    >
      <IconBacco className="w-8 h-8" />
    </button>
  )
}
