import * as z from "zod"

export default z.object({
  orderIds: z.array(z.number().describe("L'ID dell'ordine")).optional(),
  status: z.array(z.enum(["pending", "completed", "canceled"])).optional(),
})
