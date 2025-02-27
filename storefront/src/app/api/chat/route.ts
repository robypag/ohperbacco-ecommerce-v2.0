import { openai } from "@ai-sdk/openai"
import { streamText, appendResponseMessages } from "ai"
import { newConversationPrompt } from "@lib/ai/prompts"
import {
  searchProductsTool,
  searchProductsByVendorTool,
  searchOrdersTool,
} from "@lib/ai/tools/v4"
import {
  getAvailableWines,
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
  const wineList = await getAvailableWines()
  console.info(wineList)

  const systemPrompt = newConversationPrompt
    .replace("$storelist", vendorList.join(","))
    .replace("$upvotedMessages", upvotedMessages)
    .replace("$wineList", JSON.stringify(wineList))

  const result = streamText({
    model: openai(process.env.OPENAI_API_MODEL || "gpt-4o-mini"),
    messages,
    maxSteps: 5,
    maxTokens: 2000,
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
      getProducts: searchProductsTool,
      getProductsByVendor: searchProductsByVendorTool,
      getCustomerOrders: searchOrdersTool,
    },
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      console.info("Step Usage:", usage)
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  })
  return result.toDataStreamResponse()
}
