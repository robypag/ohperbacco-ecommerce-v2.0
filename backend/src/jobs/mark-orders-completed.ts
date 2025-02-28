import { IFulfillmentModuleService, MedusaContainer } from "@medusajs/framework/types";
import { ModuleRegistrationName } from "@medusajs/framework/utils";
import { markOrderAsCompleteWorkflow } from "workflows/complete-order";

export default async function markOrdersCompletedJob(container: MedusaContainer) {
    const logger = container.resolve("logger");
    const activityId = logger.activity(`Marking delivered orders as completed`);
    const fulfillmentService: IFulfillmentModuleService = container.resolve(ModuleRegistrationName.FULFILLMENT);
    const [fulfillments, count] = await fulfillmentService.listAndCountFulfillments({ delivered_at: { $ne: null } });
    logger.progress(activityId, `Found ${count} fulfillments delivered`);
    for (let f of fulfillments) {
        try {
            await markOrderAsCompleteWorkflow(container).run({
                input: {
                    fulfillment_id: f.id,
                },
            });
            logger.progress(activityId, `Marked order ${f.id} as completed`);
        } catch (error) {
            logger.failure(activityId, `Failed to mark order ${f.id} as completed`);
        }
    }
    logger.success(activityId, `Successfully marked ${count} orders as completed`);
}

export const config = {
    name: "daily-order-completion",
    schedule: "0 22 * * *", // Every day at 10:00 PM
};
