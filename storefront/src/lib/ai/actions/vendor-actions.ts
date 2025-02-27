import Wine from "../database/models/wine.model"
import connectMongo from "../database"

export async function getDistinctVendors(): Promise<string[]> {
  await connectMongo()
  try {
    return await Wine.find().distinct("produttore").exec()
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : "Error reading distinct vendors from MongoDB"
    )
    return []
  }
}
