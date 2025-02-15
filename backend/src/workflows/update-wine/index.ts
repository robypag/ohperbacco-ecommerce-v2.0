import { createWorkflow, when, WorkflowResponse } from "@medusajs/workflows-sdk";
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
        const wine = when(input, (input) => input.additional_data !== undefined).then(() => {
            const wine = updateWineStep({ data: input.additional_data });
            // * Update product metadata using Wine informations to enable simplified search from Storefront:
            updateProductMetadataStep({ product_id: input.product.id, wine_data: wine });
            // * Synchronize the product with the external service:
            upsertMongoDb({ product: input.product, wine: wine });
            // * Update product description by leveraging OpenAI:
            updateProductDescriptionWithOpenAI({ product: input.product, wine: wine });
        });
        return new WorkflowResponse(wine);
    },
);
