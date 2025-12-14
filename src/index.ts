import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogging, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogging);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerMetrics);
app.get("/api/reset", handlerMetricsReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
