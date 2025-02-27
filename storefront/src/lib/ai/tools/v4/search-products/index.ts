import searchProductsSchema from "../schemas/search-product-schema"
import { tool as createTool } from "ai"
import { generateEmbeddings, vectorSearch } from "../shared/vector-search"
import { searchMedusaByProductIds } from "../shared/search-medusa"

export const searchProductsTool = createTool({
  description: "Searches for wines in the marketplace database",
  parameters: searchProductsSchema,
  execute: async ({
    context,
    title,
    produttore,
    regione,
    type,
    vitigni,
    priceTag,
    tags,
  }) => {
    // * Log
    console.log(`Executing 'getProducts' tool with parameters:`, {
        title,
        produttore,
        regione,
        type,
        vitigni,
        priceTag,
        tags
    })
    // * Step 1: Use messages context to generate embeddings to apply a similarity search:
    const conversationEmbeddings = await generateEmbeddings(context)
    // * Step 2: Perform a vector based search on MongoDB:
    const winesFromSimilaritySearch = await vectorSearch({
      embeddings: conversationEmbeddings,
      max_results: 5,
      title,
      regioni: regione,
      types: type,
      produttori: produttore,
      vitigni: vitigni,
      priceTag: priceTag,
      tags: tags,
    })

    if (winesFromSimilaritySearch.length === 0) {
      return []
    } else {
      const productIdsFromSimilaritySearch = winesFromSimilaritySearch.map(
        (item: any) => item.relatedProductId
      )
      return await searchMedusaByProductIds(productIdsFromSimilaritySearch)
    }
  },
})
