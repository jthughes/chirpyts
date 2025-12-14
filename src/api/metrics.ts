import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export async function handlerMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
    <body>
      <h1>Welcome, Chirpy Admin</h1>
      <p>Chirpy has been visited ${config.fileserverHits} times!</p>
    </body>
  </html>`);
  res.status(200);
}

export async function handlerMetricsReset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: 0`);
  config.fileserverHits = 0;
  res.status(200);
}
