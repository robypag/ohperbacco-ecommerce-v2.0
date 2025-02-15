import WineModule from "modules/wine-data";
import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(WineModule.linkable.wine, {
    linkable: ProductModule.linkable.product,
    isList: false,
});
