import { tool as createTool } from "ai"
import { z } from "zod"
import { generateEmbeddings, similaritySearch } from "../shared/vector-search"
import { searchMedusaByProductIds } from "../shared/search-medusa"

export const getRelevantInformation = createTool({
  description: `Recupera informazioni utili alla generazione delle risposte. Must be called every time.`,
  parameters: z.object({
    question: z.string().describe("the user question"),
    intent: z
      .enum(["product-assistance", "order-assistance"])
      .describe("What the user needs assistance with"),
  }),
  execute: async ({ question, intent }) => {
    console.log(`Executing 'getRelevantInfo' tool with intent ${intent}`)
    if (intent === "product-assistance") {
      // * Step 1: Use messages context to generate embeddings to apply a similarity search:
      const conversationEmbeddings = await generateEmbeddings([question])
      // * Step 2: Perform a vector based search on MongoDB:
      const winesFromSimilaritySearch = await similaritySearch({
        embeddings: conversationEmbeddings,
      })
      const productIdsFromSimilaritySearch = winesFromSimilaritySearch.map(
        (item) => item.relatedProductId
      )
      // * Step 3: Return products
      const products = await searchMedusaByProductIds(
        productIdsFromSimilaritySearch
      )
      // * Step 4: Remap the URL:
      return products.map((product) => ({
        id: product.id,
        title: product.title,
        produttore: product.produttore,
        description: product.description,
        buyNowUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.handle}`,
      }))
    } else return {}
  },
})
