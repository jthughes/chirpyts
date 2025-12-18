import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
  platform: string;
  jwtSecret: string;
  polkaSecret: string;
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./src/lib/db/migrations",
    },
  },
  platform: envOrThrow("PLATFORM"),
  jwtSecret: envOrThrow("JWT_SECRET"),
  polkaSecret: envOrThrow("POLKA_SECRET"),
};

export function envOrThrow(key: string) {
  const item = process.env[key];
  if (item === undefined) {
    throw new Error(`${key} not found`);
  }
  return item;
}
