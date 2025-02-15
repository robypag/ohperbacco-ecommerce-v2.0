import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { WineProduct } from "modules/wine-data/types";
import { IProductModuleService, ProductDTO } from "@medusajs/framework/types";
import { openAiGenerateDescription } from "lib/ai";
import { Modules } from "@medusajs/framework/utils";

export type UpsertMongoDbStepInput = {
    product: ProductDTO;
    wine: WineProduct;
};

export const updateProductDescriptionWithOpenAI = createStep(
    "update-product-description-with-openai",
    async ({ product, wine }: UpsertMongoDbStepInput, { container }) => {
        // Generate a description using OpenAI
        const generatedDescription = await openAiGenerateDescription(wine);
        // Update the product description
        const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
        const updatedProduct = await productService.updateProducts(product.id, { description: generatedDescription });
        return new StepResponse({ product: updatedProduct }, product);
    },
    async ({ id, description }, { container }) => {
        const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
        await productService.updateProducts(id, { description: description });
    },
);
