import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { markOrderAsCompleteWorkflow } from "workflows/complete-order";

export default async function deliveryCreatedHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
    console.log(`Delivery created with id ${data.id} - processing order`);
    await markOrderAsCompleteWorkflow(container).run({
        input: {
            fulfillment_id: data.id,
        },
    });
}

export const config: SubscriberConfig = {
    event: "delivery.created",
};
