import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import { WINE_MODULE } from "modules/wine-data";
import WineModuleService from "modules/wine-data/services/service";
import { WineProduct } from "modules/wine-data/types";

export type UpdateWineStepInput = {
    data: WineProduct;
    is_synced?: boolean;
};

export const updateWineStepId = "update-wine-step";
export const updateWineStep = createStep(
    updateWineStepId,
    async ({ data, is_synced }: UpdateWineStepInput, { container }) => {
        const wineService: WineModuleService = container.resolve(WINE_MODULE);
        const previousData = await wineService.retrieveWine(data.id);
        data.synced = is_synced ? "synced" : "not-synced";
        const updatedWine = await wineService.updateWines(data);
        return new StepResponse(updatedWine, previousData);
    },
    // * In compensation function, we revert the changes by updating the wine with the previous data
    async (previousData, { container }) => {
        const wineService: WineModuleService = container.resolve(WINE_MODULE);
        return wineService.updateWines(previousData);
    },
);
