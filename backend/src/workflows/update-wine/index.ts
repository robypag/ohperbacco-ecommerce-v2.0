import { createWorkflow, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ProductDTO } from "@medusajs/framework/types";
import { upsertMongoDb } from "workflows/common-steps/sychronize-wine-to-mongo";
import { updateProductMetadataStep } from "../common-steps/update-product-metadata";
import { WineProduct } from "modules/wine-data/types";
import { updateWineStep } from "./steps/update-wine-step";
import { updateProductDescriptionWithOpenAI } from "./steps/update-product-description";

export type UpdateWineFromProductWorkflowInput = {
    product: ProductDTO;
    additional_data?: WineProduct;
};

export const updateWineFromProductWorkflow = createWorkflow(
    "update-wine-from-product",
    (input: UpdateWineFromProductWorkflowInput) => {
        // * Update Wine details:
        const result = when(
            input,
            (input) => input.additional_data && Object.keys(input.additional_data).length > 0,
        ).then(() => {
            let wine = updateWineStep({ data: input.additional_data, is_synced: false }).config({
                name: "update-wine-details",
            });
            // * Update product metadata using Wine informations to enable simplified search from Storefront:
            updateProductMetadataStep({ product_id: input.product.id, wine_data: wine });
            // * Update product description by leveraging OpenAI:
            const { product: updatedProduct } = updateProductDescriptionWithOpenAI({
                product: input.product,
                wine: wine,
            });
            // * Synchronize the product with the external service:
            return upsertMongoDb({ product_id: updatedProduct.id, wine: wine });
        });
        // * Mark the product as synced:
        when(result, (result) => result.is_synced === true).then(() =>
            updateWineStep({ data: result.wine, is_synced: result.is_synced }).config({
                name: "update-wine-sync-status",
            }),
        );
        return new WorkflowResponse(result.wine);
    },
);
