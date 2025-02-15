import createDefaultWineWorkflow from "workflows/create-default-wine";
import { createProductsWorkflow } from "@medusajs/core-flows";
import { IProductModuleService, ProductDTO } from "@medusajs/types";
import { ModuleRegistrationName } from "@medusajs/utils";
import { UserDTO } from "@medusajs/framework/types";

createProductsWorkflow.hooks.productsCreated(async ({ products }, { container }) => {
    const productService: IProductModuleService = container.resolve(ModuleRegistrationName.PRODUCT);
    for (let product of products) {
        const productData: ProductDTO = await productService.retrieveProduct(product.id, {
            select: ["id", "title", "subtitle"],
        });
        try {
            // * Generate a default Wine entry for this product:
            await createDefaultWineWorkflow(container).run({ input: { product: productData } });
        } catch (error) {
            console.log(error);
        }
    }
});
