import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
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
      migrationsFolder: "./src/db/migrations",
    },
  },
};

export function envOrThrow(key: string) {
  const item = process.env[key];
  if (item === undefined) {
    throw new Error("DB_URL not found");
  }
  return item;
}
