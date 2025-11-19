export interface Property {
    id: number;
    fullName: string;
}

export interface Category {
    id: number;
    fullName: string;
    properties: Property[];
}