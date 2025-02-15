import Wine from "../models/wine";
import { InferTypeOf } from "@medusajs/framework/types";

export type WineProduct = InferTypeOf<typeof Wine>;
