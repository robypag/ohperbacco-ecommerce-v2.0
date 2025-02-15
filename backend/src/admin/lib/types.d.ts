import { AdminProduct, AdminUpdateProduct } from "@medusajs/types";
import { WineProduct } from "../../../modules/wine-data/types/index";

export type ProductWineData = {
    wine_data: WineProduct;
};

type ProductWineAdditionalData = {
    additional_data: Omit<WineProduct, "deleted_at" | "created_at" | "updated_at" | "raw_gradazione_alcolica">;
};

export type FetchAdminProductWithWineData = AdminProduct & ProductWineData;
export type UpdateAdminProductWithWineData = AdminUpdateProduct & ProductWineAdditionalData;
