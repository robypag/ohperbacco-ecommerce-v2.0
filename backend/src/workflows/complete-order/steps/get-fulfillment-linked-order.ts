import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export type GetLinkedOrderStep = {
    fulfillmentId: string;
};

export const getLinkedOrderStep = createStep(
    "get-fulfillment-linked-order-step",
    async function (data: GetLinkedOrderStep, { container }) {
        const { fulfillmentId } = data;
        const query = container.resolve("query");
        const { data: fulfillmentData } = await query.graph({
            entity: "fulfillment",
            filters: {
                id: [fulfillmentId],
            },
            fields: ["id", "order.*"],
        });
        const order = fulfillmentData[0].order;
        return new StepResponse({
            order: order,
        });
    },
);
