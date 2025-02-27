import preselectionSchema from "../schemas/wine-by-vendor-schema"
import { tool as createTool } from "ai"
import { searchByVendor } from "../shared/vector-search"
import { searchMedusaByProductIds } from "../shared/search-medusa"

export const searchProductsByVendorTool = createTool({
  description: "Get the list of wines sold by a given vendor name",
  parameters: preselectionSchema,
  execute: async ({ type, produttore }) => {
    console.log(`Executing 'getProductsByVendor' tool`)
    // * Do a simple search:
    const productIds = await searchByVendor({
      produttore: produttore,
      types: type,
    })
    return productIds !== null && productIds.length > 0
      ? await searchMedusaByProductIds(productIds)
      : null
  },
})
