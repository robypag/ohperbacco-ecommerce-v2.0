import { updateProductsWorkflow } from "@medusajs/core-flows";
import { updateWineFromProductWorkflow, UpdateWineFromProductWorkflowInput } from "../update-wine";
import { Modules } from "@medusajs/framework/utils";

updateProductsWorkflow.hooks.productsUpdated(async ({ products, additional_data }, { container }) => {
    const updateWorkflow = updateWineFromProductWorkflow(container);
    for (let product of products) {
        const productService = container.resolve(Modules.PRODUCT);
        const productData = await productService.retrieveProduct(product.id);
        await updateWorkflow.run({
            input: {
                product: productData,
                additional_data,
            } as UpdateWineFromProductWorkflowInput,
        });
    }
});
