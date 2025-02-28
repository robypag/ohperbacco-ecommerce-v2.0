import { getProductsById } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { ProductPreviewType } from "types/global"

export const searchMedusaByProductIds = async (
  productIds: string[]
): Promise<ProductPreviewType[]> => {
  // * Search for products in Medusa:
  const currentRegion = await listRegions().then((regions) =>
    regions.find((r) => r.countries?.find((c) => c.iso_2 === "it"))
  )

  const products = await getProductsById({
    ids: productIds,
    regionId: currentRegion?.id || "reg_01JM58JFXGEZTRRRHZ6RTM1TFZ",
  })

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    description: p.description,
    isFeatured: false,
    availability:
      p.variants?.reduce(
        (acc, variant) => acc + (variant.inventory_quantity || 0),
        0
      ) || 0,
    // @ts-ignore
    produttore: p.wine?.produttore || "",
  }))
}
