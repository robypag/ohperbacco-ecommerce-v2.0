import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { completeOrderWorkflow } from "@medusajs/core-flows";

export default async function completeDeliveredOrders(container: MedusaContainer) {
    const logger = container.resolve("logger");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const activityId = logger.activity("Looking for Orders paid and with fulfillment status delivered");
    const { data: deliveredOrders } = await query.graph({
        entity: "order",
        fields: ["id", "status", "payment_status", "fulfillment_status"],
        filters: {
            payment_status: ["captured"],
            fulfillment_status: ["delivered"],
        },
    });
    logger.progress(activityId, `Found ${deliveredOrders.length} orders, running completion workflow`);
    const orderIds = deliveredOrders.map((o) => o.id);
    const { result: completedOrders } = await completeOrderWorkflow(container).run({
        input: {
            orderIds: orderIds,
        },
    });
    logger.success(activityId, `Completed ${completedOrders.length} orders`);
}

export const config = {
    name: "check-delivered-orders-every-hour",
    schedule: "* * * * *",
};
