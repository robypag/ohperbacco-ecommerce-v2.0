import { defineMiddlewares } from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetWinesSchema = createFindParams();

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/wines",
            method: "GET",
        },
    ],
});
