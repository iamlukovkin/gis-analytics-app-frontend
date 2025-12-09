import cfg from './config.ts';
import type {GetPointsResponse} from "../@types";

export const getCurrentPropertyPoints = async (
    category: string,
    propertyIds: number[],
    polygonOsmId: number
): Promise<GetPointsResponse> => {
    let url: string = `${cfg.BACKEND_URL}/osm/points`;
    url += `?category=${category}&propertyIds=${propertyIds}&polygon_osm_id=${polygonOsmId}`;
    console.log(url);
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`HTTP error: status: ${resp.status}`);
    }
    return (await resp.json()) as GetPointsResponse;
}
