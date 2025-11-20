import type {Category} from "../@types";
import cfg from "./config.ts";

export const getCategoriesWithProperties = async (): Promise<Category[]> => {
    const resp = await fetch(`${cfg.BACKEND_URL}/osm/categories`);
    if (!resp.ok) throw new Error(`Unable to fetch ${cfg.BACKEND_URL}`);
    return resp.json();
}
