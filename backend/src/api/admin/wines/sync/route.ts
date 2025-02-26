import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { forceWineResyncWorkflow } from "workflows/resync-wine";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const wineIds = Array.isArray(req.body) ? req.body : [req.body];
    console.info(wineIds);
    for (let wineId of wineIds) {
        await forceWineResyncWorkflow(req.scope).run({
            input: {
                wine_id: wineId,
            },
        });
    }
    res.json({ success: true });
};
