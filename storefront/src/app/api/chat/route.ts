import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { newConversationPrompt } from "@lib/ai/prompts"
import {
  searchProductsTool,
  searchProductsByVendorTool,
  searchOrdersTool,
} from "@lib/ai/tools/v4"
import { getDistinctVendors } from "@lib/ai/actions"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const vendorList = await getDistinctVendors()
  const systemPrompt = newConversationPrompt.replace(
    "$storelist",
    vendorList.join(",")
  )

  const result = streamText({
    model: openai(process.env.OPENAI_API_MODEL || "gpt-4o-mini"),
    messages,
    maxSteps: 5,
    maxTokens: 2000,
    onFinish({ usage }) {
      console.log("Total interaction usage", usage)
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
