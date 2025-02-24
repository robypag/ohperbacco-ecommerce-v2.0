import { model, models, Schema } from "mongoose";

export interface IWine {
    id: string;
    vitigni: string;
    denominazione: string;
    caratteristiche: string;
    regione: string;
    gradazione_alcolica: number;
    vinificazione: string;
    affinamento: string;
    abbinamenti: string;
    eventi: string;
    colore: string;
    gusto: string;
    profumo: string;
    ecosostenibile: boolean;
    relatedProductId: string;
    description: string;
    tipologia_vino: string;
    produttore: string;
    tags: string[];
}

const WineSchema = new Schema<IWine>(
    {
        id: String,
        vitigni: String,
        denominazione: String,
        caratteristiche: String,
        regione: String,
        gradazione_alcolica: Number,
        vinificazione: String,
        affinamento: String,
        abbinamenti: String,
        eventi: String,
        colore: String,
        gusto: String,
        profumo: String,
        relatedProductId: String,
        description: String,
        tipologia_vino: String,
        produttore: String,
        tags: [String],
    },
    {
        toJSON: {
            versionKey: false,
            virtuals: false,
        },
        _id: false,
    },
);
const Wine = models.Wine || model("Wine", WineSchema);
export default Wine;
