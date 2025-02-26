import preselectionSchema from "../schemas/customer-order-schema"
import { tool as createTool } from "ai"
import { getCustomer } from "@lib/data/customer"
import { listOrders, listOrdersByIdsAndStatus } from "@lib/data/orders"
import { OrderStatus } from "@medusajs/types"

export const searchOrdersTool = createTool({
  description: "This tool searches orders for the current customer",
  parameters: preselectionSchema,
  execute: async ({ orderIds, status }) => {
    const customer = await getCustomer().catch(() => null)
    if (!customer) {
      throw new Error("Customer needs to be logged in")
    }

    const statuses: OrderStatus[] = status ?? []
    const customerOrders =
      orderIds && orderIds.length > 0
        ? await listOrdersByIdsAndStatus(orderIds, statuses)
        : await listOrders()
    console.info(customerOrders)
    return customerOrders.map((o) => ({
      id: o.id,
      externalId: o.display_id,
      status: o.status,
      orderDate: o.created_at,
      total: o.total,
      orderedItems: o.items?.map((i) => ({
        itemName: i.product_title,
        itemPrice: i.item_total,
      })),
    }))
  },
})
