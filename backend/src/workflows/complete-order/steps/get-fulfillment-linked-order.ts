import { IFulfillmentModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export type GetLinkedOrderStep = {
    fulfillmentId: string;
};

export const getLinkedOrderStep = createStep(
    "get-fulfillment-linked-order-step",
    async function (data: GetLinkedOrderStep, { container }) {
        const { fulfillmentId } = data;
        const logger = container.resolve("logger");
        const fulfillmentService: IFulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
        const fulfillmentData = await fulfillmentService.retrieveFulfillment(fulfillmentId, { relations: ["order"] });
        logger.info(`Successfully retrieved linked order with ID ${(fulfillmentData as any).order.id}`);
        return new StepResponse({
            order: (fulfillmentData as any).order,
        });
    },
);
