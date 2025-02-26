"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { getAuthHeaders } from "./cookies"
import { OrderStatus } from "@medusajs/types"

export const retrieveOrder = cache(async function (id: string) {
  return sdk.store.order
    .retrieve(
      id,
      { fields: "*payment_collections.payments" },
      { next: { tags: ["order"] }, ...getAuthHeaders() }
    )
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
})

export const listOrders = cache(async function (
  limit: number = 10,
  offset: number = 0
) {
  return sdk.store.order
    .list({ limit, offset }, { next: { tags: ["order"] }, ...getAuthHeaders() })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
})

export const listOrdersByIdsAndStatus = cache(async function (
  ids: number[],
  status: OrderStatus[]
) {
  const orders = await sdk.store.order
    .list(
      { status: status },
      { next: { tags: ["order"] }, ...getAuthHeaders() }
    )
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))

  if (ids.length === 0) return orders
  return orders.filter((o) =>
    o.display_id ? ids.includes(o.display_id) : true
  )
})
