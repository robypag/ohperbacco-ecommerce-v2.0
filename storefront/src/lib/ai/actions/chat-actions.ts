"use server"

import { Message } from "ai"
import connectMongo from "../database"
import ChatModel, { IMongoChat } from "../database/models/chat.model"
import Vote from "../database/models/vote.model"

export async function saveChat({
  chatId,
  userId,
  messages,
}: {
  chatId: string
  userId: string
  messages: Message[]
}) {
  try {
    await connectMongo()
    const chatObject = await ChatModel.findById(chatId)
    if (!chatObject) {
      await ChatModel.create({
        _id: chatId,
        userId: userId,
        messages: messages,
      })
    } else {
      chatObject.messages = messages
      await ChatModel.updateOne({ _id: chatId }, chatObject)
    }
  } catch (error: any) {
    console.error(error.message || "Error saving Chat")
  }
}

export async function getUpvotedMessages(userId: string): Promise<string> {
  try {
    await connectMongo()
    // Read all user chats:
    const allChats = await ChatModel.find({ userId: userId })
    // Read all upvoted messages for these chats:
    const upvotedMessages = await Vote.find({
      chatId: { $in: allChats.map((chat) => chat._id) },
      isUpvoted: true,
    })
    const upvotedMessageIds = new Set(
      upvotedMessages.map((vote) => vote.messageId)
    )
    const allMessages = []
    for (let c of allChats) {
      const chatMessages = c.messages
        .filter((m: Message) => upvotedMessageIds.has(m.id))
        .map((m: Message) =>
          m.content
            .replace(/[\r\n\s]+/g, " ") // Replace line breaks and multiple spaces
            .replace(/[^\w\s.,!?-]/g, "") // Remove special characters except basic punctuation
            .trim()
        )
      allMessages.push(...chatMessages)
    }
    return allMessages.join("|")
  } catch (error: any) {
    console.error(error.message || "Error fetching upvoted messages")
    return ""
  }
}
