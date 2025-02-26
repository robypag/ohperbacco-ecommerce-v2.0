import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { completeOrderWorkflow, useQueryGraphStep } from "@medusajs/core-flows";

export type CompleteOrderWorkflowInput = {
    fulfillment_id: string;
};

export const markOrderAsCompleteWorkflow = createWorkflow(
    "mark-order-as-complete",
    (input: CompleteOrderWorkflowInput) => {
        const { data: fulfillmentList } = useQueryGraphStep({
            entity: "fulfillment",
            fields: ["order.*"],
            filters: {
                id: input.fulfillment_id,
            },
        });
        const fulfillment = transform(fulfillmentList, (list) => {
            return list.find((f) => f.id === input.fulfillment_id);
        });
        const completedOrder = completeOrderWorkflow.runAsStep({
            input: {
                orderIds: [fulfillment.order.id],
            },
        });
        return new WorkflowResponse(completedOrder);
    },
);
