import { useQueryGraphStep } from "@medusajs/core-flows";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";

export type RetrieveWineByIdStepInput = {
    wine_id: string;
};

export const retrieveWineById = createStep(
    "retrieve-wine-by-id",
    async ({ wine_id }: RetrieveWineByIdStepInput, { container }) => {
        const { data: wines } = useQueryGraphStep({
            entity: "wine",
            fields: ["*", "product.*"],
            filters: {
                id: wine_id,
            },
        });
        return new StepResponse(wines[0]);
    },
);
