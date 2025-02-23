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
        if (!product.description || product.description.trim() === "") {
            const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
            const productData = await productService.retrieveProduct(product.id, { relations: ["categories"] });
            // Generate a description using OpenAI
            const generatedDescription = await openAiGenerateDescription(wine, productData);
            // Update the product description
            const updatedProduct = await productService.updateProducts(product.id, {
                description: generatedDescription,
            });
            return new StepResponse({ product: updatedProduct }, product);
        } else {
            return new StepResponse({ product }, product);
        }
    },
    async ({ id, description }, { container }) => {
        const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
        await productService.updateProducts(id, { description: description });
    },
);
