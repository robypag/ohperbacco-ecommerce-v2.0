import searchProductsSchema from "../schemas/search-product-schema"
import { tool as createTool } from "ai"
import { z } from "zod"

export const createChatContextTool = createTool({
  description:
    "Generates vector embeddings to simplify product search. It must be called after first assistant response, never as first tool",
  parameters: z.object({
    context: z
      .string()
      .describe("The context to be used for the next tool call"),
  }),
  execute: async ({ context }) => {
    console.log("Creating chat context with context:", context)
    return {}
  },
})
