import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const query = req.scope.resolve("query");
    const { data: wines, metadata: { count, take, skip } = {} } = await query.graph({
        entity: "wine",
        fields: ["id", "denominazione", "produttore", "vitigni", "regione", "synced", "product.id", "product.title"],
        ...req.query,
    });
    res.json({
        wines,
        count,
        limit: take,
        offset: skip,
    });
};
