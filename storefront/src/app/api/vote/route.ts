import { getVotesByChatId, voteMessage } from "@lib/ai/actions"
import { getCustomer } from "@lib/data/customer"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chatId = searchParams.get("chatId")

  if (!chatId) {
    return new Response("chatId is required", { status: 400 })
  }

  const isAuthenticated = await getCustomer().catch(() => false)
  if (!isAuthenticated) {
    return new Response("Unauthorized", { status: 401 })
  }

  const votes = await getVotesByChatId({ id: chatId })
  return Response.json(votes, { status: 200 })
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json()

  if (!chatId || !messageId || !type) {
    return new Response("messageId and type are required", { status: 400 })
  }

  const isAuthenticated = await getCustomer().catch(() => false)
  if (!isAuthenticated) {
    return new Response("Unauthorized", { status: 401 })
  }

  await voteMessage({
    chatId,
    messageId,
    type: type,
  })

  return Response.json({ message: "Vote successful" }, { status: 200 })
}
