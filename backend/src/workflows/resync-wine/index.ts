import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { upsertMongoDb } from "workflows/common-steps/sychronize-wine-to-mongo";
import { updateWineStep } from "workflows/update-wine/steps/update-wine-step";
import { useQueryGraphStep } from "@medusajs/core-flows";

export type ResyncWineWorkflowInput = {
    wine_id: string;
};

export const forceWineResyncWorkflow = createWorkflow("wine-force-resync", (input: ResyncWineWorkflowInput) => {
    // * Retrieve Wine Details:
    const { data: wines } = useQueryGraphStep({
        entity: "wine",
        fields: ["*", "product.*"],
        filters: {
            id: input.wine_id,
        },
    });
    const wine = transform(wines, (input) => input[0]);
    // * Synchronize the product with the external service:
    const result = upsertMongoDb({ product_id: wine.product.id, wine: wine });
    // * Mark the product as synced:
    when(result, (result) => result.is_synced === true).then(() =>
        updateWineStep({ data: result.wine, is_synced: result.is_synced }).config({ name: "update-wine-sync-status" }),
    );

    return new WorkflowResponse(wine);
});
