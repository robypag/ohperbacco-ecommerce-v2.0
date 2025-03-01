import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB_URI
const cached: {
  connection?: typeof mongoose
  promise?: Promise<typeof mongoose>
} = {}
async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    )
  }
  if (cached.connection) {
    return cached.connection
  }
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: process.env.MONGODB_DATABASE ?? "ohperbacco-winestore-data",
      bufferCommands: false,
      timeoutMS: 30000,
    }
    cached.promise = mongoose.connect(MONGO_URI, opts)
  }
  try {
    cached.connection = await cached.promise
  } catch (e) {
    cached.promise = undefined
    throw e
  }
  return cached.connection
}
export default connectMongo
