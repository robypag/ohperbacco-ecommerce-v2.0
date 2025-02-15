import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ProductDTO } from "@medusajs/framework/types";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import createDefaultWineStep from "./steps/create-default-wine";
import { WINE_MODULE } from "modules/wine-data";

type CreateDefaultWineWorkflowInput = {
    product: ProductDTO;
};

const createDefaultWineWorkflow = createWorkflow("create-default-wine", (input: CreateDefaultWineWorkflowInput) => {
    const { id, subtitle } = input.product;
    const defaultWine = createDefaultWineStep({ productId: id, productSubtitle: subtitle });
    createRemoteLinkStep([
        {
            [WINE_MODULE]: {
                wine_id: defaultWine.id,
            },
            [Modules.PRODUCT]: {
                product_id: id,
            },
        },
    ]);
    return new WorkflowResponse({
        wine: {
            ...defaultWine,
        },
    });
});

export default createDefaultWineWorkflow;
