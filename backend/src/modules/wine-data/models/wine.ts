import { model } from "@medusajs/framework/utils";

export const Wine = model.define("wine", {
    id: model.id({ prefix: "wi" }).primaryKey(),
    vitigni: model.text().index().nullable(),
    caratteristiche: model.text().nullable(),
    regione: model.text().index().nullable(),
    gradazione_alcolica: model.number().default(0),
    abbinamenti: model.text().nullable(),
    eventi: model.text().nullable(),
    affinamento: model.text().nullable(),
    colore: model.text().nullable(),
    profumo: model.text().nullable(),
    gusto: model.text().nullable(),
    vinificazione: model.text().nullable(),
    ecosostenibile: model.boolean().default(false).nullable(),
    denominazione: model.text().nullable(),
    temperatura_servizio: model.text().nullable(),
    bicchiere: model.text().nullable(),
});
