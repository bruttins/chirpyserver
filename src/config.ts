import { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
    api: APIConfig;
    db: DBConfig;
    platform: string;
    secret: string;
}


type APIConfig = {
    fileServerHits: number;
    port: number;
    polkaKey: string;
};

export type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

process.loadEnvFile();

export const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
}

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: 8080,
        polkaKey: envOrThrow("POLKA_KEY"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    platform: envOrThrow("PLATFORM"),
    secret: envOrThrow("SECRET"),
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}