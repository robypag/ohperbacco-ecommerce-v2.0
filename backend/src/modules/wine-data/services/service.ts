import { MedusaError, MedusaService } from "@medusajs/utils";
import { Wine } from "../models/wine";
import { Logger } from "@medusajs/medusa";

type InjectedDependencies = {
    logger: Logger;
};

class WineModuleService extends MedusaService({
    Wine,
}) {
    protected logger: Logger;
    constructor({ logger }: InjectedDependencies) {
        super(...arguments);
        this.logger = logger;
    }

    async retrieveByProductId(productId: string | string[]) {
        const id = Array.isArray(productId) ? productId : [productId];
        const wines = await this.listWines(
            { product_id: id },
            { relations: ["product"], select: ["*", "product.id", "product.description", "product.subtitle"] },
        );
        if (wines.length === 0) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Unable to find an existing wine linked to Product ${productId}`,
            );
        } else return wines[0] ?? {};
    }
}

export default WineModuleService;
