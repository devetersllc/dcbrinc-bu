import { MongoClient, ServerApiVersion } from "mongodb"

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://ahmad:ahmadrazakhalid90@cluster0.b0esjap.mongodb.net/"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export async function connectToDatabase() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    return client.db("auth-app")
  } catch (error) {
    console.error("Failed to connect to MongoDB", error)
    throw error
  }
}
