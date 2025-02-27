import { Message } from "ai"
import { z } from "zod"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

// Product Preview in Chat
export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  created_at?: Date
  isFeatured?: boolean
  produttore?: string
  description?: string | null
}

// Chat Data:
export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
  numberOfMessages?: number
}

export type CantineDatabaseSearchParams = {
  query: string | null
  max_results: number
  wineType: ("rosso" | "bianco" | "rosato" | "spumante" | "any" | undefined)[]
  occasion: (string | undefined)[]
  food: (string | undefined)[]
  region: (string | undefined)[]
  priceTag?: "economico" | "abbordabile" | "costoso" | undefined
  denomination: (string | undefined)[]
  vitigno: (string | undefined)[]
  nome_vino: (string | undefined)[]
  produttore: (string | undefined)[]
  tags: (string | undefined)[]
}

export type SimpleSearchResultItem = {
  nome?: string
  description: string
  eventi: string
  abbinamenti: string
  tipologia_vino: string
}

export const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  role: z.string(),
  content: z.union([
    z.array(z.any()),
    z.object({}).passthrough(),
    z.string(),
    z.number(),
    z.boolean(),
  ]),
  createdAt: z.date(),
})

export type DBMessage = z.infer<typeof messageSchema>
