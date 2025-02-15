import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { AdminCreateProduct, IProductModuleService } from "@medusajs/framework/types";
import { WineProduct } from "modules/wine-data/types";

export type UpdateProductMetadataStepInput = {
    product_id: string;
    wine_data: WineProduct;
};

export const updateProductMetadataStepId = "update-product-metadata-step";
export const updateProductMetadataStep = createStep(
    updateProductMetadataStepId,
    async ({ product_id, wine_data }: UpdateProductMetadataStepInput, { container, context }) => {
        const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);
        const productMetadata = {} as AdminCreateProduct["metadata"];
        Object.keys(wine_data).forEach((key) => {
            if (key !== "product_id") {
                productMetadata[key] = wine_data[key];
            }
        });
        const product = await productModuleService.updateProducts(
            product_id,
            {
                metadata: productMetadata,
            },
            context,
        );
        return new StepResponse(product, product.id);
    },
);
