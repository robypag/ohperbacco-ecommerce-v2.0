import { openai } from "@ai-sdk/openai"
import {
  streamText,
  appendResponseMessages,
  smoothStream,
  createDataStreamResponse,
} from "ai"
import { newConversationPrompt } from "@lib/ai/prompts"
import {
  searchProductsTool,
  searchProductsByVendorTool,
  searchOrdersTool,
  getRelevantInformation,
} from "@lib/ai/tools/v4"
import {
  getDistinctVendors,
  getUpvotedMessages,
  saveChat,
} from "@lib/ai/actions"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { id, messages, customerId } = await req.json()

  const vendorList = await getDistinctVendors()
  const upvotedMessages = await getUpvotedMessages(customerId)

  const systemPrompt = newConversationPrompt
    .replace("$storelist", vendorList.join(","))
    .replace("$upvotedMessages", upvotedMessages)

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: openai(process.env.OPENAI_API_MODEL || "gpt-4o-mini"),
        messages,
        maxSteps: process.env.OPENAI_API_MAX_STEPS
          ? parseInt(process.env.OPENAI_API_MAX_STEPS)
          : 5,
        maxTokens: process.env.OPENAI_MAX_TOKENS
          ? parseInt(process.env.OPENAI_MAX_TOKENS)
          : 1500,
        experimental_transform: smoothStream({ chunking: "word" }),
        async onFinish({ response }) {
          await saveChat({
            chatId: id,
            userId: customerId,
            messages: appendResponseMessages({
              messages,
              responseMessages: response.messages,
            }),
          })
        },
        system: systemPrompt,
        tools: {
          getRelevantInfo: getRelevantInformation,
          getProducts: searchProductsTool,
          getProductsByVendor: searchProductsByVendorTool,
          getCustomerOrders: searchOrdersTool,
        },
        onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
          console.info("Step Usage:", usage)
          console.info("Tool Calls:", toolCalls)
        },
      })
      result.consumeStream()
      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      console.error(error)
      return "Oops, an error occured!"
    },
  })
}
