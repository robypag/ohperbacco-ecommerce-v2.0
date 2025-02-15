import Service from "./services/service";
import { Module } from "@medusajs/framework/utils";

export const WINE_MODULE = "wine";

export default Module(WINE_MODULE, { service: Service });
