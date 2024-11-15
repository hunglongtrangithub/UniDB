/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_KEY: string;
    // Add any other environment variables you are using
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}