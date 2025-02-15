import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import WineModuleService from "modules/wine-data/services/service";
import { WINE_MODULE } from "modules/wine-data";

export type CreateDefaultWineStepInput = {
    productId: string;
    productSubtitle: string;
};

const createDefaultWineStep = createStep(
    "create-default-wine",
    async (data: CreateDefaultWineStepInput, { container }) => {
        const wineService: WineModuleService = container.resolve(WINE_MODULE);
        const defaultWine = await wineService.createWines({ denominazione: data.productSubtitle });
        return new StepResponse(defaultWine);
    },
    async ({ id }, { container }) => {
        const wineService: WineModuleService = container.resolve(WINE_MODULE);
        await wineService.deleteWines({ id: id });
    },
);

export default createDefaultWineStep;
