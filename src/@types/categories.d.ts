export interface Property {
    id: number;
    fullName: string;
    ruName: string;
}

export interface Category {
    id: number;
    fullName: string;
    sourceName: string;
    sourceArgument: string;
    ruName: string;
    properties: Property[];
}