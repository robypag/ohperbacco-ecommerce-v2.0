import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import connectMongo from "/lib/extdb";
import Wine, { IWine } from "lib/extdb/models/wine.model";
import { WineProduct } from "modules/wine-data/types";
import { IProductModuleService, ProductDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export type UpsertMongoDbStepInput = {
    product: ProductDTO;
    wine: WineProduct;
};

const generateTags = (wine_data: WineProduct, product: ProductDTO): string[] => {
    const tags = new Set<string>();
    if (wine_data.denominazione) {
        const subtitle = wine_data.denominazione.toLowerCase();
        tags.add(subtitle);
        // Remove IGT/DOC/DOCG and add version without it
        const subtitleWithoutClassification = subtitle.replace(/(igt|doc|docg)$/i, "").trim();
        tags.add(subtitleWithoutClassification);
        // Split into individual words and add them
        const subtitleWords = subtitleWithoutClassification.split(/\s+/);
        subtitleWords.forEach((word: string) => {
            if (word.length > 2) {
                // Only add words longer than 2 characters
                tags.add(word);
            }
        });
    }
    if (wine_data.vitigni) {
        // Split by comma and process each variety
        const varieties = wine_data.vitigni.split(",");
        varieties.forEach((variety: string) => {
            // Remove percentage and trim
            const cleanVariety = variety.replace(/\d+%/, "").trim().toLowerCase();
            // Add full variety name
            tags.add(cleanVariety);
            // If variety contains multiple words, add individual words
            const varietyWords = cleanVariety.split(/\s+/);
            if (varietyWords.length > 1) {
                varietyWords.forEach((word) => {
                    if (word.length > 2) {
                        // Only add words longer than 2 characters
                        tags.add(word);
                    }
                });
            }
        });
    }
    return Array.from(tags);
};

export const upsertMongoDb = createStep(
    "upsert-mongodb",
    async ({ product, wine }: UpsertMongoDbStepInput, { context, container }) => {
        await connectMongo();
        const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
        const productData = await productService.retrieveProduct(product.id, { relations: ["type"] });
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
                tipologia_vino: productData.type.value,
                produttore: wine.produttore,
                tags: generateTags(wine, product),
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
