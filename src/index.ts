import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareError,
  middlewareLogging,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/chirps.js";

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
  Promise.resolve(handlerMetricsReset(req, res, next)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidateChirp(req, res, next)).catch(next);
});

app.use(middlewareError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
