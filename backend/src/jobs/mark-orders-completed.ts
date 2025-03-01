import { IFulfillmentModuleService, MedusaContainer } from "@medusajs/framework/types";
import { MedusaError, ModuleRegistrationName } from "@medusajs/framework/utils";
import { markOrderAsCompleteWorkflow } from "workflows/complete-order";

export default async function markOrdersCompletedJob(container: MedusaContainer) {
    const logger = container.resolve("logger");
    const fulfillmentService: IFulfillmentModuleService = container.resolve(ModuleRegistrationName.FULFILLMENT);
    const [fulfillments, _] = await fulfillmentService.listAndCountFulfillments({ delivered_at: { $ne: null } });
    for (let f of fulfillments) {
        try {
            await markOrderAsCompleteWorkflow(container).run({
                input: {
                    fulfillment_id: f.id,
                },
            });
        } catch (error: any) {
            logger.error(error instanceof MedusaError ? error.message : JSON.stringify(error));
            logger.error(`Failed to mark order ${f.id} as completed`);
        }
    }
    logger.info(`Job 'daily-order-completion' completed`);
}

export const config = {
    name: "daily-order-completion",
    schedule: "0 22 * * *", // Every day at 10 PM
};
