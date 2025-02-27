import Wine, { IWine } from "../database/models/wine.model"
import connectMongo from "../database"

let cachedWines: IWine[] | null = null
let lastCacheTime: number = 0
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

export async function getAvailableWines(): Promise<IWine[]> {
  // Check if cache is valid
  if (cachedWines && Date.now() - lastCacheTime < CACHE_DURATION) {
    return cachedWines
  }

  // If cache is invalid or expired, fetch new data
  await connectMongo()
  try {
    const wines = await Wine.find().select({
      description_embedding: 0,
      caratteristiche: 0,
      description: 0,
    })

    // Update cache
    cachedWines = wines
    lastCacheTime = Date.now()

    return wines
  } catch (error) {
    return []
  }
}
