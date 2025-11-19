export type AppConfig = {
    MAPTILER_API_KEY: string;
}

const config: AppConfig = {
    MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY as string
};

export default config;