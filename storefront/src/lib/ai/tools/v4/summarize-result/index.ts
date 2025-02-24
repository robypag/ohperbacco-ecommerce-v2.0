import { tool as createTool, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import summarizeResultSchema from "../schemas/summarize-result-schema"

export const summarizeResultTool = createTool({
  description:
    "Summarizes the result of a search for wines in the marketplace database",
  parameters: summarizeResultSchema,
  execute: async ({ results }) => {
    const result = streamText({
      model: openai(process.env.OPENAI_API_MODEL || "gpt-4o-mini"),
      system:
        "You are an helpful assistant. Generate a summary of the search results, indicating how many results you have found and asking the user if he is satisfied",
      messages: [
        {
          role: "assistant",
          content: JSON.stringify(results),
        },
      ],
    })
    return result.toDataStreamResponse()
  },
})
