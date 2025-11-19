import cfg from '../assets/ts/config.ts';
import type {GetPointsResponse} from "../@types";

export const getCurrentPropertyPoints = async (
    category: string,
    property: string,
    latitude: number,
    longitude: number
): Promise<GetPointsResponse> => {
    let url: string = `${cfg.BACKEND_URL}/osm/points`;
    url += `?category=${category}&property=${property}&lat=${latitude}&lon=${longitude}`;
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`HTTP error: status: ${resp.status}`);
    }
    return (await resp.json()) as GetPointsResponse;
}
