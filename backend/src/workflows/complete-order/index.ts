import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { completeOrderWorkflow } from "@medusajs/core-flows";
import { getLinkedOrderStep } from "./steps/get-fulfillment-linked-order";

export type CompleteOrderWorkflowInput = {
    fulfillment_id: string;
};

export const markOrderAsCompleteWorkflow = createWorkflow(
    "mark-order-as-complete",
    (input: CompleteOrderWorkflowInput) => {
        const { order } = getLinkedOrderStep({ fulfillmentId: input.fulfillment_id });
        const completedOrder = completeOrderWorkflow.runAsStep({
            input: {
                orderIds: [(order as any).id],
            },
        });
        return new WorkflowResponse(completedOrder);
    },
);
