import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { WineProduct } from "modules/wine-data/types";
import { ProductDTO, ProductCategoryDTO } from "@medusajs/framework/types";

export const openAiGenerateDescription = async (wine_data: WineProduct, productData: ProductDTO) => {
    // Add Product Category and type to the payload:
    const composedProduct = {
        ...wine_data,
        categories: productData.categories.map((c) => ({ name: c.name, description: c.description })),
    };
    const { text } = await generateText({
        model: openai(process.env.OPENAI_API_MODEL || "gpt-4o-mini"),
        maxTokens: 1500,
        system: `Sei un sommelier professionista e la tua principale caratteristica è quella di generare delle perfette descrizioni per i vini, partendo da dati strutturati in formato JSON, come ad esempio
        {
           produttore: "Cantina del Sole",
           nome: "PROVINCIA DI PAVIA IGT – MOSCATO SECCO",
           denominazione: "Provincia di Pavia IGT",
           regione: "Toscana",
           vitigni: "100% Sangiovese",
           abbinamenti: "Pasta al ragù",
           eventi: "Cena romantica",
           affinamento: "12 mesi in botti di rovere",
           gradazione_alcolica: "14",
           temperatura_servizio: "18-20°C",
           bicchiere: "Calice ampio",
           caratteristiche: "Colore rosso rubino, profumo di frutti rossi, gusto secco e armonico",
           colore: "Rosso rubino",
           profumo: "Frutti rossi",
           gusto: "Secco e armonico",
           categories: [{
                name: "Vini Rosati",
                description: "I vini rosati uniscono freschezza e morbidezza, con aromi fruttati e floreali che li rendono perfetti per ogni occasione. Dal rosa tenue al corallo intenso, offrono un equilibrio raffinato tra acidità e struttura. Ideali con antipasti, pesce e piatti leggeri, regalano un sorso vivace e armonioso."
           },{
                name: "Vini Rosati Strutturati",
                description: "Più intensi e complessi, con buona persistenza e corpo, adatti anche a carni bianche e primi piatti saporiti. Esempi: Tavel, Negroamaro Rosato."
           }]
        }
        Le descrizioni che genererai saranno utilizzate sia per arricchire le schede prodotto dei vini, sia per abilitare una ricerca per similarità basata su testo.
        Utilizza anche le categorie del prodotto per generare descrizioni più dettagliate e specifiche.
        Non usare markdown o HTML, ma scrivi semplicemente il testo in linguaggio naturale. Non dare un titolo alla descrizione, ma inizia direttamente con la descrizione stessa.`,
        prompt: `Genera una descrizione per un vino con le seguenti caratteristiche: ${JSON.stringify(composedProduct)}`,
    });

    return text;
};
