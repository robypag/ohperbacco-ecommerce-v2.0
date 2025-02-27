import connectMongo from "../database"
import Vote from "../database/models/vote.model"

export async function getVotesByChatId({ id }: { id: string }) {
  await connectMongo()
  try {
    return await Vote.find({ chatId: id }).exec()
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : "Error reading Votes data from MongoDB"
    )
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string
  messageId: string
  type: "up" | "down"
}) {
  await connectMongo()
  try {
    const [existingVote] = await Vote.find({ messageId: messageId }).exec()

    if (existingVote) {
      return await Vote.findOneAndUpdate(
        { messageId: messageId, chatId: chatId },
        { isUpvoted: type === "up" },
        { new: true }
      )
    }

    const vote = new Vote({
      chatId,
      messageId,
      isUpvoted: type === "up",
    })

    return await vote.save()
  } catch (error) {
    console.error("Failed to upvote message in database", error)
    throw error
  }
}
