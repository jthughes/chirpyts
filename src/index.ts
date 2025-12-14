import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogging, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics, handlerMetricsReset } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogging);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerMetricsReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
