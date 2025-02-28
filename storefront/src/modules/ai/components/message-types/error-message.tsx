import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export const ErrorMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role="system"
    >
      <div className="flex gap-4 w-full rounded-xl bg-red-50 p-3">
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-red-200 bg-red-100 self-start">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1 text-sm">
            <h4 className="font-medium text-red-700">
              C&apos;è stato un errore
            </h4>
            <p className="text-red-600">
              Mi dispiace, non sono riuscito a elaborare la tua richiesta. Per
              favore riprova tra qualche istante.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
