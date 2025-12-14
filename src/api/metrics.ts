import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export async function handlerMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${config.fileserverHits}`);
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
