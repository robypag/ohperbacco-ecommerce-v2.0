import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import connectMongo from "/lib/extdb";
import Wine, { IWine } from "lib/extdb/models/wine.model";
import { WineProduct } from "modules/wine-data/types";
import { ProductDTO } from "@medusajs/framework/types";

export type UpsertMongoDbStepInput = {
    product: ProductDTO;
    wine: WineProduct;
};

export const upsertMongoDb = createStep(
    "upsert-mongodb",
    async ({ product, wine }: UpsertMongoDbStepInput, { context, container }) => {
        await connectMongo();
        try {
            const remoteWineData: IWine = {
                id: wine.id,
                abbinamenti: wine.abbinamenti,
                affinamento: wine.affinamento,
                caratteristiche: wine.caratteristiche,
                colore: wine.colore,
                denominazione: product.subtitle,
                eventi: wine.eventi,
                gradazione_alcolica: wine.gradazione_alcolica,
                gusto: wine.gusto,
                profumo: wine.profumo,
                regione: wine.regione,
                vitigni: wine.vitigni,
                vinificazione: wine.vinificazione,
                ecosostenibile: wine.ecosostenibile,
                relatedProductId: product.id,
                description: product.description,
            };
            // @ts-ignore
            const synchronizedWine = await Wine.findOneAndUpdate({ id: remoteWineData.id }, remoteWineData, {
                upsert: true,
                new: true,
            });
            return new StepResponse({
                synchronizedWine,
            });
        } catch (error) {
            console.error(error.message || error);
            throw error;
        }
    },
);
