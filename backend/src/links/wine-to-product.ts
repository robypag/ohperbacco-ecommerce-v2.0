import WineModule from "modules/wine-data";
import ProductModule from "@medusajs/product";
import { defineLink } from "@medusajs/utils";

export default defineLink(WineModule.linkable.wine, {
    linkable: ProductModule.linkable.product,
    isList: false,
});
