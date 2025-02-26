import Wine from "../models/wine";
import { InferTypeOf } from "@medusajs/framework/types";

export type WineProduct = InferTypeOf<typeof Wine>;

export enum WineSyncStatus {
    SYNCED = "synced",
    NOT_SYNCED = "not-synced",
}

export type SyncronizedWineList = {
    id: string;
    denominazione: string;
    vitigni: string;
    regione: string;
    produttore: string;
    synced: string;
    product: {
        id: string;
        title: string;
    };
};
