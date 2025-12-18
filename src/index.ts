import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareError,
  middlewareLogging,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "./config.js";
import { handlerUsers } from "./api/users.js";
import { handlerAdminReset } from "./api/admin.js";
import {
  handlerChirpGetByID,
  handlerChirpsAddNew,
  handlerChirpsGetAll,
} from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(middlewareLogging);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// routes
app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res, next)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res, next)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerAdminReset(req, res, next)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsers(req, res, next)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res, next)).catch(next);
});

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsAddNew(req, res, next)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsGetAll(req, res, next)).catch(next);
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerChirpGetByID(req, res, next)).catch(next);
});
app.use(middlewareError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
